<template>
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
                    :src="houseDetailStore.getHouseDetailImage(0)"
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
                            :src="houseDetailStore.getHouseDetailImage(1)"
                            position="center"
                            cover
                            :height="smallImageHeight"
                            v-else
                        ></v-img>
                    </v-sheet>
                    <v-sheet class="flex-grow-1 rounded-te-xl overflow-hidden">
                        <v-skeleton-loader
                            v-if="isLoading"
                            type="image"
                            height="100%"
                            width="100%"
                        />
                        <v-img
                            v-else
                            :src="houseDetailStore.getHouseDetailImage(2)"
                            position="center"
                            :height="smallImageHeight"
                            cover
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
                            :src="houseDetailStore.getHouseDetailImage(3)"
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
                            :src="houseDetailStore.getHouseDetailImage(4)"
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
</template>
<script setup>
import { ref } from "vue";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { storeToRefs } from "pinia";
import { useResizeObserver } from "@vueuse/core";

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const { isLoading } = storeToRefs(houseDetailStore);

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
