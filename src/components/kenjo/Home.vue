<template>
    <div>
      <h1>Home</h1>
      <nav>
        <router-link to="/System/BookingManagement"><v-btn>訂單</v-btn></router-link>
        <router-link to="/System/UserManagement"><v-btn>使用者</v-btn></router-link>
        <router-link to="/System/FinancialManagement"><v-btn>當日金流</v-btn></router-link>
        <router-link to="/System/PromotionsandDiscountsManagement"><v-btn>優惠券</v-btn></router-link>
        <router-link to="/System/PropertyApproval"> <v-btn>審核</v-btn></router-link>
        <router-link to="/System/RoomManagement"> <v-btn>房屋</v-btn></router-link>
        <!-- <router-link to="/System/Test"><v-btn>測試</v-btn></router-link> -->
        
        
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
