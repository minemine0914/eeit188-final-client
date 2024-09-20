<template>
  <div class="container" @scroll="handleScroll">
    <v-card
      v-if="coupon.coupons.length === 0"
      class="mx-auto mb-5"
      subtitle="您目前沒有任何優惠券"
      width="400"
    ></v-card>
    <v-card
      v-for="(coupon, index) in coupon?.coupons"
      :key="coupon?.id"
      class="mx-auto mb-5"
      id="coupon"
      subtitle="您的優惠券"
      width="400"
    >
      <v-card class="mx-auto" width="400">
        <v-card-text
          v-if="coupon?.discount != null"
          class="bg-surface-light pt-4"
        >
          折扣： {{ coupon?.discount }} 元
        </v-card-text>
        <v-card-text
          v-if="coupon?.discountRate != null"
          class="bg-surface-light pt-4"
        >
          {{ (Math.round(coupon?.discountRate * 10) / 10) * 10 }} 折
        </v-card-text>
        <v-card-text class="bg-surface-light pt-4">
          折扣到期日: {{ expireDate?.expireDates[index] }}
        </v-card-text>
      </v-card>
    </v-card>
    <div v-if="hasMore && coupon.coupons.length !== 0" class="loader"></div>
    <v-text class="bottom-text" v-if="!hasMore">已經到底囉～</v-text>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { user } = userStore;

const coupon = reactive({
  coupons: [],
});
const expireDate = reactive({
  expireDates: [],
});

const page = ref(0);
const limit = ref(5);
const isFetching = ref(false); // Prevent multiple fetches
const hasMore = ref(true); // Flag to check if there are more pages to load

onMounted(async () => {
  const request = {
    userId: user.id,
    page: page.value,
    limit: limit.value,
  };

  await getUserCollectionHouse(request);
});

async function getUserCollectionHouse(request) {
  if (isFetching.value || !hasMore.value) return;

  isFetching.value = true; // Set fetching to true to prevent duplicate requests

  try {
    const response = await api({
      method: "post",
      url: "/coupon/search",
      data: request,
    });

    const fetchedCoupons = response.data.content;

    // Append new coupons to the list
    if (fetchedCoupons.length > 0) {
      coupon.coupons.push(...fetchedCoupons);
      calculateExpireDates();
    } else {
      hasMore.value = false; // No more data to fetch
    }
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    throw error;
  } finally {
    isFetching.value = false; // Set fetching to false after completion
  }
}

function calculateExpireDates() {
  expireDate.expireDates = coupon.coupons.map((c) => {
    const createdAt = new Date(c.createdAt);
    const expireDate = new Date(
      createdAt.getTime() + c.expire * 24 * 60 * 60 * 1000
    );

    const year = expireDate.getFullYear();
    const month = String(expireDate.getMonth() + 1).padStart(2, "0");
    const day = String(expireDate.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
  });
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
  const request = {
    userId: user.id,
    page: page.value,
    limit: limit.value,
  };

  await getUserCollectionHouse(request);
}
</script>

<style scoped>
.container {
  margin-left: 200px;
  width: 450px;
  height: 500px;
  max-height: 500px;
  overflow-y: auto;
}

#coupon {
  display: flex;
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
</style>
