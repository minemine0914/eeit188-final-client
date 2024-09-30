<template>
  <v-container>
    <h2>管理圖片 - {{ property.name }}</h2>

    <!-- 已上傳的圖片列表 -->
    <v-row>
      <v-col v-for="image in propertyImages" :key="image.id" cols="12" sm="4">
        <v-img :src="imageUrl(image.id)" :alt="'Image ' + image.id" height="200px">
          <v-btn small color="error" @click="removeImage(image.id)" class="mt-2">
            移除
          </v-btn>
        </v-img>
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
const propertyId = route.params.propertyId
const property = ref({})
const propertyImages = ref([])
const newImages = ref(null)

// 獲取圖片
const fetchPropertyImages = async () => {
  property.value = await store.fetchHouseById(propertyId)
  const result = await store.fetchPropertyImages(propertyId)
  propertyImages.value = result.data.content || []
}

// 圖片的URL生成函數
const imageUrl = (imageId) => {
  return `/house-external-resource/image/${imageId}`
}

// 移除圖片
const removeImage = async (imageId) => {
  await store.deleteImage(imageId)
  fetchPropertyImages() // 更新圖片
}

// 上傳圖片
const uploadImages = async () => {
  if (newImages.value && newImages.value.length > 0) {
    const formData = new FormData()
    for (const file of newImages.value) {
      formData.append('files', file)
    }
    formData.append('houseId', propertyId)
    await store.uploadPropertyImages(formData)
    fetchPropertyImages() // 更新圖片
  }
}

onMounted(fetchPropertyImages)
</script>
