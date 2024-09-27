<template>
    <ol-map
        class="position-absolute w-100 top-0 left-0"
        :style="{ height: `${containerHeight}px` }"
        :controls="[]"
        ref="mapRef"
        @click="handleMapClick"
        @movestart="handleMapMoveStart"
        @pointermove="handleMapPointerMove"
        @moveend="handleMapMoveEnd"
    >
        <!-- View -->
        <ol-view
            :projection="projection"
            :center="center"
            :zoom="zoom"
            :rotation="rotation"
            @change:center="centerChanged"
            @change:resolution="resolutionChanged"
            @change:rotation="rotationChanged"
            @change:zoom="zoomChanged"
        />
        <!-- Title -->
        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>
        <ol-vector-layer>
            <ol-source-vector>
                <!-- <ol-feature v-for="house in filterHouseList" :properties="{ price: house.price }">
                    <ol-geom-point
                        :coordinates="[house.longitudeY, house.latitudeX]"
                    ></ol-geom-point>
                </ol-feature> -->
                <ol-style>
                    <ol-style-icon :src="pointIcon" :scale="0.2"></ol-style-icon>
                </ol-style>
            </ol-source-vector>
        </ol-vector-layer>
        <ol-overlay
            v-for="house in filterHouseList"
            :position="[house.longitudeY, house.latitudeX]"
            :autoPan="false"
            positioning="top-center"
            :stopEvent="false"
        >
            <v-menu open-on-click location="center">
                <template v-slot:activator="{ props }">
                    <v-hover v-slot="{ isHovering, props: hoverProps }">
                        <v-btn
                            v-bind="{...props, ...hoverProps}"
                            color="white"
                            rounded="pill"
                            :border="true"
                            :elevation="isHovering ? 8 : 2"
                            class="text-brown text-body-1"
                        >
                            ${{ house.price }}
                        </v-btn>
                    </v-hover>
                </template>
                <v-hover v-slot="{ isHovering, props: hoverProps }">
                    <v-card
                        :class="{ 'on-hover': isHovering }"
                        v-bind="hoverProps"
                        width="320"
                        class="px-4 pt-4 pb-3 cursor-pointer"
                        rounded="xl"
                        @click="onClickOverlay(house.id)"
                        :elevation="isHovering ? 8 : 2"
                    >
                        <!-- 圖片 -->
                        <v-sheet color="transparent" rounded="lg" class="overflow-hidden">
                            <v-carousel
                                height="200"
                                show-arrows="hover"
                                hide-delimiter-background
                                hide-delimiters
                            >
                                <template v-slot:prev="{ props: carouselProps }">
                                    <v-btn
                                        v-if="house.houseExternalResourceRecords.length > 1"
                                        :class="carouselProps.class"
                                        color="rgba(255,255,255,0.5)"
                                        size="small"
                                        density="compact"
                                        icon="mdi-chevron-left"
                                        variant="elevated"
                                        @click.stop="carouselProps.onClick"
                                    ></v-btn>
                                </template>
                                <template v-slot:next="{ props: carouselProps }">
                                    <v-btn
                                        v-if="house.houseExternalResourceRecords.length > 1"
                                        :class="carouselProps.class"
                                        color="rgba(255,255,255,0.5)"
                                        size="small"
                                        density="compact"
                                        icon="mdi-chevron-right"
                                        variant="elevated"
                                        @click.stop="carouselProps.onClick"
                                    ></v-btn>
                                </template>
                                <v-carousel-item
                                    v-for="imageSrc in houseSearchStore.getHouseImageUrlList(
                                        house.houseExternalResourceRecords
                                    )"
                                >
                                    <v-img
                                        :aspect-ratio="1"
                                        :src="imageSrc"
                                        cover
                                        class="cursor-pointer"
                                    ></v-img>
                                </v-carousel-item>
                            </v-carousel>
                        </v-sheet>
                        <v-sheet class="mt-1">
                            <v-sheet class="d-flex flex-row justify-space-between">
                                <div class="text-h6 text-brown-darken-1">{{ house.name }}</div>
                                <div class="text-h6 text-brown-darken-1">NT ${{ house.price }}</div>
                            </v-sheet>
                            <div class="text-body-2 text-brown-darken-1">
                                <span class="mdi mdi-map-marker mr-2"></span>
                                <span class="mr-2">{{
                                    `${house.city} ${house.region} ${house.address}`
                                }}</span>
                            </div>
                            <div class="text-body-2 text-brown-darken-1">
                                <span class="mdi mdi-sofa mr-2"></span>
                                <span>共 </span>
                                <span class="mr-1" v-if="house.livingDiningRoom > 0">
                                    {{ `${house.livingDiningRoom} 廳` }}
                                </span>
                                <span class="mr-1" v-if="house.bedroom > 0">
                                    {{ `${house.bedroom} 房` }}
                                </span>
                                <span class="mr-1" v-if="house.bathroom > 0">
                                    {{ `${house.bathroom} 淋浴` }}
                                </span>
                                <span class="mr-1" v-if="house.restroom > 0">
                                    {{ `${house.restroom} 衛生` }}
                                </span>
                            </div>
                            <div class="text-body-2 text-brown-darken-1">
                                <span class="mdi mdi-bed mr-2"></span>
                                <span>可住 </span>
                                <span class="mr-1" v-if="house.adult > 0">
                                    {{ `${house.adult} 位成人 ` }}
                                </span>
                                <span class="mr-1" v-if="house.child > 0">
                                    {{ `${house.child} 位孩童 ` }}
                                </span>
                            </div>
                        </v-sheet>
                    </v-card>
                </v-hover>
            </v-menu>
        </ol-overlay>
        <ol-zoom-control
            ref="controlZoom"
            className="ol-custom-zoom-control"
            zoomInLabel="+"
            zoomOutLabel="-"
        ></ol-zoom-control>
    </ol-map>
