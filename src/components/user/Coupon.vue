<template>
  <div>
    <v-card
      v-for="(coupon, index) in coupons"
      :key="coupon.id"
      class="mx-auto mb-5"
      id="coupon"
      subtitle="您的優惠券"
      width="400"
    >
      <v-card class="mx-auto" width="400">
        <v-card-text
          v-if="coupon.discount != null"
          class="bg-surface-light pt-4"
        >
          折扣： {{ coupon.discount }} 元
        </v-card-text>
        <v-card-text
          v-if="coupon.discountRate != null"
          class="bg-surface-light pt-4"
        >
          {{ (Math.round(coupon.discountRate * 10) / 10) * 10 }} 折
        </v-card-text>
        <v-card-text class="bg-surface-light pt-4">
          折扣到期日: {{ expireDates[index] }}
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserViewStore } from "@/stores/userViewStore";
import api from "@/plugins/axios";

const userViewStore = useUserViewStore();
const { decodeToken } = userViewStore;

const userInfo = ref(null);
const coupons = ref([]);
const expireDates = ref([]);

onMounted(async () => {
  userInfo.value = decodeToken();

  const request = {
    userId: userInfo.value.id,
    page: 0,
    limit: 10,
  };

  getUserCollectionHouse(request);
});

async function getUserCollectionHouse(request) {
  try {
    const response = await api({
      method: "post",
      url: "/coupon/search",
      data: request,
    });
    coupons.value = response.data.content;
    calculateExpireDates();
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    throw error;
  }
}

function calculateExpireDates() {
  expireDates.value = coupons.value.map((coupon) => {
    const createdAt = new Date(coupon.createdAt);
    const expireDate = new Date(
      createdAt.getTime() + coupon.expire * 24 * 60 * 60 * 1000
    );

    // Reverse date format to YYYY/MM/DD
    const year = expireDate.getFullYear();
    const month = String(expireDate.getMonth() + 1).padStart(2, "0"); // Add leading zero
    const day = String(expireDate.getDate()).padStart(2, "0"); // Add leading zero

    return `${year}/${month}/${day}`;
  });
}
</script>

<style scoped>
#coupon {
  display: flex;
}
</style>
