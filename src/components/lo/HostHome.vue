<template>
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <v-card
            class="mb-2"
            v-for="(item, index) in menuItems"
            :key="index"
            @click="navigateTo(item.path)"
            :class="selectedMenu === item.path ? 'selected-card' : ''"
          >
            <v-card-title>{{ item.title }}</v-card-title>
          </v-card>
        </v-col>
  
        <v-col cols="9">
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedMenu: '', 
        menuItems: [
          { title: '管理房源', path: '/lo/property-management' },
          { title: '新增房源', path: '/lo/add-property' },
          { title: '歷史訂單', path: '/lo/order-records' },
          { title: '未來訂單', path: '/lo/reservation-management' },
          { title: '我的評論', path: '/lo/reviews' },
        ],
      };
    },
    methods: {
      navigateTo(path) {
        this.selectedMenu = path;
        this.$router.push(path); 
      },
    },
  };
  </script>
  
  <style scoped>
  .selected-card {
    background-color: #e0f7fa;
  }
  </style>
  