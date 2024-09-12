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
    data() {
      return {
        propertyName: '',
        propertyStatus: ''
      };
    },
    methods: {
      submitForm() {
        console.log('新增房源:', this.propertyName, this.propertyStatus);
        // 處理新增房源的邏輯（API 調用等）
      },
    },
  };
  </script>
  