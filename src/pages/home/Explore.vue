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
            <!-- Explore Banner -->
            <v-parallax
                :src="primaryBannerImg"
                scale="0.6"
                height="360px"
                width="100%"
                class="posiiton-relative"
                style="top: -16px"
            >
                <div class="d-flex flex-column fill-height justify-center align-center text-white">
                    <NomadSvg
                        height="230px"
                        class="position-absolute opacity-40"
                        style="top: 35px"
                    />
                    <div class="position-absolute" style="top: 125px">
                        <div
                            class="text-h3 font-weight-black mb-3 opacity-80"
                            style="font-family: 'Tenor Sans'"
                        >
                            NOMAD
                        </div>
                        <div class="subheading font-weight-regular opacity-90">
                            住宿 旅遊 重新定義居住自由
                        </div>
                    </div>
                </div>
            </v-parallax>
            <!-- SearchHouseBar -->
            <v-sheet class="position-relative">
                <SearchHouseBar style="top: -100px" />
            </v-sheet>
            <!-- Hot Houses -->
            <v-container fluid class="px-0 pt-0">
                <v-sheet class="mb-3">
                    <div class="text-h5 font-weight-medium mx-9">熱門推薦</div>
                    <div class="position-relative">
                        <HotHouseInfinityScorll />
                    </div>
                </v-sheet>
            </v-container>
            <!-- Ads for House host -->
            <v-parallax :src="secondaryBannerImg" height="320">
                <div class="d-flex flex-column fill-height justify-center align-center text-white">
                    <h1 class="text-h4 font-weight-black mb-4 opacity-80">分享您的空間</h1>
                    <h4 class="subheading font-weight-regular">為大家提供舒適的住宿體驗</h4>
                    <v-btn variant="outlined" class="mt-5" to="/host">{{
                        user.id != null ? "管理房源" : "立即加入"
                    }}</v-btn>
                </div>
            </v-parallax>
            <!-- Height rating houses -->
            <v-container fluid class="px-0">
                <v-sheet class="mb-3 position-relative">
                    <div class="text-h5 font-weight-medium mx-9">最新房源</div>
                    <NewHouseInfinityScorll />
                </v-sheet>
            </v-container>
            <!-- Explore all houses -->
            <v-container fluid class="mb-5 pt-0">
                <div class="text-h5 font-weight-medium mx-5">探索房源</div>
                <v-row justify="start" align="start">
                    <template
                        v-for="exploreHouse in allHouseList"
                        :key="exploreHouse.houseDetails.id"
                    >
                        <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                            <HouseCard
                                :house="exploreHouse.houseDetails"
                                :avg-score="exploreHouse.averageScore"
                                :total-scores="exploreHouse.totalScores"
                            />
                        </v-col>
                    </template>
                </v-row>
            </v-container>
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
        </v-infinite-scroll>
    </v-container>
</template>
<script setup>
import NomadSvg from "@/assets/nomad.svg?component";
import primaryBannerImg from "@/assets/banner08.webp";
import secondaryBannerImg from "@/assets/banner06.webp";
import SearchHouseBar from "@/components/home/SearchHouseBar.vue";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { useUserViewStore } from "@/stores/userViewStore";
import { useUserStore } from "../../stores/userStore";
import { useResizeObserver } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import HouseCard from "../../components/home/HouseCard.vue";
import HotHouseInfinityScorll from "../../components/home/HotHouseInfinityScorll.vue";
import NewHouseInfinityScorll from "../../components/home/NewHouseInfinityScorll.vue";

const houseSearchStore = useHouseSearchStore();
const userViewStore = useUserViewStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
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

onMounted(() => {
    // houseSearchStore.getHotHouse();
    // houseSearchStore.getNewHouse();
});
</script>
<style scoped>
/* :deep(.v-infinite-scroll__side) {
    padding: 0 !important;
} */
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
