<template>
  <div class="collection-container">
    <v-card
      v-for="house in collection.collections"
      :key="house.id"
      class="mx-auto mb-5 custom-card"
      color="surface-light"
      min-width="300px"
      :subtitle="house.name"
    >
      <v-card-text class="bg-surface-light pt-4">
        <v-img
          v-if="house.images.length === 0"
          src="src/assets/ImageNotAvailable02.webp"
        ></v-img>
        <v-img v-for="image in house.images" :key="image" :src="image"></v-img>
        <v-btn
          class="btn"
          @click="
            removeCollection({
              userId: user.id,
              houseId: house.houseId,
            })
          "
          >移除收藏</v-btn
        >
      </v-card-text>
    </v-card>
  </div>
  <v-pagination
    v-model="pageNo"
    :length="totalPages"
    :total-visible="5"
    @update:modelValue="handleInput"
  ></v-pagination>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { user } = userStore;

const collection = reactive({
  collections: [],
});
const pageNo = ref(1);
const pageSize = ref(3); // Set default page size
const totalPages = ref(0); // To track total pages

onMounted(async () => {
  await getUserCollectionHouse(pageNo.value - 1, pageSize.value);
  totalPages.value = (await getTotalCount()) / pageSize.value;
  await getUserCollectionHouseImages();
});

async function handleInput() {
  await getUserCollectionHouse(pageNo.value - 1, pageSize.value);
  await getUserCollectionHouseImages();
}

async function getUserCollectionHouse(pageNo, pageSize) {
  try {
    const response = await api({
      method: "get",
      url: "/user-collection/from-user/" + user.id,
      params: { pageNo, pageSize },
    });

    collection.collections = response.data.userCollections.map(
      (collection) => ({
        ...collection,
        images: [], // Initialize an empty images array for each collection
      })
    );
  } catch (error) {
    console.error("Failed to fetch user collections:", error);
  }
}

async function getTotalCount() {
  try {
    const response = await api({
      method: "get",
      url: "/user-collection/from-user/total-count/" + user.id,
    });
    return response.data.totalCollectionsCount;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function removeCollection(request) {
  const confirmDelete = confirm("確認是否要移除收藏？");

  if (confirmDelete) {
    try {
      await api({
        method: "post",
        url: "/user-collection/delete",
        data: request,
      });
      alert("已成功移除收藏");
      await getUserCollectionHouse(pageNo.value - 1, pageSize.value);
      await getUserCollectionHouseImages();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function getUserCollectionHouseImages() {
  for (let collection of collection.collections) {
    for (let id of collection.externalResourciesId) {
      try {
        const response = await api({
          method: "get",
          url: `/house-external-resource/image/${id}`,
          responseType: "blob",
        });
        const img = window.URL.createObjectURL(response.data);
        collection.images.push(img);
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    }
  }
}
</script>

<style scoped>
.collection-container {
  display: flex;
  gap: 50px;
}

.btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
