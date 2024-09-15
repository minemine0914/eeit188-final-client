<template>
    <v-app v-resize="onResize">
        <v-app-bar :elevation="2" ref="appbarRef">
            <v-app-bar-title>
                <span class="pa-3 cursor-pointer" @click="$router.push('/')">Nomad</span>
            </v-app-bar-title>
            <v-btn v-if="!jwtToken" to="/login">登入</v-btn>
            <v-btn v-if="!jwtToken" to="/signup">註冊</v-btn>
            <template v-if="jwtToken" v-slot:append>
                <v-menu v-model="memberMenu" offset="15">
                    <template v-slot:activator="{ props }">
                        <v-hover>
                            <template v-slot:default="{ isHovering, hoverProps }">
                                <v-btn
                                    v-bind="{ ...props, ...hoverProps }"
                                    rounded="pill"
                                    size="large"
                                    :class="[
                                        'pa-1',
                                        isHovering ? 'elevation-1' : 'elevation-3',
                                        'px-3',
                                        'mr-5',
                                    ]"
                                    color="brown-darken-1"
                                >
                                    <template v-slot:prepend>
                                        <v-avatar
                                            color="surface-variant"
                                            size="small"
                                            :key="avatarKey"
                                            ><v-img :src="user?.avatarBase64"></v-img
                                        ></v-avatar>
                                    </template>
                                    <div class="text-body-1" :key="nameKey">
                                        {{ user?.name }}
                                    </div>
                                </v-btn>
                            </template>
                        </v-hover>
                    </template>
                    <v-list density="compact" width="200" rounded="lg">
                        <v-list-item to="/member" prepend-icon="mdi-account" slim
                            >會員中心</v-list-item
                        >
                        <v-list-item to="/host" prepend-icon="mdi-home-group-plus" slim
                            >成為房東</v-list-item
                        >
                        <v-list-item to="/logout" prepend-icon="mdi-logout" slim>登出</v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <v-btn v-if="jwtToken" @click="handleLogout">登出</v-btn>
        </v-app-bar>
        <v-main>
            <router-view @userChange="reload"></router-view>
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
import { useUserViewStore } from "../stores/userViewStore";
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";

const userViewStore = useUserViewStore();
const { windowSize, containerHeight, isOpenLoginDialog, memberMenu, appbarRef } =
    storeToRefs(userViewStore);
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

// 同步更新大頭貼及名稱
const avatarKey = ref(0);
const nameKey = ref(0);

function reload() {
    avatarKey.value++;
    nameKey.value++;
}
</script>
<style scoped></style>
