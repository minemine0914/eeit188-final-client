<template>
    <v-sheet class="d-flex flex-row justify-center align-center position-relative">
        <v-sheet class="d-flex flex-column align-self-stretch">
            <v-btn
                class="d-flex flex-grow-1 align-center justify-center cursor-pointer px-3"
                color="transparent"
                @click="scrollLeft"
                icon="mdi-chevron-left"
                :rounded="true"
                :ripple="false"
                flat
            >
            </v-btn>
        </v-sheet>
        <v-infinite-scroll
            class="flex-grow-1"
            style="min-height: 360px"
            direction="horizontal"
            @load="loadHotHouse"
            ref="infinityScrollRef"
        >
            <template
                v-for="(house, index) in displayedHouses"
                :key="house.houseDetails?.id || index"
            >
                <HouseCard
                    v-if="!house.isLoading"
                    :house="house.houseDetails"
                    :avg-score="house.averageScore"
                    :total-scores="house.totalScores"
                    min-width="320px"
                    class="h-100"
                />
                <v-card v-else height="360" min-width="320" elevation="0">
                    <v-card-item class="pt-4">
                        <v-sheet
                            color="transparent"
                            class="overflow-hidden"
                            rounded="lg"
                            height="200"
                        >
                            <v-skeleton-loader class="mx-auto h-100" type="image" />
                        </v-sheet>
                    </v-card-item>
                    <v-skeleton-loader type="list-item-three-line" />
                </v-card>
            </template>
        </v-infinite-scroll>
        <v-sheet class="d-flex flex-column align-self-stretch">
            <v-btn
                class="d-flex flex-grow-1 align-center justify-center cursor-pointer px-3"
                color="transparent"
                @click="scrollRight"
                icon="mdi-chevron-right"
                :rounded="true"
                :ripple="false"
                flat
            >
            </v-btn>
        </v-sheet>
    </v-sheet>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/plugins/axios";
import HouseCard from "./HouseCard.vue";

const infinityScrollRef = ref(null);
const currentPage = ref(0);
const hotHouseList = ref([]);
const isLoading = ref(false);

const displayedHouses = computed(() => {
    const houses = [...hotHouseList.value];
    if (isLoading.value) {
        houses.push(...Array(8).fill({ isLoading: true }));
    }
    return houses;
});

async function loadHotHouse({ done }) {
    if (isLoading.value) return;

    console.log("Get hot house...");
    isLoading.value = true;

    try {
        const response = await api.post("/house/mongo/scores/average-grouped-by-house", {
            show: true,
            review: true,
            limit: 10,
            page: currentPage.value,
            dir: true,
            order: "averageScoreModified",
            randomFactor: 0,
        });

        const data = response.data;

        if (!data.empty) {
            hotHouseList.value.push(...data.content);
            currentPage.value++;
            console.log(`Get hot house list ok! Page: ${currentPage.value}`);
            done("ok");
        } else {
            console.log(`Get hot house list empty! Page: ${currentPage.value}`);
            done("empty");
        }
    } catch (err) {
        console.log(`Get hot house list error! Page: ${currentPage.value}`);
        done("error");
    } finally {
        isLoading.value = false;
    }
}

function scrollLeft() {
    console.log("Scrolling left");
    const container = infinityScrollRef.value?.$el;
    if (container) {
        container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
    } else {
        console.error("Scroll container not found");
    }
}

function scrollRight() {
    console.log("Scrolling right");
    const container = infinityScrollRef.value?.$el;
    if (container) {
        container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
    } else {
        console.error("Scroll container not found");
    }
}
</script>

<style scoped>
:deep(.v-infinite-scroll__side) {
    padding: 0 !important;
}
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
