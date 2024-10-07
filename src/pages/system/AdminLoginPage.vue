<template>
    <v-container fluid class="fill-height bg-brown-lighten-5">
        <v-row class="d-flex flex-column justify-center align-center h-100 no-gutters">
            <v-col cols="12" md="6" lg="4" xl="3" class="flex-grow-0">
                <Login />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import Login from "@/components/user/AdminLogin.vue";
</script>

<style scoped></style>
