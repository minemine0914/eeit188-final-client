<template>
    <v-container v-if="isErrorGetHouseInfo || isLoading">Loading...</v-container>
    <v-container v-else="!isErrorGetHouseInfo && !isLoading">
        <div class="text-h5">預訂房源 {{ houseInfo.name }}</div>
    </v-container>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "@/stores/houseDetailStore";
import { storeToRefs } from "pinia";
// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const { houseInfo, isErrorGetHouseInfo, isLoading, isLoadingCollection, isCollected } =
    storeToRefs(houseDetailStore);
watch(
    // Watch Route params houseId change
    () => route.params.houseId,
    (newId, oldId) => {
        console.log(newId, oldId);
        houseDetailStore.getHouseInfo(newId);
    }
);
onMounted(async () => {
    if (route.params.houseId) {
        // If Route params houseId found
        console.log("Found houseId in url param: " + route.params.houseId);
        await houseDetailStore.getHouseInfo(route.params.houseId);
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    } else {
        // If Route params houseId not found
        console.log("HouseId not found in url param! Take you to home page!");
        isErrorGetHouseInfo.value = true;
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    }
});
</script>
<style scoped></style>
