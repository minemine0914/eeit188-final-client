<template>
    <v-layout style="z-index: 90" height="100%">
        <SearchHouseBar style="top: 30px" />
        <v-main>
            <v-container
                ref="searchContainerRef"
                :style="[`height: ${containerHeight}px`]"
                class="py-0"
                fluid
            >
                <!-- Map -->
                <SearchMapOpenlayers />
                <!-- Result controll -->
                <SearchMapResultControll />
            </v-container>
        </v-main>
    </v-layout>
</template>
<script setup>
import SearchHouseBar from "@/components/home/SearchHouseBar.vue";
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { useUserViewStore } from "@/stores/userViewStore";
import { storeToRefs } from "pinia";
import { useResizeObserver } from "@vueuse/core";
import SearchMapOpenlayers from "../../components/home/SearchMapOpenlayers.vue";
import SearchMapResultControll from "../../components/home/SearchMapResultControll.vue";

const searchContainerRef = ref(null);
const houseSearchStore = useHouseSearchStore();
const userViewStore = useUserViewStore();
const { currentFilterHousePage, filterHouseList, searchParams } = storeToRefs(houseSearchStore);
const { containerHeight } = storeToRefs(userViewStore);
const searchContainerResizeObserve = reactive({ width: 0, height: 0 });

// // ResizeObserver on searchContainer
// let timeoutId = null;
// useResizeObserver(searchContainerRef, (entries) => {
//     if (timeoutId) clearTimeout(timeoutId);
//     timeoutId = setTimeout(() => {
//         const entry = entries[0];
//         const { width, height } = entry.contentRect;
//         console.log(`width: ${width}, height: ${height}`);
//         searchContainerResizeObserve.height = height;
//     }, 100); // 設定 500 毫秒的延遲
// });

onMounted(() => {
    // houseSearchStore.getFilterHouses({ page: 0, limit: 20 });
});

onBeforeUnmount(() => {
    // if (timeoutId) clearTimeout(timeoutId);
});
onBeforeUnmount(() => {
    searchParams.value.minLatitudeX = null;
    searchParams.value.maxLatitudeX = null;
    searchParams.value.minLongitudeY = null;
    searchParams.value.maxLongitudeY = null;
});
</script>
<style></style>
