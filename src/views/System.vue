<template>
    <v-app>
        <v-app-bar :elevation="2">
            <v-app-bar-title>System</v-app-bar-title>
        </v-app-bar>
        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>
<script setup></script>
<style scoped></style>
