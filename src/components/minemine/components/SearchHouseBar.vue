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
                            label="入住 / 退房日期"
                            multiple="range"
                            variant="solo"
                            hide-details
                            flat
                            @update:focused="onFocusSearchRegion"
                            readonly
                        />
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-text-field
                            label="設施"
                            variant="solo"
                            hide-details
                            flat
                            @update:focused="onFocusSearchPostulate"
                        />
                        <v-btn
                            icon="mdi-magnify"
                            variant="flat"
                            color="brown-lighten-2"
                            to="/search"
                        />
                    </v-toolbar>
                </v-card>
                <v-card
                    v-show="isFocusSearchBar"
                    elevation="3"
                    rounded="xl"
                    min-height="50px"
                    ref="searchBarInfoRef"
                    style="z-index: 100"
                >
                    <v-tabs-window v-model="searchBarTab">
                        <v-tabs-window-item value="one">
                            <v-card-item>
                                <div>熱門城市</div>
                                <v-chip-group column>
                                    <v-chip
                                        v-for="city in cities"
                                        :key="city.CityName"
                                        class="my-1"
                                        @click="onClickCityChip(city.CityName)"
                                    >
                                        {{ city.CityName }}
                                    </v-chip></v-chip-group
                                >
                                <div>選擇城市</div>
                                <v-chip-group column>
                                    <v-chip
                                        v-for="city in cities"
                                        :key="city.CityName"
                                        class="my-1"
                                        @click="onClickCityChip(city.CityName)"
                                    >
                                        {{ city.CityName }}
                                    </v-chip></v-chip-group
                                >
                            </v-card-item>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="two">
                            <v-card-item>
                                <div>選擇區域</div>
                                <v-date-picker multiple="range"></v-date-picker>
                            </v-card-item>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="three">
                            <v-card-item>
                                <div>選擇城市</div>
                                <v-chip-group column>
                                    <v-chip
                                        v-for="city in cities"
                                        :key="city.CityName"
                                        class="my-1"
                                    >
                                        {{ city.CityName }}
                                    </v-chip></v-chip-group
                                >
                            </v-card-item>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import taiwanCityData from "@/assets/CityCountyData.json";
import Fuse from "fuse.js";
import { computed, ref } from "vue";

// State
const inputCityName = ref("");
const searchBarInfoRef = ref(null);
const searchBarTab = ref("one");
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
    console.log("click chip: ", name);
    inputCityName.value = name;
    searchBarTab.value = "two";
}

function onUpdateCity(value) {
    const result = fuse.search(value);
    cityResult.value = result.length > 0 ? result.map((obj) => obj.item) : fuse._docs;
}

function onFocusSearchCity(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "one";
}

function onFocusSearchRegion(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "two";
}

function onFocusSearchPostulate(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "three";
}
</script>

<style scoped></style>
