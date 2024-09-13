<template>
    <v-app v-resize="onResize">
        <v-app-bar :elevation="2" ref="appbarRef">
            <v-app-bar-title>
                <span class="pa-3 cursor-pointer" @click="$router.push('/')">Nomad</span>
            </v-app-bar-title>
            <template v-slot:append>
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
                                            :image="avaterImg"
                                            size="small"
                                        ></v-avatar>
                                    </template>
                                    <div class="text-body-1">nickname</div>
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
        </v-app-bar>
        <v-main>
            <router-view></router-view>
        </v-main>
        <v-dialog v-model="isOpenDialog" width="auto">
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
import { storeToRefs } from "pinia";
// const userViewStore = useUserViewSt ore();
// storeToRefs()
const isOpenDialog = ref(false);
const memberMenu = ref(false);
const appbarRef = ref(null);
const windowSize = ref({
    x: 0,
    y: 0,
});
const containerHeight = ref(1);
const { height: appbarHeight } = useElementSize(appbarRef);
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
</script>
<style scoped></style>
