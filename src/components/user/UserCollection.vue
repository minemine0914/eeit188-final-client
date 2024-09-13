<template>
  <div>
    <v-card
      v-for="house in collections"
      :key="house.id"
      class="mx-auto mb-5"
      subtitle="您收藏的房源"
      width="400"
    >
      <v-card-text class="bg-surface-light pt-4">
        {{ house.name }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { decodeToken } = userStore;

const userInfo = ref(null);
const collections = ref([]);

onMounted(() => {
  getUserCollectionHouse();
});

async function getUserCollectionHouse() {
  try {
    userInfo.value = decodeToken();

    // Fetch user collections
    const response = await api({
      method: "get",
      url: "/user-collection/from-user/" + userInfo.value.id,
    });

    collections.value = response.data.userCollections;
  } catch (error) {
    console.error("Failed to fetch user collections:", error);
  }
}
</script>

<style scoped></style>
