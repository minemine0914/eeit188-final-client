<template>
  <div class="record-container">
    <v-card
      v-if="record?.records.length === 0"
      class="mx-auto mb-5"
      subtitle="您目前沒有任何未結帳的訂單"
      width="450"
      height="50"
    ></v-card>
    <v-card
      v-for="r in record?.records"
      :key="r"
      class="mx-auto mb-5 custom-card"
      color="grey-lighten-3"
      width="450"
      min-height="140"
    >
      <div class="content">
        <v-card-subtitle class="custom-subtitle">{{
          r.house.name
        }}</v-card-subtitle>
        <v-img
          class="main-img"
          width="100"
          :src="fetchImage(r)"
          @click="handleClick(r)"
        ></v-img>
      </div>
      <div class="info">
        <v-text>已支付新台幣 {{ r.cashFlow }} 元</v-text>
        <v-text id="date-time">{{ formatDate(r.createdAt) }}</v-text>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import notFoundImg from "@/assets/ImageNotAvailable02.webp";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { user } = userStore;

const record = reactive({
  records: [],
});

onMounted(() => {
  fetchRecords();
});

async function fetchRecords() {
  try {
    const response = await api({
      method: "post",
      url: "/transcation_record/search",
      data: {
        userId: user.id,
        limit: 100,
        order: "createdAt",
        dir: true,
      },
    });

    record.records.push(...response.data.content);
  } catch (error) {
    console.log(error);
  }
}

const fetchImage = (r) => {
  if (r.house.houseExternalResourceRecords[0]) {
    return (
      import.meta.env.VITE_API_URL +
      `/house-external-resource/image/${r.house.houseExternalResourceRecords[0].id}`
    );
  } else {
    return notFoundImg;
  }
};

const handleClick = (r) => {
  const url = `/house/${r.house.id}`;
  window.open(url, "_blank");
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
</script>

<style scoped>
.record-container {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 700px;
  max-height: 700px;
  overflow-y: auto;
}

.content {
  position: absolute;
  left: 20px;
  top: 10px;
}

.custom-card {
  display: flex;
}

.info {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
}

.custom-subtitle {
  font-size: 20px;
  font-weight: bold;
}

.main-img {
  cursor: pointer;
}

#date-time {
  margin-left: 130px;
}
</style>
