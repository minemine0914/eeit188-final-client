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
                <!-- <ol-feature
                                v-for="feature in features"
                                :properties="feature.properties"
                            >
                                <ol-geom-point
                                    :coordinates="feature.geometry.coordinates"
                                ></ol-geom-point>
                            </ol-feature>
                            <ol-style>
                                <ol-style-icon :src="pointIcon" :scale="0.2"></ol-style-icon>
                            </ol-style> -->
            </ol-source-vector>
        </ol-vector-layer>
        <ol-zoom-control
            ref="controlZoom"
            className="ol-custom-zoom-control"
            zoomInLabel="+"
            zoomOutLabel="-"
        ></ol-zoom-control>
    </ol-map>
</template>
<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserViewStore } from "@/stores/userViewStore";
const userViewStore = useUserViewStore();
const { containerHeight } = storeToRefs(userViewStore);
// Map init value
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
    // popoverShow.value = false;
    console.log("Move start", e);
}
function handleMapMoveEnd(e) {
    // popoverShow.value = false;
    let map = e.map;
    // 獲取目前可視範圍的經緯度 (西南和東北邊界)
    const extent = map.getView().calculateExtent(map.getSize());

    console.log("經緯度範圍:");
    console.log("左下角:", [extent[0], extent[1]]); // [經度, 緯度]
    console.log("右上角:", [extent[2], extent[3]]); // [經度, 緯度]
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
    currentCenter.value = event.target.getCenter();
}
function rotationChanged(event) {
    currentRotation.value = event.target.getRotation();
}
function zoomChanged(event) {
    currentZoom.value = event.target.getZoom();
    console.log("ZZZZZOM");
}
</script>
<style scoped></style>
