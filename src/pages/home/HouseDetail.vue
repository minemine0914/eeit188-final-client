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
                                density="compact"
                                class="mb-1"
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
                            <v-btn
                                variant="text"
                                rounded="pill"
                                size="large"
                                density="compact"
                                class="mb-1"
                                @click.stop="onClickShare"
                            >
                                <template v-slot:prepend>
                                    <v-icon
                                        icon="mdi-share-variant"
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
        <ImageGrid />
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
                                <v-btn
                                    color="brown-lighten-1"
                                    min-width="130"
                                    size="large"
                                    text="立即預定"
                                    :to="`/booking/${houseInfo.id}`"
                                ></v-btn>
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
                    <v-sheet v-else class="overflow-hidden" rounded="lg">
                        <!-- Map -->
                        <ol-map
                            style="height: 250px; width: 100%"
                            :controls="[]"
                            @click="handleMapClick"
                            @pointermove="handleMapPointerMove"
                        >
                            <ol-view
                                :projection="`EPSG:4326`"
                                :center="[houseInfo.latitudeX, houseInfo.longitudeY]"
                                :zoom="18"
                                :rotation="0"
                            />
                            <ol-tile-layer :cacheSize="0">
                                <ol-source-osm  />
                            </ol-tile-layer>
                            <ol-vector-layer>
                                <ol-source-vector>
                                    <ol-feature :properties="[]">
                                        <ol-geom-point
                                            :coordinates="[
                                                houseInfo.latitudeX,
                                                houseInfo.longitudeY,
                                            ]"
                                        ></ol-geom-point>
                                    </ol-feature>
                                    <ol-style>
                                        <ol-style-icon
                                            :src="pointIcon"
                                            :scale="0.2"
                                        ></ol-style-icon>
                                    </ol-style>
                                </ol-source-vector>
                            </ol-vector-layer>
                            <!-- <ol-overlay
                                :position="[houseInfo.latitudeX, houseInfo.longitudeY]"
                                :autoPan="true"
                                positioning="top-center"
                            >
                                <v-sheet class="pa-3" rounded>hahaha</v-sheet>
                            </ol-overlay> -->
                            <ol-zoom-control
                                className="ol-custom-zoom-control"
                                zoomInLabel="+"
                                zoomOutLabel="-"
                            ></ol-zoom-control>
                            <ol-attribution-control />
                            <!-- 使用 Ctrl + 滾輪 縮放 -->
                            <ol-interaction-mouse-wheel-zoom :condition="platformModifierKeyOnly" />
                        </ol-map>
                    </v-sheet>
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
                    <v-sheet class="d-flex flex-row align-top">
                        <div class="flex-grow-1 text-h6 mb-3">評價</div>
                        <div class="d-flex flex-grow-1 text-h6 mb-3 justify-end align-top">
                            <v-btn variant="text" size="default" rounded="pill">
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-message-draw" color="brown"></v-icon>
                                </template>
                                立即評價
                            </v-btn>
                        </div>
                    </v-sheet>
                    <v-skeleton-loader
                        type="avatar, list-item-three-line, avatar, list-item-three-line"
                        v-if="isLoading"
                    />
                    <v-row v-else>
                        <v-col cols="12" md="6" v-for="index in 4">
                            <v-card>
                                <template v-slot:prepend>
                                    <v-avatar size="large">
                                        <v-img
                                            alt="John"
                                            src="https://cdn.vuetifyjs.com/images/john.jpg"
                                        ></v-img>
                                    </v-avatar>
                                </template>
                                <template v-slot:append>
                                    <v-rating
                                        hover
                                        :length="5"
                                        :size="23"
                                        :model-value="4"
                                        color="warning"
                                        active-color="warning"
                                        readonly
                                    />
                                </template>
                                <template v-slot:title>
                                    <div>HAHAHA</div>
                                </template>
                                <template v-slot:subtitle>
                                    <div>共100則評論</div>
                                </template>
                                <v-card-text>
                                    <p>
                                        很棒很棒很棒很棒很棒很棒很棒很棒很棒很棒，很棒很棒很棒很棒很棒，很棒!!!!!
                                        很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                        很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                        很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                    </p>
                                    <div class="text-caption text-end">評論日期: 2024-09-09</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
    <ShareDialog />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "@/stores/houseDetailStore";
import { storeToRefs } from "pinia";
import ImageGrid from "@/components/home/ImageGrid.vue";
import ShareDialog from "@/components/home/ShareDialog.vue";
import pointIcon from "@/assets/point01.svg";
import { platformModifierKeyOnly } from "ol/events/condition";
// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const {
    houseInfo,
    isErrorGetHouseInfo,
    isLoading,
    isLoadingCollection,
    isCollected,
    isShareDialogOpen,
} = storeToRefs(houseDetailStore);

// Functions
function onClickCollect() {
    if (isCollected.value) {
        houseDetailStore.removeHouseToCollection();
    } else {
        houseDetailStore.addHouseToCollection();
    }
}
function onClickShare() {
    if (!isShareDialogOpen.value) {
        isShareDialogOpen.value = true;
    }
}
// Map event
function handleMapClick(e) {
    let map = e.map;
    let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => {
        return feature;
    });
    if (feature) {
        let geometry = feature.getGeometry();
        console.log(geometry.getCoordinates(), geometry.getType(), feature.getProperties());
        // popupPosition.value = geometry.getCoordinates();
        // selectedPointProps.name = feature.get("name");
        // selectedPointProps.price = feature.get("price");
        // popoverShow.value = true;
        // isShowInfoCard.value = true;
    } else {
        console.log("No feature found!");
        // popoverShow.value = false;
    }
}
function handleMapPointerMove(e) {
    const pixel = e.map.getEventPixel(e.originalEvent);
    const hit = e.map.hasFeatureAtPixel(pixel);
    e.map.getTarget().style.cursor = hit ? "pointer" : "";
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
