<template>
    <v-app v-resize="onResize">
        <v-app-bar :elevation="2" ref="appbarRef">
            <v-app-bar-title>
                <v-sheet color="transparent" class="d-flex flex-row justify-start align-center">
                    <v-sheet
                        color="transparent"
                        class="d-flex flex-row justify-center align-center cursor-pointer"
                        @click="$router.push('/')"
                        height="60px"
                    >
                        <NomadSvg class="text-brown-darken-1" style="height: 65%" />
                        <span
                            class="font-weight-black text-brown-darken-1 text-h5"
                            style="font-family: 'Tenor Sans'"
                        >
                            NOMAD
                        </span>
                    </v-sheet>
                </v-sheet>
            </v-app-bar-title>
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
                        <v-list-item to="/member" prepend-icon="mdi-account" slim>
                            會員中心
                        </v-list-item>
                        <v-list-item to="/order" prepend-icon="mdi-list-box" slim>
                            查詢訂單
                        </v-list-item>
                        <v-list-item
                            to="/host/property-management"
                            prepend-icon="mdi-home-group-plus"
                            slim
                        >
                            {{ user.houseCount > 0 ? "管理房源" : "成為房東" }}
                        </v-list-item>
                        <v-list-item @click="submit" prepend-icon="mdi-message-outline" slim
                            >聯絡我們</v-list-item
                        >
                        <v-list-item prepend-icon="mdi-logout" slim @click="handleLogout">
                            登出
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-app-bar>

        <v-navigation-drawer app permanent>
            <v-list>
                <v-list-item
                    v-for="item in menuItems"
                    :key="item.path"
                    :to="item.path"
                    color="brown"
                >
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

        <v-main>
            <router-view></router-view>
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
import NomadSvg from "@/assets/nomad.svg?component";
import { useElementSize } from "@vueuse/core";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserViewStore } from "../stores/userViewStore";
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";
import Swal from "@/plugins/sweetalert2";

const menuItems = ref([
    {
        title: "管理房源",
        path: "/host/property-management",
        icon: "mdi-home-edit",
    },
    { title: "新增房源", path: "/host/add-property", icon: "mdi-home-plus" },
    {
        title: "訂單管理",
        path: "/host/order-records",
        icon: "mdi-order-bool-descending-variant",
    },
    { title: "入住 Check In", path: "/host/check-in", icon: "mdi-qrcode-scan" },
    { title: "分析報表", path: "/host/reports", icon: "mdi-home-analytics" },
]);

const router = useRouter();
const navigateTo = (path) => {
    router.push(path);
};
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

async function submit() {
    try {
        await addChatRecord({
            chat: `這裡是系統客服中心，請問有什麼需要協助的地方嗎？`,
            senderId: "11cf0713-0c98-421f-821f-ded2a6484948",
            receiverId: user.value.id,
        }).then(() => {
            router.push("/chat");
        });
    } catch (error) {
        console.error("Error adding chat record:", error);
    }
}

// 登出
function handleLogout() {
    Swal.fire({
        title: "請確認是否要登出?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }).then((result) => {
        if (result.isConfirmed) {
            userStore.logout();
        }
    });
}
</script>
<style scoped></style>
