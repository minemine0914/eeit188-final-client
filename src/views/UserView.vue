<template>
    <v-app>
        <v-app-bar :elevation="2">
            <v-app-bar-title>Nomad</v-app-bar-title>
            <template v-slot:append>
                <v-avatar :image="avaterImg" class="mr-3"></v-avatar>
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
import { ref } from "vue";
const isOpenDialog = ref(false);
</script>
<style scoped></style>
