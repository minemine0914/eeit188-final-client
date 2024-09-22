<template>
    <v-card
        flat
        rounded="lg"
        @click="$router.push(`/house/${house.id}`)"
        :ripple="false"
        :hover="false"
    >
        <v-card-item class="pt-4">
            <v-sheet color="transparent" class="overflow-hidden" rounded="lg">
                <v-carousel
                    height="200"
                    show-arrows="hover"
                    hide-delimiter-background
                    hide-delimiters
                >
                    <template v-slot:prev="{ props }">
                        <v-btn
                            v-if="house.houseExternalResourceRecords.length > 1"
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
                            v-if="house.houseExternalResourceRecords.length > 1"
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
                            house.houseExternalResourceRecords
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
        <v-card-title class="py-0 d-flex flex-row align-center justify-center">
            <div class="flex-grow-1">{{ house.name }}</div>
            <div class="d-flex flex-grow-1 text-body-2 justify-end align-top">
                <v-icon icon="mdi-star-outline" size="small"></v-icon>
                <span>4.9</span>
            </div>
        </v-card-title>
        <v-card-subtitle class="pb-2">
            <div class="text-grey-darken-1">
                <span class="mdi mdi-map-marker mr-2"></span>
                <span class="mr-2">{{ `${house.city} ${house.region}` }}</span>
            </div>
            <div class="text-grey-darken-1">
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
            <div class="text-grey-darken-1">
                <span class="mdi mdi-bed mr-2"></span>
                <span>可住 </span>
                <span class="mr-1" v-if="house.adult > 0">
                    {{ `${house.adult} 位成人 ` }}
                </span>
                <span class="mr-1" v-if="house.child > 0">
                    {{ `${house.child} 位孩童 ` }}
                </span>
            </div>
        </v-card-subtitle>
        <v-card-text class="font-weight-bold pt-0">${{ house.price }} / 日</v-card-text>
    </v-card>
</template>
<script setup>
import { useHouseSearchStore } from "@/stores/houseSearchStore";
const houseSearchStore = useHouseSearchStore();
defineProps(['house']);
</script>
<style></style>
