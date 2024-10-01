<template>
  <v-container>
    <h2>管理圖片 - {{ property.name }}</h2>

    <!-- 已上傳的圖片列表 -->
    <v-row>
      <v-col v-for="image in property.houseExternalResourceRecords" :key="image" cols="12" sm="4">
        <v-img :src="imageUrl(image.id)" :alt="'Image ' + image?.id" height="200px">
        </v-img>
        <v-btn small color="error" @click="removeImage(image?.id)" class="mt-2">
            移除
          </v-btn>
      </v-col>
    </v-row>

    <!-- 上傳新圖片 -->
    <v-file-input label="上傳新圖片" v-model="newImages" accept="image/*" multiple></v-file-input>
    <v-btn color="primary" @click="uploadImages">上傳圖片</v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagementStore'
import { useRoute } from 'vue-router'

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
    fetchPropertyImages(); // 更新圖片列表
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
};


// 上傳圖片
const uploadImages = async () => {
  if (newImages.value && newImages.value.length > 0) {
    try {
      for (const file of newImages.value) {
        await store.uploadPropertyImage(propertyId.value, file);
      }
      fetchPropertyImages(); // 更新圖片列表
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }
};


onMounted(() => {
  propertyId.value = route.params.propertyId;
  fetchPropertyImages();
} )
</script>
