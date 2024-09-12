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
import { useUserViewStore } from "@/stores/userViewStore";
import api from "@/plugins/axios";

const userViewStore = useUserViewStore();
const { jwtToken, decodeToken } = userViewStore;

const userInfo = ref(null);
const collectionHouses = ref([]);
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

    collectionHouses.value = response.data.userCollections;

    // Fetch house details
    for (const house of collectionHouses.value) {
      try {
        const houseResponse = await api({
          method: "get",
          url: `/house/${house.id}`,
        });
        collections.value.push(houseResponse.data);
      } catch (error) {
        console.error("Failed to fetch house data:", error);
      }
    }
  } catch (error) {
    console.error("Failed to fetch user collections:", error);
  }
}
</script>

<style scoped></style>
