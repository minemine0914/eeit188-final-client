<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-text-field label="房源名稱" v-model="propertyName" required></v-text-field>
      <v-text-field label="房源狀態" v-model="propertyStatus" required></v-text-field>
      <v-btn type="submit" color="primary">提交</v-btn>
      <v-btn @click="$emit('close')">取消</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      propertyName: '',  // 根據傳入的 id 從 API 加載房源數據
      propertyStatus: '可預訂', // 模擬的預設值
    };
  },
  mounted() {
    this.loadPropertyData(this.id);
  },
  methods: {
    loadPropertyData(id) {
      console.log('加載房源數據 ID:', id);
      // 模擬 API 請求來加載房源數據
      this.propertyName = `房源 #${id}`;
      this.propertyStatus = '已預訂'; // 假設 API 返回的房源狀態
    },
    submitForm() {
      console.log('提交編輯:', this.propertyName, this.propertyStatus);
      // 處理提交邏輯，調用 API 來保存編輯的數據
    },
  },
};
</script>