</template>
<script setup>
import pointIcon from "@/assets/point01.svg";
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserViewStore } from "@/stores/userViewStore";
import { useHouseSearchStore } from "../../stores/houseSearchStore";
const userViewStore = useUserViewStore();
const { containerHeight } = storeToRefs(userViewStore);
const houseSearchStore = useHouseSearchStore();
const { searchParams, filterHouseList } = storeToRefs(houseSearchStore);
// Map value
const mapRef = ref(null);
const controlZoom = ref(null);
const center = ref([121.55454272031784, 25.041996017098427]);
const projection = ref("EPSG:4326");
const zoom = ref(13);
const rotation = ref(0);
const currentCenter = ref(center.value);
const currentZoom = ref(zoom.value);
const currentRotation = ref(rotation.value);
const currentResolution = ref(0);
// 範圍移動初始化
const movementThreshold = ref(0.045); // 閾值：定義最小的移動距離 (這裡設為 0.01 經緯度)
const moveStartCenter = ref(null);
const moveEndCenter = ref(null);
const lastFetchCenter = ref(center.value);
// OLMap event
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
function handleMapMoveStart(e) {
    let map = e.map;
    let view = map.getView();
    // console.log("Move start", e);
    moveStartCenter.value = view.getCenter();
}
function handleMapMoveEnd(e) {
    let map = e.map;
    let view = map.getView();
    moveEndCenter.value = view.getCenter();
    // 獲取目前可視範圍的經緯度 (西南和東北邊界)
    const extent = view.calculateExtent(map.getSize());
    // console.log("經緯度範圍:");
    console.log("左下角:", [extent[0], extent[1]]); // [經度, 緯度]
    console.log("右上角:", [extent[2], extent[3]]); // [經度, 緯度]
    searchParams.value.minLatitudeX = extent[1];
    searchParams.value.maxLatitudeX = extent[3];
    searchParams.value.minLongitudeY = extent[0];
    searchParams.value.maxLongitudeY = extent[2];
    //
    if (lastFetchCenter.value && moveEndCenter.value) {
        const lonDiff = Math.abs(moveEndCenter.value[0] - lastFetchCenter.value[0]); // 經度差
        const latDiff = Math.abs(moveEndCenter.value[1] - lastFetchCenter.value[1]); // 緯度差

        // console.log(`經度移動: ${lonDiff}, 緯度移動: ${latDiff}`);
        // 判斷是否移動超過閾值
        if (lonDiff > movementThreshold.value || latDiff > movementThreshold.value) {
            console.log("移動超過閾值:", currentCenter.value);
            lastFetchCenter.value = view.getCenter();
            houseSearchStore.resetSearchResult();
        } else {
            console.log("移動範圍內:", currentCenter.value);
            if (center.value == lastFetchCenter.value && center.value == currentCenter.value) {
                console.log("第一次FETCH");
                houseSearchStore.resetSearchResult();
            }
        }
    }

    // 不管如何，點擊搜尋按鈕就重新搜尋結果
    // houseSearchStore.resetSearchResult();
}
// OLView event
function handleMapPointerMove(e) {
    const pixel = e.map.getEventPixel(e.originalEvent);
    const hit = e.map.hasFeatureAtPixel(pixel);
    e.map.getTarget().style.cursor = hit ? "pointer" : "";
}
// View event
function resolutionChanged(event) {
    currentResolution.value = event.target.getResolution();
    currentZoom.value = event.target.getZoom();
}
function centerChanged(event) {
    // console.log("Center change: ", event.target.getCenter());
    currentCenter.value = event.target.getCenter();
}
function rotationChanged(event) {
    currentRotation.value = event.target.getRotation();
}
function zoomChanged(event) {
    currentZoom.value = event.target.getZoom();
    console.log("ZZZZZOM");
}
function onClickOverlay(id) {
    window.open(`/house/${id}`, "_blank");
}
</script>
<style scoped></style>
