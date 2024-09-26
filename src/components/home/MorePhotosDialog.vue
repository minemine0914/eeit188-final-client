<template>
    <v-dialog max-width="700">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg" min-width="500" min-height="300">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">更多相片</div>
                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                </v-card-title>
                <v-divider class="mb-0"></v-divider>
                <v-carousel v-model="selectedPhotoIndex" hide-delimiters show-arrows="hover" >
                    <v-carousel-item
                        v-for="(imgSrc, index) in houseSearchStore.getHouseImageUrlList(
                            houseInfo.houseExternalResourceRecords
                        )"
                        :src="imgSrc"
                        color="grey-darken-3"
                    ></v-carousel-item>
                    <template v-slot:prev="{ props }">
                        <v-btn
                            v-if="houseInfo.houseExternalResourceRecords.length > 1"
                            :class="props.class"
                            color="rgba(255,255,255,0.5)"
                            size="default"
                            density="compact"
                            icon="mdi-chevron-left"
                            variant="elevated"
                            @click.stop="props.onClick"
                        ></v-btn>
                    </template>
                    <template v-slot:next="{ props }">
                        <v-btn
                            v-if="houseInfo.houseExternalResourceRecords.length > 1"
                            :class="props.class"
                            color="rgba(255,255,255,0.5)"
                            size="default"
                            density="compact"
                            icon="mdi-chevron-right"
                            variant="elevated"
                            @click.stop="props.onClick"
                        ></v-btn>
                    </template>
                </v-carousel>
                <v-slide-group v-model="selectedPhotoIndex" show-arrows mandatory center-active>
                    <v-slide-group-item
                        v-for="(imgSrc, index) in houseSearchStore.getHouseImageUrlList(
                            houseInfo.houseExternalResourceRecords
                        )"
                        :key="index"
                        v-slot="{ isSelected, toggle }"
                    >
                        <v-card @click="toggle" class="ma-1" flat rounded="lg">
                            <v-img :height="100" :width="100" cover :src="imgSrc"></v-img>
                        </v-card>
                    </v-slide-group-item>
                </v-slide-group>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { storeToRefs } from "pinia";
// Use pinia store
const houseDetailStore = useHouseDetailStore();
const { houseInfo } = storeToRefs(houseDetailStore);
const houseSearchStore = useHouseSearchStore();
const selectedPhotoIndex = ref(0);
function onClickSlideItem(index) {
    console.log("Click slide item");
    selectedPhotoIndex.value = index;
}
</script>
<style scoped></style>
