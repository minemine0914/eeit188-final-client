<template>
    <v-layout style="z-index: 99" height="100%" class="position-relative">
        <!-- <v-navigation-drawer border="0">
            <v-list>
                <v-list-item title="分類"></v-list-item>
            </v-list>
        </v-navigation-drawer> -->
        <v-main ref="searchMainRef">
            <SearchHouseBar class="mt-0" />
            <v-container fluid class="fill-height" ref="searchContainerRef">
                <v-infinite-scroll
                    :height="searchContainerResizeObserve.height"
                    :items="houseList"
                    :onLoad="load"
                    class="pt-8 w-100"
                >
                    <template v-for="(item, index) in houseList" :key="index">
                        <v-card min-height="300px" elevation="3" border="1" class="ma-1">
                            <v-card-item class="h-100">
                                <v-row
                                    class="flex-nowrap fill-height"
                                    no-gutters
                                >
                                    <v-col class="flex-grow-0 flex-shrink-0" cols="2">
                                        <v-sheet class="ma-2 pa-2"> I'm 2 column wide </v-sheet>
                                    </v-col>
                                    <v-col
                                        class="flex-grow-1 flex-shrink-0"
                                        cols="1"
                                        style="min-width: 100px; max-width: 100%"
                                    >
                                        <v-sheet class="ma-2 pa-2">
                                            I'm 1 column wide and I grow to take all the space
                                        </v-sheet>
                                    </v-col>
                                    <v-col
                                        class="flex-grow-0 flex-shrink-1"
                                        cols="5"
                                        style="min-width: 100px"
                                    >
                                        <v-sheet class="ma-2 pa-2">
                                            I'm 5 column wide and I shrink if there's not enough
                                            space
                                        </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-card-item>
                        </v-card>
                    </template>
                    <template v-slot:empty>
                        <v-alert type="warning">已無房源可供讀取!</v-alert>
                    </template>
                </v-infinite-scroll>
            </v-container>
        </v-main>
    </v-layout>
</template>

<script setup>
import SearchHouseBar from "@/components/minemine/components/SearchHouseBar.vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useHouseSearchStore } from "../../stores/searchHouseStore";
import { storeToRefs } from "pinia";
import { useElementSize, useResizeObserver } from "@vueuse/core";
const searchContainerRef = ref(null);
const searchMainRef = ref(null);
const houseSearchStore = useHouseSearchStore();
const { filterHouseList } = storeToRefs(houseSearchStore);
const searchContainerResizeObserve = reactive({ width: 0, height: 0 });
const houseList = reactive([]);
const currentPage = ref(0);
// ResizeObserver on searchContainer
let timeoutId = null;
useResizeObserver(searchContainerRef, (entries) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        console.log(`width: ${width}, height: ${height}`);
        searchContainerResizeObserve.height = height;
    }, 500); // 設定 500 毫秒的延遲
});

async function load({ done }) {
    // Perform API call
    // const res = await api();
    // await houseSearchStore.getFilterHouses({ page: 0, limit: 20 });
    // items.value.push(...res);
    let data = await houseSearchStore.getFilterHouses({ page: currentPage.value, limit: 20 });
    console.log("Infinity scroll get data...");
    if (data != null) {
        if (!data.empty) {
            houseList.push(...data.content);
            currentPage.value++;
            console.log(`Read house list ok! Page: ${currentPage.value}`);
            done("ok");
        } else {
            console.log(`Read house list empty! Page: ${currentPage.value}`);
            done("empty");
        }
    } else {
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
<style scoped>
:deep(.v-skeleton-loader > *) {
    margin: 0;
}

:deep(.v-skeleton-loader .v-skeleton-loader__image) {
    display: flex;
    flex-grow: 1;
    height: 100%;
    flex-direction: column;
}
</style>
