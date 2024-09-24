<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <!-- 房源名稱 -->
      <v-text-field label="房源名稱" v-model="property.name" required></v-text-field>

      
      <!-- 房源類別 -->
      <v-select :items="categories" label="房源類別" v-model="property.category" required></v-select>

      <!-- 房源描述 -->
      <v-textarea label="房源描述" v-model="property.information" rows="3" required></v-textarea>

      <!-- 圖片上傳 -->
      <v-file-input label="上傳圖片" v-model="property.images" multiple show-size accept="image/*"></v-file-input>

      <!-- 地址欄位 -->
      <v-select :items="countries" label="國家" v-model="property.country" required outlined></v-select>
      <v-select :items="cities" label="城市" v-model="property.city" required outlined></v-select>
      <v-select :items="districts" label="行政區" v-model="property.region" required outlined></v-select>
      <v-text-field label="街道與門牌號碼" v-model="property.address" required></v-text-field>

      <!-- 經緯度自動生成 -->
      <v-text-field label="經度" v-model="property.latitudeX" readonly></v-text-field>
      <v-text-field label="緯度" v-model="property.longitudeY" readonly></v-text-field>

      <!-- 房間設置 -->
      <v-text-field label="客廳數量" v-model="property.livingDiningRoom" type="number"></v-text-field>
      <v-text-field label="臥室數量" v-model="property.bedroom" type="number"></v-text-field>
      <v-text-field label="浴室數量" v-model="property.bathroom" type="number"></v-text-field>
      <v-text-field label="廁所數量" v-model="property.restroom" type="number"></v-text-field>

      <!-- 價格設置 -->
      <v-text-field label="每日價格" v-model="property.pricePerDay" type="number" required></v-text-field>
      <v-text-field label="每週價格" v-model="property.pricePerWeek" type="number"></v-text-field>
      <v-text-field label="每月價格" v-model="property.pricePerMonth" type="number"></v-text-field>


      <!-- 額外設置 -->
      <v-checkbox label="允許寵物" v-model="property.pet"></v-checkbox>
      <v-checkbox label="允許吸煙" v-model="property.smoke"></v-checkbox>
      <v-checkbox label="廚房" v-model="property.kitchen"></v-checkbox>
      <v-checkbox label="陽台" v-model="property.balcony"></v-checkbox>

      <!-- 提交按鈕 -->
      <v-btn type="submit" color="primary">提交</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useHouseDetailStore } from '@/stores/houseDetailStore'

const property = ref({
  name: '',
  category: '',
  information: '',
  country: '',
  city: '',
  region: '',
  address: '',
  latitudeX: null,
  longitudeY: null,
  pricePerDay: 0,
  pricePerWeek: 0,
  pricePerMonth: 0,
  livingDiningRoom: 0,
  bedroom: 0,
  bathroom: 0,
  restroom: 0,
  pet: false,
  smoke: false,
  kitchen: false,
  balcony: false,
  images: [], // 用來存放多張圖片
})

const categories = ['公寓', '別墅', '小木屋']
const countries = ['台灣', '日本', '美國']
const cities = ['台北', '東京', '紐約']
const districts = ['大安區', '澀谷區', '曼哈頓區']

const houseDetailStore = useHouseDetailStore()

const submitForm = async () => {
  try {
    // 先處理經緯度的生成（這裡可以根據地址調用API自動生成）
    // 在這裡假設經緯度已經生成
    property.value.latitudeX = 25.0330
    property.value.longitudeY = 121.5654

    // 發送表單資料到後端
    await houseDetailStore.createProperty(property.value)
    alert('房源已成功提交！')
  } catch (error) {
    console.error('提交失敗', error)
    alert('提交失敗，請稍後再試')
  }
}
</script>

<style scoped>
</style>
