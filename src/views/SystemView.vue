<template>
    <v-app>
        <v-app-bar :elevation="2" ref="appbarRef">
            <v-app-bar-title>
                <v-sheet color="transparent" class="d-flex flex-row justify-start align-center">
                    <v-sheet
                        color="transparent"
                        class="d-flex flex-row justify-center align-center cursor-pointer"
                        @click="$router.push('/system')"
                        height="60px"
                    >
                        <NomadSvg class="text-brown" style="height: 65%" />
                        <span
                            class="font-weight-black text-brown-darken-1 text-h5"
                            style="font-family: 'Tenor Sans'"
                        >
                            NOMAD
                        </span>
                    </v-sheet>
                </v-sheet>
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
                    to="/system/login"
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
                    to="/system/createAdmin"
                    class="ml-2 mr-5"
                    prepend-icon="mdi-logout"
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
                    to="/system/admin-chat"
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
                        <v-list-item to="/system/admin" prepend-icon="mdi-account" slim>
                            管理中心
                        </v-list-item>
                        <v-list-item prepend-icon="mdi-logout" slim @click="handleLogout">
                            登出
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- <v-btn v-if="jwtToken" >登出</v-btn> -->
        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup>
import NomadSvg from "@/assets/nomad.svg?component";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/userStore";
import { useUserViewStore } from "../stores/userViewStore";
import Swal from "sweetalert2";
// import Home from '../components/kenjo/Home.vue';

const userStore = useUserStore();
const { user, jwtToken, adminLogout } = storeToRefs(userStore);
const userViewStore = useUserViewStore();
const { memberMenu } = storeToRefs(userViewStore);

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
            userStore.adminLogout();
        }
    });
}
</script>
<style scoped></style>
