<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-h4 font-weight-bold mb-4">管理圖片 - {{ property.name }}</h2>
      </v-col>
    </v-row>

    <!-- 已上傳的圖片列表 -->
    <v-row>
      <v-col
        v-for="image in property.houseExternalResourceRecords"
        :key="image"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="d-flex flex-column align-center mb-4"
      >
        <v-card>
          <v-img
            :src="imageUrl(image.id)"
            :alt="'Image ' + image?.id"
            height="200px"
            class="align-center"
          ></v-img>
          <v-card-actions>
            <v-btn
              color="error"
              block
              @click="removeImage(image?.id)"
              class="mt-2"
            >
              移除圖片
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-4"></v-divider>

    <!-- 上傳新圖片 -->
    <v-row>
      <v-col cols="12" md="8">
        <v-file-input
          label="上傳新圖片"
          v-model="newImages"
          accept="image/*"
          multiple
          prepend-icon="mdi-image-plus"
        ></v-file-input>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn color="primary" block @click="uploadImages" class="mt-4">
          上傳圖片
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagementStore'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2' // 引入 SweetAlert2

const store = useHostManagementStore()
const route = useRoute()
const propertyId = ref(null)
const property = ref({})
const newImages = ref(null)

// 獲取圖片
const fetchPropertyImages = async () => {
  property.value = await store.fetchHouseById(propertyId.value)

  for (let i = 0; i < property.value.houseExternalResourceRecords.length; i++) {
    console.log(property.value.houseExternalResourceRecords[i].id)
  }
}

// 圖片的URL生成函數
const imageUrl = (imageId) => {
  console.log(imageId)
  return `http://localhost:8080/house-external-resource/image/${imageId}`
}

// 移除圖片
const removeImage = async (imageId) => {
  try {
    await store.deleteImage(propertyId.value, imageId);
    await fetchPropertyImages(); // 更新圖片列表
    Swal.fire({
      icon: 'success',
      title: '移除成功',
      text: '圖片已成功移除。',
    });
  } catch (error) {
    console.error('Failed to delete image:', error);
    Swal.fire({
      icon: 'error',
      title: '移除失敗',
      text: '移除圖片時發生錯誤，請稍後再試。',
    });
  }
};

// 上傳圖片
const uploadImages = async () => {
  if (newImages.value && newImages.value.length > 0) {
    try {
      for (const file of newImages.value) {
        await store.uploadPropertyImage(propertyId.value, file);
      }
      await fetchPropertyImages(); // 更新圖片列表
      newImages.value = null; // 清空上傳圖片的欄位
      Swal.fire({
        icon: 'success',
        title: '上傳成功',
        text: '圖片已成功上傳。',
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      Swal.fire({
        icon: 'error',
        title: '上傳失敗',
        text: '上傳圖片時發生錯誤，請稍後再試。',
      });
    }
  } else {
    Swal.fire({
      icon: 'info',
      title: '未選擇圖片',
      text: '請先選擇要上傳的圖片。',
    });
  }
};

onMounted(() => {
  propertyId.value = route.params.propertyId;
  fetchPropertyImages();
} )
</script>

<style scoped>
.v-img {
  border-radius: 8px;
}
</style>
