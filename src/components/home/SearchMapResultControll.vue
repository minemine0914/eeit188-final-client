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
                style="contain: size; padding-top: 100px"
            >
                <v-card ref="infoCardRef" class="h-100" rounded="xl">
                    <v-toolbar color="transparent" ref="infoCardToolbarRef" class="pa-2">
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
                                    >
                                        <v-row class="fill-height">
                                            <v-col cols="12" md="6">
                                                <!-- 圖片 -->
                                                <v-sheet
                                                    color="transparent"
                                                    rounded="lg"
                                                    class="overflow-hidden"
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
                                                                @click="props.onClick"
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
                                                                @click="props.onClick"
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
                                            <v-col cols="12" md="6">
                                                <div class="text-h5">{{ scrollItem.name }}</div>
                                            </v-col>
                                        </v-row>
                                    </v-card>
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
<style scoped>
</style>
