<template>
    <v-container v-if="isErrorGetHouseInfo">
        <!-- House not found
        <v-btn to="/house/qwe">TEST1</v-btn>
        <v-btn to="/house/asd">TEST1</v-btn>
        <v-btn to="/house/f4d671db-d560-46b6-8606-276df8f8cadc">TEST1</v-btn> -->
    </v-container>
    <v-container v-if="!isErrorGetHouseInfo">
        <!-- House heading (Name, collect and sharing) -->
        <v-row class="pa-1 mt-1">
            <v-col cols="12">
                <v-sheet height="40px">
                    <v-skeleton-loader type="heading" width="30%" v-if="isLoading" />
                    <div class="d-flex flex-row" v-else>
                        <v-sheet class="flex-column flex-grow-1 text-h4" color="transparent">
                            {{ houseInfo.name }}
                        </v-sheet>
                        <v-sheet
                            class="d-flex flex-row flex-grow-1 justify-end align-end"
                            color="transparent"
                        >
                            <v-btn
                                :disabled="isLoadingCollection"
                                variant="text"
                                rounded="pill"
                                size="large"
                                @click.stop="onClickCollect"
                            >
                                <template v-slot:prepend>
                                    <v-icon
                                        :icon="isCollected ? 'mdi-heart' : 'mdi-heart-outline'"
                                        color="deep-orange-darken-3"
                                    ></v-icon>
                                </template>
                                <span>收藏</span>
                            </v-btn>
                            <v-btn variant="text" rounded="pill" size="large">
                                <template v-slot:prepend>
                                    <v-icon
                                        :icon="
                                            isCollected
                                                ? 'mdi-share-variant'
                                                : 'mdi-share-variant-outline'
                                        "
                                        color="light-green-darken-3"
                                    ></v-icon>
                                </template>
                                <span>分享</span>
                            </v-btn>
                        </v-sheet>
                    </div>
                </v-sheet>
            </v-col>
        </v-row>
        <!-- Images Grid -->
        <v-responsive :aspect-ratio="10 / 4" ref="imageBoxRef" class="mx-1">
            <v-sheet class="fill-height d-flex flex-row ga-1" style="contain: size">
                <v-sheet class="flex-grow-1 rounded-s-xl overflow-hidden">
                    <v-skeleton-loader
                        class="custom-skeleton-image"
                        type="image"
                        height="100%"
                        v-if="isLoading"
                    />
                    <v-img
                        :src="houseDetailStore.getImageUrlList(0)"
                        position="center"
                        :height="bigImageHeight"
                        cover
                        v-else
                    ></v-img>
                </v-sheet>
                <v-sheet class="flex-grow-1 d-flex flex-column ga-1">
                    <v-sheet class="flex-grow-1 d-flex flex-row ga-1">
                        <v-sheet class="flex-grow-1">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="houseDetailStore.getImageUrlList(1)"
                                position="center"
                                cover
                                :height="smallImageHeight"
                                v-else
                            ></v-img>
                        </v-sheet>
                        <v-sheet class="flex-grow-1 rounded-te-xl overflow-hidden">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="houseDetailStore.getImageUrlList(2)"
                                position="center"
                                :height="smallImageHeight"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                    </v-sheet>
                    <v-sheet class="flex-grow-1 d-flex flex-row ga-1">
                        <v-sheet class="flex-grow-1">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="houseDetailStore.getImageUrlList(3)"
                                position="center"
                                :height="smallImageHeight"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                        <v-sheet class="flex-grow-1 rounded-be-xl overflow-hidden">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="houseDetailStore.getImageUrlList(4)"
                                position="center"
                                :height="smallImageHeight"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
            </v-sheet>
        </v-responsive>
        <!-- House details -->
        <v-row class="px-1 mt-3" no-gutters>
            <v-col cols="12" md="12">
                <v-sheet>
                    <v-skeleton-loader v-if="isLoading" type="list-item-three-line" />
                    <v-row v-else class="d-flex flex-row">
                        <!-- House info -->
                        <v-col class="flex-grow-1" cols="12" sm="6" md="6">
                            <div class="text-grey-darken-1">
                                <span class="mdi mdi-map-marker mr-2"></span>
                                <span class="mr-2">{{
                                    `${houseInfo.city} ${houseInfo.region} ${houseInfo.address}`
                                }}</span>
                            </div>
                            <div class="text-grey-darken-1">
                                <span class="mdi mdi-sofa mr-2"></span>
                                <span>共 </span>
                                <span class="mr-1" v-if="houseInfo.livingDiningRoom > 0">
                                    {{ `${houseInfo.livingDiningRoom} 廳` }}
                                </span>
                                <span class="mr-1" v-if="houseInfo.bedroom > 0">
                                    {{ `${houseInfo.bedroom} 房` }}
                                </span>
                                <span class="mr-1" v-if="houseInfo.bathroom > 0">
                                    {{ `${houseInfo.bathroom} 淋浴` }}
                                </span>
                                <span class="mr-1" v-if="houseInfo.restroom > 0">
                                    {{ `${houseInfo.restroom} 衛生` }}
                                </span>
                            </div>
                            <div class="text-grey-darken-1">
                                <span class="mdi mdi-bed mr-2"></span>
                                <span>可住 </span>
                                <span class="mr-1" v-if="houseInfo.adult > 0">
                                    {{ `${houseInfo.adult} 位成人 ` }}
                                </span>
                                <span class="mr-1" v-if="houseInfo.child > 0">
                                    {{ `${houseInfo.child} 位孩童 ` }}
                                </span>
                            </div>
                            <div class="text-grey-darken-1">
                                <span class="mr-2" v-if="!houseInfo.pet">
                                    <span class="mdi mdi-paw-off mr-1"></span>
                                    <span>禁止寵物</span>
                                </span>

                                <span class="mr-2" v-if="!houseInfo.smoke">
                                    <span class="mdi mdi-smoking-off mr-1"></span>
                                    <span>禁止吸菸</span>
                                </span>
                            </div>
                        </v-col>
                        <!-- House price and buy button -->
                        <v-col
                            class="d-flex flex-column flex-grow-1 justify-top align-end"
                            cols="12"
                            sm="6"
                            md="6"
                        >
                            <v-sheet color="transparent">
                                <div
                                    class="text-h4 font-weight-medium text-brown-darken-4 mb-2 mr-1"
                                >
                                    NT ${{ houseInfo.price }}
                                </div>
                            </v-sheet>
                            <v-sheet color="transparent">
                                <v-btn color="brown-lighten-1" min-width="130" size="large"
                                    >立即預定</v-btn
                                >
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-sheet>
                <v-divider class="border-opacity-25 my-5"></v-divider>
                <v-sheet min-height="100">
                    <div class="text-h6 mb-3">設施</div>
                    <v-skeleton-loader type="chip, chip, chip" v-if="isLoading" />
                    <v-sheet class="d-flex flex-row flex-wrap w-100 ga-3" v-else>
                        <v-sheet
                            v-for="(postulaue, index) in houseInfo.postulates"
                            class="d-flex flex-column justufy-center align-center px-4 py-3"
                            rounded="lg"
                            color="brown-lighten-5"
                            :key="index"
                        >
                            <v-icon
                                v-if="postulaue.icon"
                                :icon="postulaue.icon"
                                color="brown-lighten-1"
                            ></v-icon>
                            <v-icon
                                v-else
                                icon="mdi-emoticon-excited-outline"
                                color="brown-lighten-1"
                            ></v-icon>
                            <div class="text-brown-lighten-1 text-body-2 pt-2">
                                {{ postulaue.name }}
                            </div>
                        </v-sheet>
                    </v-sheet>
                </v-sheet>
                <v-divider class="border-opacity-25 my-5"></v-divider>
                <v-sheet min-height="180">
                    <div class="text-h6 mb-3">房源介紹</div>
                    <v-skeleton-loader
                        type="list-item-three-line, list-item-two-line"
                        v-if="isLoading"
                    />
                    <div v-else>
                        {{ houseInfo.information }}
                    </div>
                </v-sheet>
                <v-divider class="border-opacity-25 my-5"></v-divider>
                <v-sheet min-height="180">
                    <div class="text-h6 mb-3">地理位置</div>
                    <v-skeleton-loader type="image" height="250" v-if="isLoading" />
                    <div v-else>
                        {{ houseInfo.information }}
                    </div>
                </v-sheet>
                <v-divider class="border-opacity-25 my-5"></v-divider>
                <v-sheet min-height="100">
                    <div class="text-h6 pa-0">房東</div>
                    <v-skeleton-loader type="avatar, list-item-three-line" v-if="isLoading" />
                    <v-sheet v-else>
                        <div>{{ houseInfo.userName }}</div>
                    </v-sheet>
                </v-sheet>
                <v-divider class="border-opacity-25 my-5"></v-divider>
                <v-sheet min-height="100" flat>
                    <div class="text-h6 mb-3">評價</div>
                    <v-skeleton-loader
                        type="avatar, list-item-three-line, avatar, list-item-three-line"
                        v-if="isLoading"
                    />
                    <v-row v-else>
                        <!-- <v-col v-for="postulaue in houseInfo.postulates">
                                    {{ postulaue.name }}
                        </v-col> -->
                    </v-row>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { storeToRefs } from "pinia";
