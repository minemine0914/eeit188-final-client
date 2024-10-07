<template>
    <v-navigation-drawer app permanent :width="240">
        <v-list>
            <v-list-item v-for="item in menuItems" :key="item.path" :to="item.path" color="brown">
                <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                </template>
                <template v-slot:title>
                    <div class="text-body-1 font-weight-bold">
                        {{ item.title }}
                    </div>
                </template>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
    <!-- <nav>
        <v-btn to="/system/BookingManagement">訂單</v-btn>
        <v-btn to="/system/UserManagement">使用者</v-btn>
        <v-btn to="/system/RoomManagement">房屋</v-btn>
        <v-btn to="/system/PropertyApproval">審核</v-btn>
        <v-btn to="/system/PromotionsandDiscountsManagement">優惠券</v-btn>
        <v-btn to="/system/FinancialManagement">當日金流</v-btn>
        <v-btn to="/system/PlatformReport">歷史紀錄</v-btn>
        <router-link to="/system/Test"><v-btn>測試</v-btn></router-link>
      </nav> -->

    <router-view></router-view>
</template>

<script setup>
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/userStore";
const menuItems = ref([
    {
        title: "訂單管理",
        path: "/system/BookingManagement",
        icon: "mdi-invoice-list",
    },
    {
        title: "使用者管理",
        path: "/system/UserManagement",
        icon: "mdi-account-details",
    },
    {
        title: "房源管理",
        path: "/system/RoomManagement",
        icon: "mdi-home-group",
    },
    {
        title: "房源審核",
        path: "/system/PropertyApproval",
        icon: "mdi-shield-home",
    },
    {
        title: "優惠券管理",
        path: "/system/PromotionsandDiscountsManagement",
        icon: "mdi-ticket-percent",
    },
    {
        title: "當日金流",
        path: "/system/FinancialManagement",
        icon: "mdi-cash-fast",
    },
    {
        title: "歷史紀錄",
        path: "/system/PlatformReport",
        icon: "mdi-clipboard-text-clock",
    },
]);
const userStore = useUserStore();
const isAdmin = computed(() => userStore.user.role === "admin");
</script>
<style scoped></style>
