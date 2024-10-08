<template>
 <v-container fluid class="fill-height bg-brown-lighten-5">
        <v-row class="d-flex flex-column justify-center align-center h-100 no-gutters">
            <v-col cols="12" md="10" lg="8" xl="7" class="flex-grow-0">
                <v-sheet :rounded="true" class="overflow-hidden">
                    <Signup />
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import Signup from "@/components/user/CreateAdmin.vue";
</script>

<style scoped>
</style>
