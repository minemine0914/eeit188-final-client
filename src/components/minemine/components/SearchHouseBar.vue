<template>
    <div class="position-absolute w-100">
        <v-row justify="center" align="center" no-gutters>
            <v-col cols="12" xs="12" sm="9" md="6" v-click-outside="onClickOutside">
                <v-card elevation="1" rounded="pill" class="px-3 mb-3" style="z-index: 100">
                    <v-toolbar dense color="rgba(0,0,0,0)">
                        <v-text-field
                            v-model="inputValues.cityName"
                            label="城市"
                            variant="solo"
                            hide-details
                            flat
                            @update:modelValue="onUpdateCity"
                            @update:focused="onFocusSearchCity"
                        />
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-date-input
                            v-model="inputValues.dateRange"
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
                            v-model="selectdPostulatesString"
                            label="設施"
                            variant="solo"
                            hide-details
                            flat
                            readonly
                            @update:focused="onFocusSearchPostulate"
                        />
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-text-field
                            v-model="peopleInfoString"
                            label="人數"
                            variant="solo"
                            hide-details
                            flat
                            readonly
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
                                    <div class="text-h6 font-weight-black">選擇城市</div>
                                    <v-chip-group column selected-class="text-brown">
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
                                    <div class="text-h6 font-weight-black">選擇日期</div>
                                    <v-container
                                        class="pa-2 d-flex justify-center ga-5"
                                        min-width="180px"
                                        fluid
                                    >
                                        <v-date-picker
                                            v-model="inputValues.dateRange"
                                            multiple="range"
                                            show-adjacent-months
                                            hide-header
                                            @update:modelValue="onDatePickerUpdate"
                                        ></v-date-picker>
                                    </v-container>
                                </v-card-item>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="postulate">
                                <v-card-item>
                                    <div class="text-h6 font-weight-black">選擇設施</div>
                                    <v-chip-group
                                        column
                                        multiple
                                        selected-class="text-brown"
                                        @update:model-value="onSelectPostulates"
                                    >
                                        <v-chip
                                            v-for="postulate in postulateList"
                                            :key="postulate.id"
                                            class="my-1"
                                            filter
                                        >
                                            {{ postulate.name }}
                                        </v-chip>
                                    </v-chip-group>
                                </v-card-item>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="people">
                                <v-card-item>
                                    <div class="text-h6 font-weight-black">選擇人數</div>
                                    <v-list lines="two">
                                        <v-list-item title="成人" subtitle="年滿">
                                            <template v-slot:append>
                                                <v-container
                                                    class="pa-2 d-flex justify-center align-center ga-5"
                                                    min-width="180px"
                                                    fluid
                                                >
                                                    <v-btn
                                                        icon="mdi-minus"
                                                        size="small"
                                                        density="comfortable"
                                                        @click.stop="
                                                            () => {
                                                                searchParams.adult > 0
                                                                    ? searchParams.adult--
                                                                    : _;
                                                            }
                                                        "
                                                    ></v-btn>
                                                    <div class="mx-1">{{ searchParams.adult }}</div>
                                                    <v-btn
                                                        icon="mdi-plus"
                                                        size="small"
                                                        density="comfortable"
                                                        @click.stop="searchParams.adult++"
                                                    ></v-btn>
                                                </v-container>
                                            </template>
                                        </v-list-item>
                                        <v-list-item title="孩童" subtitle="年滿">
                                            <template v-slot:append>
                                                <v-container
                                                    class="pa-2 d-flex justify-center align-center ga-5"
                                                    min-width="180px"
                                                    fluid
                                                >
                                                    <v-btn
                                                        icon="mdi-minus"
                                                        size="small"
                                                        density="comfortable"
                                                        @click.stop="
                                                            () => {
                                                                searchParams.child > 0
                                                                    ? searchParams.child--
                                                                    : _;
                                                            }
                                                        "
                                                    ></v-btn>
                                                    <div class="mx-1">{{ searchParams.child }}</div>
                                                    <v-btn
                                                        icon="mdi-plus"
                                                        size="small"
                                                        density="comfortable"
                                                        @click.stop="searchParams.child++"
                                                    ></v-btn>
                                                </v-container>
                                            </template>
                                        </v-list-item>
                                        <v-list-item title="寵物" subtitle="會攜帶寵物嗎?">
                                            <template v-slot:append>
                                                <v-container
                                                    class="pa-2 d-flex justify-center align-center ga-5"
                                                    min-width="180px"
                                                    fluid
                                                >
                                                    <v-btn
                                                        density="default"
                                                        :active="!searchParams.pet"
                                                        @click.stop="searchParams.pet = false"
                                                        >否</v-btn
                                                    >
                                                    <v-btn
                                                        density="default"
                                                        :active="searchParams.pet"
                                                        @click.stop="searchParams.pet = true"
                                                        >是</v-btn
                                                    >
                                                </v-container>
                                            </template>
                                        </v-list-item>
                                    </v-list>
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
import { computed, onMounted, reactive, ref } from "vue";
import { useHouseSearchStore } from "../../../stores/searchHouseStore";
import { storeToRefs } from "pinia";
const houseSearchStore = useHouseSearchStore();
const { inputValues, searchParams, postulateList } = storeToRefs(houseSearchStore);
// State
// const inputCityName = ref("");
// const inputDateRange = ref(null);
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
const peopleInfoString = computed(() => {
    if (searchParams.value.pet) {
        return `成人: ${searchParams.value.adult} 孩童: ${searchParams.value.child} 攜帶寵物`;
    } else if ( searchParams.value.adult > 0 && searchParams.value.child == 0) {
        return `成人: ${searchParams.value.adult}`;
    } else if ( searchParams.value.adult == 0 && searchParams.value.child > 0) {
        return `孩童: ${searchParams.value.child}`;
    } else if (searchParams.value.adult > 0 && searchParams.value.child > 0) {
        return `成人: ${searchParams.value.adult} 孩童: ${searchParams.value.child}`;
    } else {
        return '';
    }
});
const selectdPostulatesString = computed(() => {
    if (searchParams.value.postulates.length == 1) {
        let selected = postulateList.value.find(
            (postulate) => postulate.id == searchParams.value.postulates[0]
        );
        return selected.name;
    } else if (searchParams.value.postulates.length > 1) {
        return `已選擇${searchParams.value.postulates.length}個`;
    } else {
        return "";
    }
});

// Methods
function onClickOutside(value) {
    isFocusSearchBar.value = false;
    // console.log("Click outside!!!!");
}

function onClickCityChip(name) {
    inputValues.value.cityName = name;
    searchParams.value.city = name;
    searchBarTab.value = "daterange";
}

function onDatePickerUpdate(value) {
    if (value.length > 1) {
        console.log("Pick done.", value);
        searchBarTab.value = "postulate";
        searchParams.value.daterange.splice(0, searchParams.value.daterange.length);
        searchParams.value.daterange.push(value[0], value[value.length - 1]);
    }
}

function onSelectPostulates(value) {
    let selectedIds = value.map((index) => postulateList.value[index].id);
    // console.log(selectedIds);
    searchParams.value.postulates.splice(0, searchParams.value.postulates.length);
    searchParams.value.postulates.push(...selectedIds);
}

function onUpdateCity(value) {
    const result = fuse.search(value);
    cityResult.value = result.length > 0 ? result.map((obj) => obj.item) : fuse._docs;
    searchParams.value.city = value;
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
