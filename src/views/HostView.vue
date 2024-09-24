<template>
    <v-app v-resize="onResize">
      <v-app-bar :elevation="2" ref="appbarRef">
        <v-app-bar-title>
          <span class="pa-3 cursor-pointer" @click="$router.push('/')"
            >Nomad</span
          >
        </v-app-bar-title>
        <v-spacer></v-spacer>
        <template v-slot:append>
          <v-btn
            v-if="!jwtToken"
            elevation="3"
            color="brown-darken-1"
            rounded="pill"
            size="large"
            density="comfortable"
            to="/login"
            class="ml-2"
            prepend-icon="mdi-login"
            >登入</v-btn
          >
          <v-btn
            v-if="!jwtToken"
            elevation="3"
            color="brown-darken-1"
            rounded="pill"
            size="large"
            density="comfortable"
            to="/signup"
            class="ml-2 mr-5"
            prepend-icon="mdi-account-plus"
            >註冊</v-btn
          >
          <v-btn
            v-if="jwtToken"
            icon="mdi-message-outline"
            elevation="3"
            color="brown-darken-1"
            rounded="pill"
            size="large"
            density="comfortable"
            class="mr-2"
            to="/chat"
          ></v-btn>
          <v-menu v-if="jwtToken" v-model="memberMenu" offset="15">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                rounded="pill"
                size="large"
                :class="['elevation-3', 'px-3', 'mr-5']"
                color="brown-darken-1"
              >
                <template v-slot:prepend>
                  <v-avatar color="surface-variant" size="small">
                    <v-img :src="user?.avatarBase64"></v-img>
                  </v-avatar>
                </template>
                <div class="text-body-1" style="min-width: 50px">
                  {{ user?.name }}
                </div>
              </v-btn>
            </template>
            <v-list density="compact" width="200" rounded="lg">
              <v-list-item to="/member" prepend-icon="mdi-account" slim
                >會員中心</v-list-item
              >
              <v-list-item to="/detail" prepend-icon="mdi-list-box" slim
                >查詢訂單</v-list-item
              >
              <v-list-item to="/host" prepend-icon="mdi-home-group-plus" slim
                >成為房東</v-list-item
              >
              <v-list-item prepend-icon="mdi-logout" slim @click="handleLogout"
                >登出</v-list-item
              >
            </v-list>
          </v-menu>
        </template>
        <!-- <v-btn v-if="jwtToken" >登出</v-btn> -->
      </v-app-bar>
      <v-navigation-drawer app permanent>
      <v-list>
        
        <v-list-item v-for="item in menuItems" :key="item.path">
          <v-btn text @click="navigateTo(item.path)">
            {{ item.title }}
          </v-btn>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
      
      
      <v-main>
        <v-container>
          <router-view></router-view>
        </v-container>
      </v-main>


      <v-dialog v-model="isOpenLoginDialog" width="auto">
        <v-card
          max-width="400"
          prepend-icon="mdi-update"
          text="Your application will relaunch automatically after the update is complete."
          title="Update in progress"
        >
          <template v-slot:actions>
            <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
          </template>
        </v-card>
      </v-dialog>
    </v-app>
  </template>
  <script setup>
  import avaterImg from "@/assets/banner01.webp";
  import { useElementSize } from "@vueuse/core";
  import { ref } from "vue";
  import { useRouter } from 'vue-router'
  import { useUserViewStore } from "../stores/userViewStore";
  import { useUserStore } from "../stores/userStore";
  import { storeToRefs } from "pinia";
  

  const menuItems = ref([
  { title: '管理房源', path: '/lo/property-management' },
  { title: '新增房源', path: '/lo/add-property' },
  { title: '訂單管理', path: '/lo/order-records' },
  { title: '預約管理', path: '/lo/reservation-management' },
  { title: '住客評價', path: '/lo/reviews' },
  { title: '分析報表', path: '/lo/reports' },
])

const router = useRouter()
const navigateTo = (path) => {
  router.push(path)
}
  const userViewStore = useUserViewStore();
  const {
    windowSize,
    containerHeight,
    isOpenLoginDialog,
    memberMenu,
    appbarRef,
  } = storeToRefs(userViewStore);
  const { height: appbarHeight } = useElementSize(appbarRef);
  
  const userStore = useUserStore();
  const { user, jwtToken, logout } = userStore;
  
  let timeoutId = null; // 儲存定時器 ID
  function onResize() {
    if (timeoutId) {
      clearTimeout(timeoutId); // 如果有之前的定時器，先清除它
    }
    // 設置延遲更新高度
    timeoutId = setTimeout(() => {
      // console.log("Resizing...");
      windowSize.value = { x: window.innerWidth, y: window.innerHeight };
      containerHeight.value = window.innerHeight - appbarHeight.value;
      // console.log(containerHeight.value);
    }, 100); // 300 毫秒的延遲
  }
  
  // 登出
  function handleLogout() {
    const confirmLogout = window.confirm("請確認是否要登出");
  
    if (confirmLogout) {
      logout();
    }
  }
  </script>
  <style scoped></style>
  