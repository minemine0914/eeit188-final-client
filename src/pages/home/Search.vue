<template>
    <v-layout style="z-index: 99" height="100%">
        <SearchHouseBar style="top: 15px" />

        <v-main ref="searchMainRef">
            <v-container
                ref="searchContainerRef"
                :style="[`height: ${containerHeight}px`]"
                :fluid="false"
            >
                <v-infinite-scroll
                    v-if="renderInfinityScrollComponent"
                    :height="searchContainerResizeObserve.height"
                    :items="filterHouseList"
                    @load="loadFilterHouses"
                    class="pt-16"
                >
                    <template v-for="(item, index) in filterHouseList" :key="index">
                        <v-sheet
                            class="d-flex align-center justify-center border mb-5 elevation-0"
                            color="brown-lighten-5"
                            rounded="xl"
                        >
                            <v-row class="fill-height" no-gutters>
                                <v-col class="pa-5" cols="12" sm="5" md="4" lg="3" xl="3">
                                    <v-sheet color="transparent" rounded="lg" class="overflow-hidden">
                                        <v-img
                                            :aspect-ratio="1"
                                            :height="200"
                                            :src="testImg"
                                            cover
                                        ></v-img>
                                    </v-sheet>
                                </v-col>
                                <v-col
                                    class="pa-5 d-flex justify-start align-start"
                                    cols="12"
                                    sm="7"
                                    md="8"
                                    lg="9"
                                    xl="9"
                                >
                                    <div class="d-flex flex-row mb-6 w-100 h-100">
                                        <v-sheet class="flex-grow-1" color="transparent">
                                            <div
                                                class="text-h5 font-weight-medium text-brown-darken-4 pt-1 mb-1"
                                            >
                                                {{ item.name }}
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mdi mdi-map-marker mr-1"></span>
                                                <span class="mr-2">{{ `位於 ${item.city}` }}</span>
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mdi mdi-bed mr-2"></span>
                                                <span class="mr-1" v-if="item.livingDiningRoom > 0">
                                                    {{ `${item.livingDiningRoom} 廳` }}
                                                </span>
                                                <span class="mr-1" v-if="item.bedroom > 0">
                                                    {{ `${item.bedroom} 房` }}
                                                </span>
                                                <span class="mr-1" v-if="item.bathroom > 0">
                                                    {{ `${item.bathroom} 淋浴` }}
                                                </span>
                                                <span class="mr-1" v-if="item.restroom > 0">
                                                    {{ `${item.restroom} 衛生` }}
                                                </span>
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mr-2" v-if="!item.pet">
                                                    <span class="mdi mdi-paw-off mr-1"></span>
                                                    <span>禁止寵物</span>
                                                </span>

                                                <span class="mr-2" v-if="!item.smoke">
                                                    <span class="mdi mdi-smoking-off mr-1"></span>
                                                    <span>禁止吸菸</span>
                                                </span>
                                            </div>
                                        </v-sheet>
                                        <v-sheet
                                            class="d-flex flex-column flex-grow-1 justify-end align-end"
                                            color="transparent"
                                        >
                                            <v-sheet color="transparent">
                                                <div
                                                    class="text-h5 font-weight-medium text-brown-darken-4 mb-2 mr-1"
                                                >
                                                    NT ${{ item.price }}
                                                </div>
                                            </v-sheet>
                                            <v-sheet color="transparent">
                                                <v-btn
                                                    color="brown-lighten-1"
                                                    min-width="130"
                                                    size="large"
                                                    :to="`/house/${item.id}`"
                                                    >詳細資訊</v-btn
                                                >
                                            </v-sheet>
                                        </v-sheet>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </template>
                    <template v-slot:empty>
                        <v-sheet>
                            <v-alert variant="plain">房源搜尋完畢! 共找到 {{ filterHouseList.length }} 個相符房源</v-alert>
                        </v-sheet>
                    </template>
                </v-infinite-scroll>
            </v-container>
        </v-main>
        <v-fab
            :active="true"
            location="bottom end"
            icon="mdi-chevron-up"
            color="success"
            size="48"
            absolute
            app
            appear
        ></v-fab>
    </v-layout>
</template>

<script setup>
import testImg from "@/assets/banner06.webp";
import SearchHouseBar from "@/components/minemine/components/SearchHouseBar.vue";
import { computed, onBeforeUnmount, onMounted, reactive, ref, nextTick } from "vue";
import { useHouseSearchStore } from "../../stores/searchHouseStore";
import { useUserViewStore } from "../../stores/userViewStore";
import { storeToRefs } from "pinia";
import { useResizeObserver } from "@vueuse/core";
const searchContainerRef = ref(null);
const searchMainRef = ref(null);
const houseSearchStore = useHouseSearchStore();
const userViewStore = useUserViewStore();
const { renderInfinityScrollComponent, currentPage, filterHouseList } =
    storeToRefs(houseSearchStore);
const { containerHeight } = storeToRefs(userViewStore);
const searchContainerResizeObserve = reactive({ width: 0, height: 0 });
const viewMode = ref("list"); // list or grid
const isShowInfoCard = ref(false);

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

async function loadFilterHouses({ done }) {
    let data = await houseSearchStore.getFilterHouses({ page: currentPage.value, limit: 10 });
    console.log("Infinity scroll get data...");
    if (data != null) {
        if (!data.empty) {
            filterHouseList.value.push(...data.content);
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
