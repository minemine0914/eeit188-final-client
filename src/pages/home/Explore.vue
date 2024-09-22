<template>
    <v-container
        ref="exploreContainerRef"
        :style="[`height: ${containerHeight}px`]"
        class="pa-0"
        fluid
    >
        <!-- Infinity scroll -->
        <v-infinite-scroll
            :height="exploreContainerResizeObserve.height"
            :items="allHouseList"
            @load="loadAllHouse"
        >
            <!-- Scroll empty component -->
            <template v-slot:empty>
                <v-sheet>
                    <v-alert variant="plain">
                        <span>您看完了所有房源! 共 </span>
                        <span>{{ allHouseList.length }}</span>
                        <span> 個房源</span>
                    </v-alert>
                </v-sheet>
            </template>
            <!-- Explore Banner -->
            <v-parallax
                :src="primaryBannerImg"
                height="360px"
                width="100%"
                class="posiiton-relative"
            >
                <div class="d-flex flex-column fill-height justify-center align-center text-white">
                    <div class="text-h3 font-weight-black mb-4 opacity-80">Nomad</div>
                    <div class="subheading font-weight-regular">住宿 旅遊 重新定義居住自由</div>
                </div>
            </v-parallax>
            <!-- SearchHouseBar -->
            <v-sheet class="position-relative">
                <SearchHouseBar style="top: -100px" />
            </v-sheet>
            <!-- Hot Houses -->
            <v-container fluid class="pa-0 my-5">
                <v-sheet class="mb-3">
                    <div class="text-h5 font-weight-medium mx-15">熱門推薦</div>
                    <v-slide-group show-arrows>
                        <v-slide-group-item v-if="hotHouseList.length === 0" v-for="n in 15" :key="n">
                            <v-card class="ma-2" height="320" width="300" elevation="0">
                                <v-skeleton-loader
                                    class="mx-auto"
                                    type="card, list-item-two-line"
                                />
                            </v-card>
                        </v-slide-group-item>
                        <v-slide-group-item v-else v-for="hotHouse in hotHouseList" :key="hotHouse.id">
                            <HouseCard :house="hotHouse" min-width="320"/>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-container>
            <!-- Ads for House host -->
            <v-parallax :src="secondaryBannerImg" height="320">
                <div class="d-flex flex-column fill-height justify-center align-center text-white">
                    <h1 class="text-h4 font-weight-black mb-4 opacity-80">分享您的空間</h1>
                    <h4 class="subheading font-weight-regular">為大家提供舒適的住宿體驗</h4>
                    <v-btn variant="outlined" class="mt-5">立即加入</v-btn>
                </div>
            </v-parallax>
            <!-- Height rating houses -->
            <v-container fluid class="pa-0 my-5">
                <v-sheet class="mb-3">
                    <div class="text-h5 font-weight-medium mx-15">最新房源</div>
                    <v-slide-group show-arrows>
                        <v-slide-group-item v-if="newHouseList.length === 0" v-for="n in 15" :key="n">
                            <v-card class="ma-2" height="320" width="300" elevation="0">
                                <v-skeleton-loader
                                    class="mx-auto"
                                    type="card, list-item-two-line"
                                />
                            </v-card>
                        </v-slide-group-item>
                        <v-slide-group-item v-else v-for="newHouse in newHouseList" :key="newHouse.id">
                            <HouseCard :house="newHouse" min-width="320"/>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-container>
            <!-- Explore all houses -->
            <v-container fluid class="my-5">
                <div class="text-h5 font-weight-medium mx-5">探索房源</div>
                <v-row justify="start" align="start">
                    <template v-for="(scrollItem, scrollIndex) in allHouseList" :key="scrollIndex">
                        <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                            <HouseCard :house="scrollItem"/>
                        </v-col>
                    </template>
                </v-row>
            </v-container>
        </v-infinite-scroll>
    </v-container>
</template>
<script setup>
import primaryBannerImg from "@/assets/banner05.webp";
import secondaryBannerImg from "@/assets/banner06.webp";
import SearchHouseBar from "@/components/home/SearchHouseBar.vue";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { useUserViewStore } from "@/stores/userViewStore";
import { useResizeObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import HouseCard from "../../components/home/HouseCard.vue";
const houseSearchStore = useHouseSearchStore();
const userViewStore = useUserViewStore();
const { allHouseList, hotHouseList, newHouseList, currentAllHousePage } =
    storeToRefs(houseSearchStore);
const { containerHeight } = storeToRefs(userViewStore);
const exploreContainerRef = ref(null);
const exploreContainerResizeObserve = reactive({ width: 0, height: 0 });

async function loadAllHouse({ done }) {
    console.log("Infinity scroll get data...");
    let data = await houseSearchStore.getAllHouse();
    if (data != null) {
        if (!data.empty) {
            allHouseList.value.push(...data.content);
            currentAllHousePage.value++;
            console.log(`Read house list ok! Page: ${currentAllHousePage.value}`);
            done("ok");
        } else {
            console.log(`Read house list empty! Page: ${currentAllHousePage.value}`);
            done("empty");
        }
    } else {
        console.log(`Read house list error! Page: ${currentAllHousePage.value}`);
        done("error");
    }
}

// ResizeObserver on searchContainer
let timeoutId = null;
useResizeObserver(exploreContainerRef, (entries) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        const entry = entries[0];
        const { width, height } = entry.contentRect;
        console.log(`width: ${width}, height: ${height}`);
        exploreContainerResizeObserve.height = height;
    }, 100); // 設定 500 毫秒的延遲
});

onMounted(async () => {
    let hotHouseData = await houseSearchStore.getHotHouse();
    let newHouseData = await houseSearchStore.getNewHouse();
    if (hotHouseData != null) {
        hotHouseList.value.push(...hotHouseData.content);
    }
    if (newHouseData != null) {
        newHouseList.value.push(...newHouseData.content);
    }
});
</script>
<style scoped>
:deep(.v-infinite-scroll__side) {
    padding: 0 !important;
}
</style>
