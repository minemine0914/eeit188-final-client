<template>
    <v-layout style="z-index: 99" height="100%">
        <SearchHouseBar style="top: 15px" />
        <v-main ref="searchMainRef">
            <v-container
                ref="searchContainerRef"
                :style="[`height: ${containerHeight}px`]"
                class="py-0"
            >
             
            </v-container>
        </v-main>
    </v-layout>
</template>
<script setup>
import SearchHouseBar from "@/components/home/SearchHouseBar.vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref, nextTick } from "vue";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { useUserViewStore } from "@/stores/userViewStore";
import { storeToRefs } from "pinia";
import { useResizeObserver } from "@vueuse/core";
const searchContainerRef = ref(null);
const searchMainRef = ref(null);
const houseSearchStore = useHouseSearchStore();
const userViewStore = useUserViewStore();
const { currentFilterHousePage, filterHouseList } =
    storeToRefs(houseSearchStore);
const { containerHeight } = storeToRefs(userViewStore);
const searchContainerResizeObserve = reactive({ width: 0, height: 0 });

// ResizeObserver on searchContainer
let timeoutId = null;
useResizeObserver(searchContainerRef, (entries) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        console.log(`width: ${width}, height: ${height}`);
        searchContainerResizeObserve.height = height;
    }, 100); // 設定 500 毫秒的延遲
});

async function loadFilterHouse({ done }) {
    console.log("Get FilterHouse data...");
    let data = await houseSearchStore.getFilterHouse();
    if (data != null) {
        if (!data.empty) {
            filterHouseList.value.push(...data.content);
            currentFilterHousePage.value++;
            console.log(`Read house list ok! Page: ${currentFilterHousePage.value}`);
            done("ok");
        } else {
            console.log(`Read house list empty! Page: ${currentFilterHousePage.value}`);
            done("empty");
        }
    } else {
        console.log(`Read house list error! Page: ${currentFilterHousePage.value}`);
        done("error");
    }
}

onMounted(() => {
    // houseSearchStore.getFilterHouses({ page: 0, limit: 20 });
});

onBeforeUnmount(() => {
    if (timeoutId) clearTimeout(timeoutId);
});
</script>
<style>
    
</style>