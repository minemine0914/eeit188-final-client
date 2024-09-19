<template>
    <router-view></router-view>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useUserStore } from './stores/userStore';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
const userStore = useUserStore();
const { jwtToken } = storeToRefs(userStore);
onMounted(()=>{
    if ( jwtToken.value ) {
        userStore.reloadUser();
    }
});
</script>

<style scoped></style>
