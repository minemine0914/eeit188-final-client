<template>
  <div class="container" @scroll="onScroll">
    <v-card
      v-if="discuss?.discusses.length === 0"
      class="mx-auto mb-5"
      subtitle="您目前沒有發布任何評論"
      width="400"
    ></v-card>
    <div
      class="inner-container"
      v-for="(d, index) in discuss?.discusses"
      :key="d?.id"
    >
      <v-card
        class="mx-auto mb-5"
        color="grey-lighten-3"
        id="card1"
        width="400"
        height="350"
      >
        <v-card-subtitle class="custom-subtitle">{{
          d?.house
        }}</v-card-subtitle>
        <v-img
          class="main-img"
          height="280"
          :src="fetchImage(d?.externalResourceId)"
          @click="handleClick(d)"
        ></v-img>
      </v-card>
      <v-card
        class="mx-auto mb-5"
        color="grey-lighten-3"
        id="card2"
        width="400"
      >
        <v-rating
          v-model="score.scores[index]"
          class="ma-2"
          color="warning"
          density="default"
        ></v-rating>
        <v-textarea v-model="d.discuss" label="評論"></v-textarea>
        <v-text v-if="!d?.updatedAt"
          >發布時間： {{ formatDate(d.createdAt) }}</v-text
        >
        <v-text v-if="d?.updatedAt"
          >上次修改時間： {{ formatDate(d.updatedAt) }}</v-text
        >
        <div class="btn-container">
          <v-btn
            @click="
              updateDiscuss(d?.id, d?.discuss, d?.houseId, score?.scores[index])
            "
          >
            修改評論
          </v-btn>
          <v-btn id="retract-btn" @click="retractDiscuss(d?.id, d?.houseId)">
            收回評論
          </v-btn>
        </div>
      </v-card>
    </div>
    <div
      v-if="!isBottom && discuss?.discusses.length >= 5"
      class="loader"
    ></div>
    <v-text
      class="bottom-text"
      v-if="isBottom && discuss?.discusses.length !== 0"
      >已經到底囉～</v-text
    >
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";
import Swal from "sweetalert2";
import notFoundImg from "@/assets/ImageNotAvailable02.webp";

const userStore = useUserStore();
const { user } = userStore;

const totalDiscuss = ref(0);
const currentPage = ref(0);
const pageSize = ref(5);
const totalPages = ref(0);
const isLoading = ref(false); // Prevent multiple requests when scrolling
const isBottom = ref(false);
const score = reactive({
  scores: [],
});

const discuss = reactive({
  discusses: [],
});

onMounted(async () => {
  await countTotalDiscuss();
  await fetchDiscusses();
});

const fetchDiscusses = async () => {
  if (isLoading.value) {
    return;
  }

  if (currentPage.value >= totalPages.value) {
    isBottom.value = true;
    return;
  }

  isLoading.value = true;

  try {
    const response = await api({
      method: "get",
      url: `/discuss/user/${user.id}`,
      params: {
        pageNo: currentPage.value,
        pageSize: pageSize.value,
      },
    });

    for (let d of response.data.discusses) {
      discuss.discusses.push(d);
    }

    currentPage.value++;

    await fetchScore();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const countTotalDiscuss = async () => {
  try {
    const response = await api({
      method: "get",
      url: `/discuss/count-from-user/${user.id}`,
    });

    totalDiscuss.value = response.data;
    totalPages.value = Math.ceil(totalDiscuss.value / pageSize.value);
  } catch (error) {
    console.error("Failed to fetch user discusses:", error);
  }
};

const fetchScore = async () => {
  for (let d of discuss.discusses) {
    try {
      const response = await api({
        method: "get",
        url: `/house/mongo/find/${user.id}/${d.houseId}`,
      });
      score.scores.push(response.data.score);
    } catch (error) {
      console.error("Failed to fetch user discusses:", error);
    }
  }
};

const fetchImage = (id) => {
  if (id) {
    return (
      import.meta.env.VITE_API_URL + `/house-external-resource/image/${id}`
    );
  } else {
    return notFoundImg;
  }
};

const updateDiscuss = async (discussId, discuss, houseId, score) => {
  Swal.fire({
    title: "是否確定要更改評論？",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        api({
          method: "put",
          url: `/discuss/update/${discussId}`,
          data: { discuss: discuss },
        });

        api({
          method: "post",
          url: `/house/mongo/rate`,
          data: {
            userId: user.id,
            houseId: houseId,
            score: score,
          },
        });

        Swal.fire({
          title: "您的評論已修改成功！",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "修改失敗，請重新修改",
          icon: "error",
        });
        console.error(error);
      }
    }
  });
};

const retractDiscuss = async (discussId) => {
  Swal.fire({
    title: "是否確定要收回評論？",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        api({
          method: "put",
          url: `/discuss/retract/${discussId}`,
        });

        for (let i = 0; i < discuss.discusses.length; i++) {
          if (discuss.discusses[i].id === discussId) {
            discuss.discusses.splice(i, 1);
            break;
          }
        }

        Swal.fire({
          title: "您的評論已收回！",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "收回失敗，請重新操作一次",
          icon: "error",
        });
        console.error(error);
      }
    }
  });
};

// Date formatting function
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat("zh-TW", options).format(new Date(dateString));
};

const handleClick = (d) => {
  const url = `/house/${d.houseId}`;
  window.open(url, "_blank");
};

// Scroll event handler
const onScroll = async (event) => {
  const container = event.target;
  if (
    container.scrollHeight - container.scrollTop <=
    container.clientHeight + 10
  ) {
    await fetchDiscusses();
  }
};
</script>

<style scoped>
.container {
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
}

.search {
  margin-bottom: 30px;
}

.inner-container {
  display: flex;
  margin: 10px;
  gap: 10px;
}

.btn-container {
  margin-top: 30px;
}

#retract-btn {
  margin-left: 30px;
}

.custom-subtitle {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
}

#card1 {
  padding: 10px;
}

#card2 {
  text-align: center;
}

.loader {
  margin-left: auto;
  margin-right: auto;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.bottom-text {
  margin-left: 50%;
}

.main-img {
  cursor: pointer;
}
</style>
