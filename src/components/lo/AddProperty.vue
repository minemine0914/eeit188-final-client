<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <!-- 名稱 -->
      <v-text-field label="房源名稱" v-model="property.name" required></v-text-field>

      <!-- 房源類別選單 -->
      <v-select :items="houseCategories" label="房源類別" v-model="property.house_category_id" required outlined></v-select>

      <!-- 房源描述 -->
      <v-textarea label="房源描述" v-model="property.information" rows="3" required></v-textarea>

      <!-- 地址欄位 -->
      <v-select :items="countries" label="國家" v-model="property.country" required outlined></v-select>
      <v-select :items="cities" label="城市" v-model="property.city" required outlined></v-select>
      <v-select :items="districts" label="行政區" v-model="property.region" required outlined></v-select>
      <v-text-field label="街道與門牌號碼" v-model="property.address" required></v-text-field>

      <!-- 成人、兒童、寵物、吸煙 -->
      <v-checkbox label="允許成人" v-model="property.adult"></v-checkbox>
      <v-checkbox label="允許兒童" v-model="property.children"></v-checkbox>
      <v-checkbox label="允許寵物" v-model="property.pet"></v-checkbox>
      <v-checkbox label="允許吸煙" v-model="property.smoke"></v-checkbox>

      <!-- 房間設置 -->
      <v-text-field label="客廳/飯廳數量" v-model="property.living_dining_room" type="number"></v-text-field>
      <v-text-field label="浴室數量" v-model="property.bathroom" type="number"></v-text-field>
      <v-text-field label="廁所數量" v-model="property.restroom" type="number"></v-text-field>
      <v-checkbox label="廚房" v-model="property.kitchen"></v-checkbox>
      <v-checkbox label="陽台" v-model="property.balcony"></v-checkbox>
      <v-text-field label="臥室數量" v-model="property.bedroom" type="number"></v-text-field>

      <!-- 價格設置 -->
      <v-text-field label="每日價格" v-model="property.price_per_day" type="number" required></v-text-field>
      <v-text-field label="每週價格" v-model="property.price_per_week" type="number"></v-text-field>
      <v-text-field label="每月價格" v-model="property.price_per_month" type="number"></v-text-field>

      <!-- 是否顯示房源 -->
      <v-checkbox label="顯示房源" v-model="property.show"></v-checkbox>

      <!-- 提交按鈕 -->
      <v-btn type="submit" color="primary">提交</v-btn>
    </v-form>
  </v-container>

</template>

<script>
export default {
  data() {
    return {
      property: {
        name: '',
        house_category_id: '',
        information: '',
        country: '',
        city: '',
        region: '',
        address: '',
        adult: false,
        children: false,
        pet: false,
        smoke: false,
        living_dining_room: 0,
        bathroom: 0,
        restroom: 0,
        kitchen: false,
        balcony: false,
        bedroom: 0,
        price_per_day: 0,
        price_per_week: 0,
        price_per_month: 0,
        show: false
      },
      houseCategories: [], // 房源類別選項，可以後續填充
      countries: [], // 國家選項
      cities: [], // 城市選項
      districts: [] // 行政區選項
    };
  },
  methods: {
    submitForm() {
      // 提交表單資料的邏輯
      console.log('提交的資料:', this.property);
    }
  }
};
</script>
