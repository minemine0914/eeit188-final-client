<template>
    <div class="position-absolute w-100">
        <v-row justify="center" align="center" no-gutters>
            <v-col cols="12" xs="12" sm="9" md="6" v-click-outside="onClickOutside">
                <v-card elevation="1" rounded="pill" class="px-3 mb-3" style="z-index: 100">
                    <v-toolbar dense color="rgba(0,0,0,0)">
                        <v-text-field
                            v-model="inputCityName"
                            label="城市"
                            variant="solo"
                            hide-details
                            flat
                            @update:modelValue="onUpdateCity"
                            @update:focused="onFocusSearchCity"
                        />
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-date-input
                            v-model="inputDateRange"
                            label="入住 / 退房日期"
                            multiple="range"
                            prepend-icon=""
                            variant="solo"
                            hide-details
                            flat
                            readonly
                            @update:focused="onFocusSearchDateRange"
                        />
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-text-field
                            v-model="inputPostulateName"
                            label="設施"
                            variant="solo"
                            hide-details
                            flat
                            @update:focused="onFocusSearchPostulate"
                        />
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-text-field
                            v-model="inputPostulateName"
                            label="人數"
                            variant="solo"
                            hide-details
                            flat
                            @update:focused="onFocusSearchPeople"
                        />
                        <v-btn
                            icon="mdi-magnify"
                            variant="flat"
                            color="brown-lighten-2"
                            to="/search"
                        />
                    </v-toolbar>
                </v-card>
                <v-slide-y-transition>
                    <v-card
                        v-show="isFocusSearchBar"
                        class="pa-3"
                        elevation="3"
                        rounded="xl"
                        ref="searchBarInfoRef"
                        style="z-index: 100"
                    >
                        <v-tabs-window v-model="searchBarTab">
                            <v-tabs-window-item value="city">
                                <v-card-item>
                                    <div>選擇城市</div>
                                    <v-chip-group column>
                                        <v-chip
                                            v-for="city in cities"
                                            :key="city.CityName"
                                            class="my-1"
                                            @click="onClickCityChip(city.CityName)"
                                        >
                                            {{ city.CityName }}
                                        </v-chip>
                                    </v-chip-group>
                                </v-card-item>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="daterange">
                                <v-card-item>
                                    <div>選擇日期</div>
                                    <v-date-picker
                                        v-model="inputDateRange"
                                        multiple="range"
                                    ></v-date-picker>
                                </v-card-item>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="postulate">
                                <v-card-item>
                                    <div>選擇設施</div>
                                    <v-chip-group column>
                                        <v-chip
                                            v-for="postulate in postulateList"
                                            :key="postulate.id"
                                            class="my-1"
                                            @click="onClickPostulateChip(postulate)"
                                        >
                                            {{ postulate.name }}
                                        </v-chip></v-chip-group
                                    >
                                </v-card-item>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="people">
                                <v-card-item>
                                    <div>選擇人數</div>
                                    <!-- <n-date-picker type="daterange" panel /> -->
                                    <!-- <v-date-input
                                    v-model="model"
                                    label="Select range"
                                    max-width="368"
                                    multiple="range"
                                ></v-date-input> -->
                                </v-card-item>
                            </v-tabs-window-item>
                        </v-tabs-window>
                    </v-card>
                </v-slide-y-transition>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import taiwanCityData from "@/assets/CityCountyData.json";
import Fuse from "fuse.js";
import { computed, onMounted, ref } from "vue";
import { useHouseSearchStore } from "../../../stores/searchHouseStore";
import { storeToRefs } from "pinia";
const houseSearchStore = useHouseSearchStore();
const { postulateList } = storeToRefs(houseSearchStore);
// import { NDatePicker } from "naive-ui";
// State
const inputCityName = ref("");
const inputDateRange = ref(null);
const inputPostulateName = ref("");
const searchBarInfoRef = ref(null);
const searchBarTab = ref("city");
const isFocusSearchBar = ref(false);

// Fuse.js configuration for fuzzy search
const fuse = new Fuse(taiwanCityData, {
    keys: ["CityName", "CityEngName"],
    threshold: 0.6,
});
const cityResult = ref(fuse._docs);

// Computed properties
const cities = computed(() => cityResult.value);

// Methods
function onClickOutside(value) {
    isFocusSearchBar.value = false;
    // console.log("Click outside!!!!");
}

function onClickCityChip(name) {
    inputCityName.value = name;
    searchBarTab.value = "daterange";
}

function onClickPostulateChip(postulate) {
    inputPostulateName.value = postulate.name;
    // searchBarTab.value = "two";
}

function onUpdateCity(value) {
    const result = fuse.search(value);
    cityResult.value = result.length > 0 ? result.map((obj) => obj.item) : fuse._docs;
}

function onFocusSearchCity(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "city";
}

function onFocusSearchDateRange(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "daterange";
}

function onFocusSearchPostulate(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "postulate";
}
function onFocusSearchPeople(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "people";
}

onMounted(() => {
    houseSearchStore.getPostulateList();
});
</script>

<style scoped></style>
