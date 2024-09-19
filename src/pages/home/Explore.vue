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
                <SearchHouseBar style="top: -100px;"/>
            </v-sheet>
            <!-- Hot Houses -->
            <v-container fluid class="pa-0 my-5">
                <v-sheet class="mb-3">
                    <div class="text-h5 font-weight-medium mx-15">熱門推薦</div>
                    <v-slide-group show-arrows>
                        <v-slide-group-item v-for="n in 15" :key="n">
                            <v-card class="ma-2" height="320" width="300" elevation="0">
                                <v-skeleton-loader
                                    class="mx-auto"
                                    type="card, list-item-two-line"
                                />
                            </v-card>
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
                    <div class="text-h5 font-weight-medium mx-15">評價最好</div>
                    <v-slide-group show-arrows>
                        <v-slide-group-item v-for="n in 15" :key="n">
                            <v-card class="ma-2" height="320" width="300" elevation="0">
                                <v-skeleton-loader class="mx-auto" type="image, article" />
                            </v-card>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-sheet>
            </v-container>
            <!-- Explore all houses -->
            <v-container fluid class="my-5">
                <v-row justify="start" align="start">
                    <template v-for="(scrollItem, scrollIndex) in allHouseList" :key="scrollIndex">
                        <v-col cols="12" lg="3" md="4" sm="6" xs="12">
                            <v-card
                                flat
                                rounded="lg"
                                @click="$router.push(`/house/${scrollItem.id}`)"
                                :ripple="false"
                                :hover="false"
                            >
                                <v-card-item class="pt-4">
                                    <v-sheet
                                        color="transparent"
                                        class="overflow-hidden"
                                        rounded="lg"
                                    >
                                        <v-carousel
                                            height="200"
                                            show-arrows="hover"
                                            hide-delimiter-background
                                            hide-delimiters
                                        >
                                            <template v-slot:prev="{ props }">
                                                <v-btn
                                                    :class="props.class"
                                                    color="rgba(255,255,255,0.5)"
                                                    size="small"
                                                    density="compact"
                                                    icon="mdi-chevron-left"
                                                    variant="elevated"
                                                    @click.stop="props.onClick"
                                                ></v-btn>
                                            </template>
                                            <template v-slot:next="{ props }">
                                                <v-btn
                                                    :class="props.class"
                                                    color="rgba(255,255,255,0.5)"
                                                    size="small"
                                                    density="compact"
                                                    icon="mdi-chevron-right"
                                                    variant="elevated"
                                                    @click.stop="props.onClick"
                                                ></v-btn>
                                            </template>
                                            <v-carousel-item
                                                v-for="imageSrc in houseSearchStore.getAllHouseImageUrlList(
                                                    scrollIndex
                                                )"
                                            >
                                                <v-img
                                                    :aspect-ratio="1"
                                                    :height="200"
                                                    :src="imageSrc"
                                                    cover
                                                    class="cursor-pointer"
                                                ></v-img>
                                            </v-carousel-item>
                                        </v-carousel>
                                    </v-sheet>
                                </v-card-item>
                                <v-card-title
                                    class="py-0 d-flex flex-row align-center justify-center"
                                >
                                    <div class="flex-grow-1">{{ scrollItem.name }}</div>
                                    <div
                                        class="d-flex flex-grow-1 text-body-2 justify-end align-top"
                                    >
                                        <v-icon icon="mdi-star-outline" size="small"></v-icon>
                                        <span>4.9</span>
                                    </div>
                                </v-card-title>
                                <v-card-subtitle class="pb-2">
                                    <div class="text-grey-darken-1">
                                        <span class="mdi mdi-map-marker mr-2"></span>
                                        <span class="mr-2">{{
                                            `${scrollItem.city} ${scrollItem.region}`
                                        }}</span>
                                    </div>
                                    <div class="text-grey-darken-1">
                                        <span class="mdi mdi-sofa mr-2"></span>
                                        <span>共 </span>
                                        <span class="mr-1" v-if="scrollItem.livingDiningRoom > 0">
                                            {{ `${scrollItem.livingDiningRoom} 廳` }}
                                        </span>
                                        <span class="mr-1" v-if="scrollItem.bedroom > 0">
                                            {{ `${scrollItem.bedroom} 房` }}
                                        </span>
                                        <span class="mr-1" v-if="scrollItem.bathroom > 0">
                                            {{ `${scrollItem.bathroom} 淋浴` }}
                                        </span>
                                        <span class="mr-1" v-if="scrollItem.restroom > 0">
                                            {{ `${scrollItem.restroom} 衛生` }}
                                        </span>
                                    </div>
                                    <div class="text-grey-darken-1">
                                        <span class="mdi mdi-bed mr-2"></span>
                                        <span>可住 </span>
                                        <span class="mr-1" v-if="scrollItem.adult > 0">
                                            {{ `${scrollItem.adult} 位成人 ` }}
                                        </span>
                                        <span class="mr-1" v-if="scrollItem.child > 0">
                                            {{ `${scrollItem.child} 位孩童 ` }}
                                        </span>
                                    </div>
                                </v-card-subtitle>
                                <v-card-text class="font-weight-bold pt-0"
                                    >${{ scrollItem.price }} / 日</v-card-text
                                >
                            </v-card>
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
import { reactive, ref } from "vue";
const houseSearchStore = useHouseSearchStore();
const userViewStore = useUserViewStore();
const { allHouseList, currentAllHousePage } = storeToRefs(houseSearchStore);
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
</script>
<style scoped>
:deep(.v-infinite-scroll__side) {
    padding: 0 !important;
}
</style>
