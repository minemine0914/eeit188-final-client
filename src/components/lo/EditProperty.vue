<template>
    <v-container>
      <v-form @submit.prevent="submitForm">
        <v-text-field label="房源名稱" v-model="propertyName" required></v-text-field>
        <v-text-field label="房源狀態" v-model="propertyStatus" required></v-text-field>
        <v-btn type="submit" color="primary">提交</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    props: ['id'],
    data() {
      return {
        propertyName: this.id,  // 根據傳入的房源ID來加載房源名稱
        propertyStatus: '可預訂' // 模擬的預設值，實際可以從 API 中獲取
      };
    },
    methods: {
      submitForm() {
        console.log('編輯房源:', this.propertyName, this.propertyStatus);
        // 處理編輯房源的邏輯（API 調用等）
      },
    },
  };
  </script>
  