import { useResizeObserver } from "@vueuse/core";

// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const { houseInfo, isErrorGetHouseInfo, isLoading, isLoadingCollection, isCollected } =
    storeToRefs(houseDetailStore);

// Detect image box v-responsive height
const imageBoxRef = ref(null);
const bigImageHeight = ref(1);
const smallImageHeight = ref(1);
useResizeObserver(imageBoxRef, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    // console.log(`Image box: width: ${width}, height: ${height}`);
    bigImageHeight.value = height;
    smallImageHeight.value = height / 2 - 2; // with gap width(4px / 2)
});

// Functions

function onClickCollect() {
    if (isCollected.value) {
        houseDetailStore.removeHouseToCollection();
    } else {
        houseDetailStore.addHouseToCollection();
    }
}

watch(
    // Watch Route params houseId change
    () => route.params.houseId,
    (newId, oldId) => {
        console.log(newId, oldId);
        houseDetailStore.getHouseInfo(newId);
    }
);

onMounted(async () => {
    if (route.params.houseId) {
        // If Route params houseId found
        console.log("Found houseId in url param: " + route.params.houseId);
        await houseDetailStore.getHouseInfo(route.params.houseId);
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    } else {
        // If Route params houseId not found
        console.log("HouseId not found in url param!  Take you to home page!");
        isErrorGetHouseInfo.value = true;
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    }
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
