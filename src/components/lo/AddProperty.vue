<template>
  <!-- 根據 step 控制顯示不同的表單頁面 -->
  <v-container v-if="step === 1">
    <v-form @submit.prevent="goToNextStep">
      <!-- 房源名稱 -->
      <v-text-field label="房源名稱" v-model="property.name" required></v-text-field>

      <!-- 房源描述 -->
      <v-textarea label="房源描述" v-model="property.information" rows="3" required></v-textarea>

      <!-- 房源類別選單 -->
      <v-select :items="houseCategories" label="房源類別" v-model="property.house_category_id" required outlined></v-select>

      <!-- 建議人數與最大人數 -->
      <v-text-field label="建議人數" v-model="property.recommendedOccupancy" type="number" required></v-text-field>
      <v-text-field label="最大人數" v-model="property.maxOccupancy" type="number" required></v-text-field>

      <!-- 可加床 -->
      <v-checkbox label="可加床" v-model="property.extraBeds"></v-checkbox>

      <!-- 適合成人與兒童數量 -->
      <v-text-field label="成人數" v-model="property.adults" type="number" required></v-text-field>
      <v-text-field label="兒童數" v-model="property.childrenCount" type="number"></v-text-field>

      <!-- 自助入住選項 -->
      <v-checkbox label="支持自助入住" v-model="property.selfCheckIn"></v-checkbox>
      <v-text-field label="密碼鎖編號" v-model="property.lockCode" v-if="property.selfCheckIn"></v-text-field>
      <v-textarea label="自助入住指南" v-model="property.checkInInstructions" v-if="property.selfCheckIn"></v-textarea>

      <!-- 下一步按鈕 -->
      <v-btn type="submit" color="primary">下一步</v-btn>
    </v-form>
  </v-container>

  <v-container v-if="step === 2">
    <v-form @submit.prevent="goToNextStep">
      <!-- 地址欄位 -->
      <v-select :items="countries" label="國家" v-model="property.country" required outlined></v-select>
      <v-select :items="cities" label="城市" v-model="property.city" required outlined></v-select>
      <v-select :items="districts" label="行政區" v-model="property.region" required outlined></v-select>
      <v-text-field label="街道與門牌號碼" v-model="property.address" required></v-text-field>

      <!-- 房間設置 -->
      <v-text-field label="客廳/飯廳數量" v-model="property.living_dining_room" type="number"></v-text-field>
      <v-text-field label="浴室數量" v-model="property.bathroom" type="number"></v-text-field>
      <v-text-field label="廁所數量" v-model="property.restroom" type="number"></v-text-field>
      <v-text-field label="臥室數量" v-model="property.bedroom" type="number"></v-text-field>
      <v-checkbox label="廚房" v-model="property.kitchen"></v-checkbox><v-checkbox label="陽台" v-model="property.balcony"></v-checkbox>
      
      
      
      
      
      
      
      
      <!-- 上一步和下一步按鈕 -->
      <v-btn @click="goToPreviousStep" color="primary">上一步</v-btn>
      <v-btn type="submit" color="primary">下一步</v-btn>
    </v-form>
  </v-container>

  <v-container v-if="step === 3">
    <v-form @submit.prevent="submitForm">
      <!-- 價格設置 -->
      <v-text-field label="每日價格" v-model="property.price_per_day" type="number" required></v-text-field>
      <v-text-field label="每週價格" v-model="property.price_per_week" type="number"></v-text-field>
      <v-text-field label="每月價格" v-model="property.price_per_month" type="number"></v-text-field>

      <!-- 圖片上傳 -->
      <v-file-input label="上傳圖片" v-model="property.images" multiple show-size accept="image/*"></v-file-input>

      <!-- 是否顯示房源 -->
      <v-checkbox label="顯示房源" v-model="property.show"></v-checkbox>

      <!-- 上一步和提交按鈕 -->
      <v-btn @click="goToPreviousStep" color="primary">上一步</v-btn>
      <v-btn type="submit" color="primary">提交</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      step: 1, // 控制分頁的變量
      property: {
        name: '',
        house_category_id: '',
        information: '',
        recommendedOccupancy: 0,
        maxOccupancy: 0,
        extraBeds: false,
        adults: 0,
        childrenCount: 0,
        selfCheckIn: false,
        lockCode: '',
        checkInInstructions: '',
        country: '',
        city: '',
        region: '',
        address: '',
        living_dining_room: 0,
        bathroom: 0,
        restroom: 0,
        kitchen: false,
        balcony: false,
        bedroom: 0,
        price_per_day: 0,
        price_per_week: 0,
        price_per_month: 0,
        images: [],
        show: false
      },
      houseCategories: [], // 房源類別選項，可以後續填充
      countries: [], // 國家選項
      cities: [], // 城市選項
      districts: [] // 行政區選項
    };
  },
  methods: {
    goToNextStep() {
      // 確保所有必填資料已填寫
      if (this.step < 3) {
        this.step++;
      }
    },
    goToPreviousStep() {
      // 返回上一步
      if (this.step > 1) {
        this.step--;
      }
    },
    submitForm() {
      // 提交表單資料的邏輯
      console.log('提交的資料:', this.property);
      // 可以在這裡發送 API 請求，將資料提交至後端
    }
  }
};
</script>