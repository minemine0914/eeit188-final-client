<template>
    <v-row class="ma-0 w-100" :style="{ height: `${containerHeight}px` }">
        <v-slide-x-transition>
            <v-col
                v-show="isShowInfoCard"
                xs="12"
                sm="6"
                md="5"
                lg="4"
                class="h-100"
                style="contain: size; padding-top: 110px"
            >
                <v-card ref="infoCardRef" class="h-100" rounded="lg">
                    <v-toolbar
                        color="transparent"
                        ref="infoCardToolbarRef"
                        class="px-2 border-b-thin"
                        density="compact"
                    >
                        <template v-slot:prepend>
                            <v-icon
                                icon="mdi-map-search-outline"
                                class="ml-3"
                                color="grey-darken-3"
                            ></v-icon>
                            <div class="ml-3 text-h6 text-grey-darken-3">地圖範圍搜尋</div>
                        </template>
                        <template v-slot:append>
                            <v-btn
                                v-if="false"
                                icon="mdi-close"
                                @click="isShowInfoCard = false"
                            ></v-btn>
                        </template>
                    </v-toolbar>
                    <div class="d-flex" :style="{ height: `${infoCardScrollHeight}px` }">
                        <v-infinite-scroll
                            v-if="renderInfinityScrollComponent"
                            :items="filterHouseList"
                            @load="loadFilterHouse"
                            class="w-100"
                        >
                            <template v-for="(scrollItem, index) in filterHouseList" :key="index">
                                <v-sheet class="mb-3">
                                    <v-card
                                        flat
                                        @click="$router.push(`/house/${scrollItem.id}`)"
                                        :ripple="false"
                                        :hover="false"
                                        class="py-3 mx-3"
                                        color="brown-lighten-5"
                                        rounded="lg"
                                        border
                                    >
                                        <v-row class="fill-height" no-gutters>
                                            <v-col cols="12" md="12">
                                                <!-- 圖片 -->
                                                <v-sheet
                                                    color="transparent"
                                                    rounded="lg"
                                                    class="overflow-hidden mx-3 mb-2"
                                                >
                                                    <v-carousel
                                                        height="150"
                                                        show-arrows="hover"
                                                        hide-delimiter-background
                                                        hide-delimiters
                                                    >
                                                        <template v-slot:prev="{ props }">
                                                            <v-btn
                                                                v-if="
                                                                    scrollItem
                                                                        .houseExternalResourceRecords
                                                                        .length > 1
                                                                "
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
                                                                v-if="
                                                                    scrollItem
                                                                        .houseExternalResourceRecords
                                                                        .length > 1
                                                                "
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
                                                            v-for="imageSrc in houseSearchStore.getHouseImageUrlList(
                                                                scrollItem.houseExternalResourceRecords
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
                                            </v-col>
                                            <v-col cols="12" md="12">
                                                <!-- 房源名稱與資訊 -->
                                                <v-card-item
                                                    class="flex-grow-1 px-3 py-0"
                                                    color="transparent"
                                                >
                                                    <v-sheet
                                                        class="d-flex flex-row justify-space-between"
                                                        color="transparent"
                                                    >
                                                        <div class="text-h6 text-brown-darken-1">
                                                            {{ scrollItem.name }}
                                                        </div>
                                                        <div class="text-h6 text-brown-darken-1">
                                                            NT ${{ scrollItem.price }}
                                                        </div>
                                                    </v-sheet>
                                                    <div class="text-body-2 text-brown-darken-1">
                                                        <span
                                                            class="mdi mdi-map-marker mr-2"
                                                        ></span>
                                                        <span class="mr-2">{{
                                                            `${scrollItem.city} ${scrollItem.region} ${scrollItem.address}`
                                                        }}</span>
                                                    </div>
                                                    <div class="text-body-2 text-brown-darken-1">
                                                        <span class="mdi mdi-sofa mr-2"></span>
                                                        <span>共 </span>
                                                        <span
                                                            class="mr-1"
                                                            v-if="scrollItem.livingDiningRoom > 0"
                                                        >
                                                            {{ `${scrollItem.livingDiningRoom} 廳` }}
                                                        </span>
                                                        <span class="mr-1" v-if="scrollItem.bedroom > 0">
                                                            {{ `${scrollItem.bedroom} 房` }}
                                                        </span>
                                                        <span
                                                            class="mr-1"
                                                            v-if="scrollItem.bathroom > 0"
                                                        >
                                                            {{ `${scrollItem.bathroom} 淋浴` }}
                                                        </span>
                                                        <span
                                                            class="mr-1"
                                                            v-if="scrollItem.restroom > 0"
                                                        >
                                                            {{ `${scrollItem.restroom} 衛生` }}
                                                        </span>
                                                    </div>
                                                    <div class="text-body-2 text-brown-darken-1">
                                                        <span class="mdi mdi-bed mr-2"></span>
                                                        <span>可住 </span>
                                                        <span class="mr-1" v-if="scrollItem.adult > 0">
                                                            {{ `${scrollItem.adult} 位成人 ` }}
                                                        </span>
                                                        <span class="mr-1" v-if="scrollItem.child > 0">
                                                            {{ `${scrollItem.child} 位孩童 ` }}
                                                        </span>
                                                    </div>
                                                </v-card-item>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-sheet>
                            </template>
                            <template v-slot:empty>
                                <v-sheet>
                                    <v-alert variant="plain"
                                        >房源搜尋完畢! 共找到
                                        {{ filterHouseList.length }} 個相符房源</v-alert
                                    >
                                </v-sheet>
                            </template>
                        </v-infinite-scroll>
                    </div>
                </v-card>
            </v-col>
        </v-slide-x-transition>
        <!-- Open Info Card Button -->
        <v-slide-x-reverse-transition>
            <v-btn
                v-show="!isShowInfoCard"
                class="position-absolute top-0 left-0"
                @click.stop="isShowInfoCard = !isShowInfoCard"
                append-icon="mdi-chevron-right"
                size="large"
                :ripple="true"
                style="margin: 100px 0 0 30px"
                rounded="xl"
            >
                開啟清單
                <template v-slot:append>
                    <v-icon></v-icon>
                </template>
            </v-btn>
        </v-slide-x-reverse-transition>
    </v-row>
</template>
<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserViewStore } from "@/stores/userViewStore";
import { useElementSize } from "@vueuse/core";
import { useHouseSearchStore } from "../../stores/houseSearchStore";

// Stores
const userViewStore = useUserViewStore();
const { containerHeight } = storeToRefs(userViewStore);
const houseSearchStore = useHouseSearchStore();
const { renderInfinityScrollComponent, currentFilterHousePage, filterHouseList } =
    storeToRefs(houseSearchStore);
// Result controll
const isShowInfoCard = ref(true);
const infoCardRef = ref(null);
const infoCardToolbarRef = ref(null);
const infoCardScrollHeight = computed(() => infoCardHeight.value - infoCardToolbarHeight.value);
const { height: infoCardHeight } = useElementSize(infoCardRef);
const { height: infoCardToolbarHeight } = useElementSize(infoCardToolbarRef);

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
</script>
<style scoped></style>
