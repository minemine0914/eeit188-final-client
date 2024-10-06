<template>
    <div>
      <h1></h1>
      <nav>
        <v-btn to="/system/BookingManagement">訂單</v-btn>
        <v-btn to="/system/UserManagement">使用者</v-btn>
        <v-btn to="/system/RoomManagement">房屋</v-btn>
        <v-btn to="/system/PropertyApproval">審核</v-btn>
        <v-btn to="/system/PromotionsandDiscountsManagement">優惠券</v-btn>
        <v-btn to="/system/FinancialManagement">當日金流</v-btn>
        <v-btn to="/system/PlatformReport">歷史紀錄</v-btn>
        <!-- <router-link to="/system/Test"><v-btn>測試</v-btn></router-link> -->
      </nav>
      <router-view></router-view>
    </div>
  </template>

<script >
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const isAdmin = computed(() => userStore.user.role === 'admin');
</script>
<style scoped>
</style>
