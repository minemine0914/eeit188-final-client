<template>
  <v-card class="mx-auto">
    <template v-slot:title>
      <span class="font-weight-black">個人簡介</span>
    </template>

    <v-card-text class="bg-surface-light pt-4">
      {{ user?.about }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();
const { user } = userStore;
</script>

<style scoped></style>
