<template>
  <div class="container">
    <v-text-field
      class="search"
      v-model="search"
      density="compact"
      label="查詢"
      prepend-inner-icon="mdi-magnify"
      variant="solo-filled"
      flat
      hide-details
      single-line
      width="300"
      @update:modelValue="handleInput"
    ></v-text-field>
    <div class="collection-container">
      <v-card
        v-if="collection.collections.length === 0"
        class="mx-auto mb-5"
        subtitle="您目前沒有已收藏的房源"
        width="300"
      ></v-card>
      <v-card
        v-for="house in collection.collections"
        :key="house?.id"
        class="mx-auto mb-5"
        color="surface-light"
        width="300"
        height="350"
      >
        <v-card-subtitle class="custom-subtitle">{{
          house?.name
        }}</v-card-subtitle>
        <v-card-text class="bg-surface-light pt-4">
          <div class="image" @click="handleClick(house)">
            <v-img
              v-if="house?.images.length === 0"
              src="src/assets/ImageNotAvailable02.webp"
            ></v-img>
            <v-img :src="house?.images[0]"></v-img>
          </div>
          <v-btn
            class="btn"
            @click="
              removeCollection({
                userId: user?.id,
                houseId: house?.houseId,
              })
            "
            >移除收藏</v-btn
          >
        </v-card-text>
      </v-card>
    </div>
    <div class="paging">
      <v-pagination
        v-model="pageNo"
        :length="totalPages"
        :total-visible="5"
        @update:modelValue="handleInput"
      ></v-pagination>
      <v-select
        v-model="pageNo"
        :items="availablePage.availablePages"
        label="快速移動至頁面"
        variant="solo"
        hide-details
        width="200"
        @update:modelValue="handleInput"
      ></v-select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";
import Swal from "@/plugins/sweetalert2";

const userStore = useUserStore();
const { user } = userStore;

const collection = reactive({
  collections: [],
});
const pageNo = ref(1);
const pageSize = ref(4);
const totalPages = ref(0);
const search = ref("");
const availablePage = reactive({
  availablePages: [],
});

onMounted(async () => {
  totalPages.value = Math.ceil((await getTotalCount()) / pageSize.value);
  await getUserCollectionHouse(pageNo.value - 1, pageSize.value, search.value);
  updateAvailablePages();
});

async function handleInput() {
  totalPages.value = Math.ceil((await getTotalCount()) / pageSize.value);
  await getUserCollectionHouse(pageNo.value - 1, pageSize.value, search.value);
  updateAvailablePages();
}

async function getUserCollectionHouse(pageNo, pageSize, search) {
  try {
    let response;
    if (search === "") {
      response = await api({
        method: "get",
        caches: false,
        url: `/user-collection/from-user/${user.id}`,
        params: { pageNo, pageSize },
      });
    } else {
      response = await api({
        method: "get",
        caches: false,
        url: `/user-collection/from-user/${user.id}/${search}`,
        params: { pageNo, pageSize },
      });
    }

    collection.collections.splice(0, collection.collections.length);

    collection.collections = response.data.userCollections.map(
      (collection) => ({
        ...collection,
        images: [], // Initialize an empty images array for each collection
      })
    );

    await getUserCollectionHouseImages();
  } catch (error) {
    collection.collections = [];
    console.error(error);
  }
}

async function getTotalCount() {
  try {
    let response;
    if (search.value === "") {
      response = await api({
        method: "get",
        caches: false,
        url: `/user-collection/from-user/total-count/${user.id}`,
      });
    } else {
      response = await api({
        method: "get",
        caches: false,
        url: `/user-collection/from-user/total-count/${user.id}/${search.value}`,
      });
    }

    return response.data.totalCollectionsCount;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function removeCollection(request) {
  Swal.fire({
    title: "確認是否要移除收藏?",
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
          method: "post",
          url: "/user-collection/delete",
          data: request,
        }).then(() => {
          handleInput();
        });
        Swal.fire({
          title: "已成功移除!",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "移除失敗，請再試一次",
          icon: "error",
        });
        console.error(error);
      }
    }
  });
}

async function getUserCollectionHouseImages() {
  for (let house of collection.collections) {
    for (let id of house.externalResourciesId) {
      try {
        const response = await api({
          method: "get",
          caches: false,
          url: `/house-external-resource/image/${id}`,
          responseType: "blob",
        });
        const img = window.URL.createObjectURL(response.data);
        house.images.push(img);
      } catch (error) {
        console.error("Failed to load image:", error);
      }
    }
  }
}

function handleClick(house) {
  const url = `/house/${house.houseId}`;
  window.open(url, "_blank");
}

function updateAvailablePages() {
  availablePage.availablePages = [];
  for (let i = totalPages.value; i >= 1; i--) {
    availablePage.availablePages.push(i);
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 200px;
}

.search {
  margin-bottom: 30px;
}

.collection-container {
  display: flex;
  gap: 50px;
}

.btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.custom-subtitle {
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold;
}

.image {
  cursor: pointer;
}

.paging {
  display: flex;
  margin-top: 10px;
}
</style>
