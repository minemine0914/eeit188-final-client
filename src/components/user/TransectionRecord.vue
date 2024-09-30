<template>
  <div class="record-container" @scroll="handleScroll">
    <v-card
      v-if="record?.records.length === 0"
      class="mx-auto mb-5"
      subtitle="您目前沒有任何交易紀錄"
      width="600"
      height="50"
    ></v-card>
    <v-card
      v-for="r in record?.records"
      :key="r"
      class="mx-auto mb-5 custom-card"
      color="grey-lighten-3"
      width="600"
      min-height="150"
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
        <v-text>支付新台幣 {{ r?.cashFlow }} 元</v-text>
        <v-text>{{ formatDate(r?.createdAt) }}</v-text>
      </div>
      <v-text class="deal">{{ r?.deal }}</v-text>
      <v-btn class="btn" @click="openQrCode(r)">QR CODE</v-btn>
    </v-card>
    <div v-if="hasMore && record.records.length >= 5" class="loader"></div>
    <v-text class="bottom-text" v-if="!hasMore && record.records.length !== 0"
      >已經到底囉～</v-text
    >
  </div>
  <v-dialog v-model="dialog" width="auto">
    <v-card max-width="400" title="您的QR CODE">
      <v-text>{{ ticket }}</v-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import notFoundImg from "@/assets/ImageNotAvailable02.webp";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { user } = userStore;

const record = reactive({
  records: [],
});

const ticket = ref(null);

const page = ref(0);
const isFetching = ref(false);
const hasMore = ref(true);
const dialog = ref(false);

onMounted(() => {
  fetchRecords();
});

async function fetchRecords() {
  if (isFetching.value || !hasMore.value) return;
  isFetching.value = true;

  try {
    const response = await api({
      method: "post",
      url: "/transcation_record/search",
      data: {
        userId: user.id,
        page: page.value,
        limit: 5,
        order: "createdAt",
        dir: true,
      },
    });

    const fatchedRecords = response.data.content;

    if (fatchedRecords.length > 0) {
      record.records.push(...response.data.content);
    } else {
      hasMore.value = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isFetching.value = false;
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

const openQrCode = (r) => {
  fetchTicket(r);
  dialog.value = true;
};

async function fetchTicket(r) {
  try {
    let response;
    if (r.ticket.id) {
      response = await api({
        method: "get",
        url: `/ticket/${r.ticket.id}`,
      });
    } else {
      response = await api({
        method: "get",
        url: `/ticket/${r.ticket}`,
      });
    }

    ticket.value = response.data.id;
  } catch (error) {
    console.log(error);
  }
}

function handleScroll(event) {
  const container = event.target;

  // Check if scrolled to bottom
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    loadNextPage();
  }
}

async function loadNextPage() {
  if (isFetching.value || !hasMore.value) return;

  page.value++; // Increment the page

  await fetchRecords();
}

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
  width: 650px;
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
  align-items: center;
}

.info {
  display: flex;
  flex-direction: column;
  margin-left: 150px;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
}

.custom-subtitle {
  font-size: 20px;
  font-weight: bold;
}

.deal {
  margin-right: 30px;
}

.main-img {
  cursor: pointer;
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

.btn {
  margin-right: 30px;
}
</style>
