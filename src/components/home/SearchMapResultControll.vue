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
                <v-card ref="infoCardRef" class="h-100" rounded="xl">
                    <v-toolbar color="transparent" ref="infoCardToolbarRef" class="px-2 border-b-thin">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-map-search-outline" class="ml-3"></v-icon>
                        </template>
                        <v-toolbar-title class="text-h6" text="搜尋結果"></v-toolbar-title>
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
                                <v-sheet class="mb-2">
                                    <v-card
                                        flat
                                        @click="$router.push(`/house/${scrollItem.id}`)"
                                        :ripple="false"
                                        :hover="false"
                                        class="py-3 mx-3"
                                        color="brown-lighten-5"
                                        rounded="lg"
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
                                                <div class="d-flex flex-row mb-6 w-100 h-100 px-3">
                                                    <!-- 房源名稱與資訊 -->
                                                    <v-sheet
                                                        class="flex-grow-1"
                                                        color="transparent"
                                                    >
                                                        <div
                                                            class="text-h5 font-weight-medium text-brown-darken-4 pt-1 mb-1"
                                                        >
                                                            {{ scrollItem.name }}
                                                        </div>
                                                        <div class="text-grey-darken-1">
                                                            <span
                                                                class="mdi mdi-map-marker mr-2"
                                                            ></span>
                                                            <span class="mr-2">{{
                                                                `位於 ${scrollItem.city} ${scrollItem.region}`
                                                            }}</span>
                                                        </div>
                                                        <div class="text-grey-darken-1">
                                                            <span class="mdi mdi-sofa mr-2"></span>
                                                            <span
                                                                class="mr-1"
                                                                v-if="
                                                                    scrollItem.livingDiningRoom > 0
                                                                "
                                                            >
                                                                {{
                                                                    `${scrollItem.livingDiningRoom} 廳`
                                                                }}
                                                            </span>
                                                            <span
                                                                class="mr-1"
                                                                v-if="scrollItem.bedroom > 0"
                                                            >
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
                                                        <div class="text-grey-darken-1">
                                                            <span class="mdi mdi-bed mr-2"></span>
                                                            <span>可住 </span>
                                                            <span
                                                                class="mr-1"
                                                                v-if="scrollItem.adult > 0"
                                                            >
                                                                {{ `${scrollItem.adult} 位成人 ` }}
                                                            </span>
                                                            <span
                                                                class="mr-1"
                                                                v-if="scrollItem.child > 0"
                                                            >
                                                                {{ `${scrollItem.child} 位孩童 ` }}
                                                            </span>
                                                        </div>
                                                        <div class="text-grey-darken-1">
                                                            <span
                                                                class="mr-2"
                                                                v-if="!scrollItem.pet"
                                                            >
                                                                <span
                                                                    class="mdi mdi-paw-off mr-2"
                                                                ></span>
                                                                <span>禁止寵物</span>
                                                            </span>

                                                            <span
                                                                class="mr-2"
                                                                v-if="!scrollItem.smoke"
                                                            >
                                                                <span
                                                                    class="mdi mdi-smoking-off mr-2"
                                                                ></span>
                                                                <span>禁止吸菸</span>
                                                            </span>
                                                        </div>
                                                    </v-sheet>
                                                    <!-- 價錢與詳細按鈕 -->
                                                    <v-sheet
                                                        class="d-flex flex-column flex-grow-1 justify-end align-end"
                                                        color="transparent"
                                                    >
                                                        <v-sheet color="transparent">
                                                            <div
                                                                class="text-h5 font-weight-medium text-brown-darken-4 mb-2 mr-1"
                                                            >
                                                                NT ${{ scrollItem.price }}
                                                            </div>
                                                        </v-sheet>
                                                        <!-- <v-sheet color="transparent">
                                                            <v-btn
                                                                color="brown-lighten-1"
                                                                min-width="130"
                                                                size="large"
                                                                :to="`/house/${scrollItem.id}`"
                                                                >詳細資訊</v-btn
                                                            >
                                                        </v-sheet> -->
                                                    </v-sheet>
                                                </div>
                                            </v-col>
                                        </v-row>
                                    </v-card>
                                </v-sheet>
                            </template>
                            <template v-slot:empty>
                                <v-sheet class="mb-5">
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
