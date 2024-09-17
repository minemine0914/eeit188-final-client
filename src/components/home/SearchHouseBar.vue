<template>
    <div class="position-absolute w-100">
        <v-row justify="center" align="center" no-gutters>
            <v-col cols="12" xs="12" sm="9" md="8" lg="6" v-click-outside="onClickOutside">
                <v-card elevation="3" rounded="pill" class="px-3 mb-3" border style="z-index: 100">
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
                        <v-divider class="border-opacity-50 my-3" vertical />
                        <v-text-field
                            label="進階搜尋"
                            variant="solo"
                            hide-details
                            flat
                            readonly
                            @update:focused="onFocusSearchOther"
                        />
                        <v-btn
                            icon="mdi-magnify"
                            variant="flat"
                            color="brown-lighten-1"
                            @click.stop="onClickSearchBtn"
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
                                            @update:modelValue="onUpdateDatePicker"
                                        ></v-date-picker>
                                    </v-container>
                                </v-card-item>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="postulate">
                                <v-card-item>
                                    <v-row class="d-flex flex-row justify-center align-center">
                                        <v-col class="flex-grow-1 text-h6 font-weight-black"
                                            >選擇設施</v-col
                                        >
                                        <v-col class="flex-grow-1 d-flex justify-end align-center">
                                            <v-checkbox
                                                label="嚴格模式"
                                                v-model="searchParams.matchAllPostulates"
                                                hide-details
                                                density="compact"
                                                color="red"
                                                v-tooltip="{
                                                    text: '當勾選時，設施必須全部符合條件',
                                                    scrollStrategy: 'close',
                                                    scrim: false,
                                                    persistent: false,
                                                    openOnClick: false,
                                                    openOnHover: true,
                                                }"
                                            ></v-checkbox>
                                        </v-col>
                                    </v-row>
                                    <v-chip-group
                                        v-model="postlateChipGroup"
                                        column
                                        multiple
                                        selected-class="text-brown"
                                        @update:model-value="onUpdatePostulates"
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
                                        <v-list-item title="成人" subtitle="年滿18歲(含)以上">
                                            <template v-slot:append>
                                                <v-container
                                                    class="pa-2 d-flex justify-center align-center ga-5"
                                                    min-width="180px"
                                                    fluid
                                                >
                                                    <v-btn
                                                        :disabled="searchParams.adult < 1"
                                                        icon="mdi-minus"
                                                        size="small"
                                                        density="comfortable"
                                                        @click.stop="
                                                            () => {
                                                                searchParams.adult > 0
                                                                    ? searchParams.adult--
                                                                    : 0;
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
                                        <v-list-item title="孩童" subtitle="未滿18歲">
                                            <template v-slot:append>
                                                <v-container
                                                    class="pa-2 d-flex justify-center align-center ga-5"
                                                    min-width="180px"
                                                    fluid
                                                >
                                                    <v-btn
                                                        :disabled="searchParams.child < 1"
                                                        icon="mdi-minus"
                                                        size="small"
                                                        density="comfortable"
                                                        @click.stop="
                                                            () => {
                                                                searchParams.child > 0
                                                                    ? searchParams.child--
                                                                    : 0;
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
                            <v-tabs-window-item value="other">
                                <v-card-item>
                                    <div class="text-h6 font-weight-black">價格範圍</div>
                                    <v-sheet class="mt-3">
                                        <v-range-slider
                                            v-model="housePriceRange"
                                            :max="100000"
                                            :min="0"
                                            :step="1"
                                            class="align-center"
                                            hide-details
                                            color="brown-lighten-1"
                                            @update:model-value="onUpdateHousePriceRange"
                                        >
                                            <template v-slot:prepend>
                                                <v-text-field
                                                    v-model="housePriceRange[0]"
                                                    prefix="$"
                                                    density="compact"
                                                    style="width: 100px"
                                                    type="number"
                                                    variant="outlined"
                                                    hide-details
                                                    single-line
                                                    hide-spin-buttons
                                                    rounded="pill"
                                                ></v-text-field>
                                            </template>
                                            <template v-slot:append>
                                                <v-text-field
                                                    v-model="housePriceRange[1]"
                                                    prefix="$"
                                                    density="compact"
                                                    style="width: 100px"
                                                    type="number"
                                                    variant="outlined"
                                                    hide-details
                                                    single-line
                                                    hide-spin-buttons
                                                    rounded="pill"
                                                ></v-text-field>
                                            </template>
                                        </v-range-slider>
                                    </v-sheet>
                                    <v-divider class="border-opacity-25 my-5"></v-divider>
                                    <div class="text-h6 font-weight-black">基本起居</div>
                                    <v-sheet class="mt-3">
                                        <v-list lines="two">
                                            <v-list-item title="客廳">
                                                <template v-slot:append>
                                                    <v-container
                                                        class="pa-2 d-flex justify-center align-center ga-5"
                                                        min-width="180px"
                                                        fluid
                                                    >
                                                        <v-btn
                                                            :disabled="searchParams.livingDiningRoom < 1"
                                                            icon="mdi-minus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="
                                                                () => {
                                                                    searchParams.livingDiningRoom > 0
                                                                        ? searchParams.livingDiningRoom--
                                                                        : 0;
                                                                }
                                                            "
                                                        ></v-btn>
                                                        <div class="mx-1">
                                                            {{
                                                                searchParams.livingDiningRoom == 0
                                                                    ? "任意"
                                                                    : searchParams.livingDiningRoom + "+"
                                                            }}
                                                        </div>
                                                        <v-btn
                                                            icon="mdi-plus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="searchParams.livingDiningRoom++"
                                                        ></v-btn>
                                                    </v-container>
                                                </template>
                                            </v-list-item>
                                            <v-list-item title="臥室">
                                                <template v-slot:append>
                                                    <v-container
                                                        class="pa-2 d-flex justify-center align-center ga-5"
                                                        min-width="180px"
                                                        fluid
                                                    >
                                                        <v-btn
                                                            :disabled="searchParams.bedroom < 1"
                                                            icon="mdi-minus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="
                                                                () => {
                                                                    searchParams.bedroom > 0
                                                                        ? searchParams.bedroom--
                                                                        : 0;
                                                                }
                                                            "
                                                        ></v-btn>
                                                        <div class="mx-1">
                                                            {{
                                                                searchParams.bedroom == 0
                                                                    ? "任意"
                                                                    : searchParams.bedroom + "+"
                                                            }}
                                                        </div>
                                                        <v-btn
                                                            icon="mdi-plus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="searchParams.bedroom++"
                                                        ></v-btn>
                                                    </v-container>
                                                </template>
                                            </v-list-item>
                                            <v-list-item title="淋浴間">
                                                <template v-slot:append>
                                                    <v-container
                                                        class="pa-2 d-flex justify-center align-center ga-5"
                                                        min-width="180px"
                                                        fluid
                                                    >
                                                        <v-btn
                                                            :disabled="searchParams.bathroom < 1"
                                                            icon="mdi-minus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="
                                                                () => {
                                                                    searchParams.bathroom > 0
                                                                        ? searchParams.bathroom--
                                                                        : 0;
                                                                }
                                                            "
                                                        ></v-btn>
                                                        <div class="mx-1">
                                                            {{
                                                                searchParams.bathroom == 0
                                                                    ? "任意"
                                                                    : searchParams.bathroom + "+"
                                                            }}
                                                        </div>
                                                        <v-btn
                                                            icon="mdi-plus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="searchParams.bathroom++"
                                                        ></v-btn>
                                                    </v-container>
                                                </template>
                                            </v-list-item>
                                            <v-list-item title="衛生間">
                                                <template v-slot:append>
                                                    <v-container
                                                        class="pa-2 d-flex justify-center align-center ga-5"
                                                        min-width="180px"
                                                        fluid
                                                    >
                                                        <v-btn
                                                            :disabled="searchParams.restroom < 1"
                                                            icon="mdi-minus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="
                                                                () => {
                                                                    searchParams.restroom > 0
                                                                        ? searchParams.restroom--
                                                                        : 0;
                                                                }
                                                            "
                                                        ></v-btn>
                                                        <div class="mx-1">
                                                            {{
                                                                searchParams.restroom == 0
                                                                    ? "任意"
                                                                    : searchParams.restroom + "+"
                                                            }}
                                                        </div>
                                                        <v-btn
                                                            icon="mdi-plus"
                                                            size="small"
                                                            density="comfortable"
                                                            @click.stop="searchParams.restroom++"
                                                        ></v-btn>
                                                    </v-container>
                                                </template>
                                            </v-list-item>
                                        </v-list>
                                    </v-sheet>
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
import { useHouseSearchStore } from "@/stores/searchHouseStore";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const houseSearchStore = useHouseSearchStore();
const {
    inputValues,
    searchParams,
    postlateChipGroup,
    housePriceRange,
    postulateList,
    filterHouseList,
} = storeToRefs(houseSearchStore);
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
    } else if (searchParams.value.adult > 0 && searchParams.value.child == 0) {
        return `成人: ${searchParams.value.adult}`;
    } else if (searchParams.value.adult == 0 && searchParams.value.child > 0) {
        return `孩童: ${searchParams.value.child}`;
    } else if (searchParams.value.adult > 0 && searchParams.value.child > 0) {
        return `成人: ${searchParams.value.adult} 孩童: ${searchParams.value.child}`;
    } else {
        return "";
    }
});
const selectdPostulatesString = computed(() => {
    if (searchParams.value.postulateIds.length == 1) {
        let selected = postulateList.value.find(
            (postulate) => postulate.id == searchParams.value.postulateIds[0]
        );
        return selected.name;
    } else if (searchParams.value.postulateIds.length > 1) {
        return `已選擇${searchParams.value.postulateIds.length}個`;
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

function onUpdateDatePicker(value) {
    if (value.length > 1) {
        console.log("Pick done.", value);
        searchBarTab.value = "postulate";
        searchParams.value.daterange.splice(0, searchParams.value.daterange.length);
        searchParams.value.daterange.push(value[0], value[value.length - 1]);
    }
}

function onUpdatePostulates(value) {
    console.log(value);
    let selectedIds = value.map((index) => postulateList.value[index].id);
    // console.log(selectedIds);
    searchParams.value.postulateIds.splice(0, searchParams.value.postulateIds.length);
    searchParams.value.postulateIds.push(...selectedIds);
}

function onUpdateCity(value) {
    const result = fuse.search(value);
    cityResult.value = result.length > 0 ? result.map((obj) => obj.item) : fuse._docs;
    searchParams.value.city = value;
}

function onUpdateHousePriceRange() {
    searchParams.value.minPrice = housePriceRange.value[0];
    if (housePriceRange[1] > 99999) {
        searchParams.value.maxPrice = null;
    } else {
        searchParams.value.maxPrice = housePriceRange.value[1];
    }
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
function onFocusSearchOther(value) {
    isFocusSearchBar.value = true;
    searchBarTab.value = "other";
}

function onClickSearchBtn() {
    const searchPaths = ["/search", "/advanced-search"]; // 搜尋頁面的路由
    isFocusSearchBar.value = false;
    if (searchPaths.includes(route.path)) {
        // router.go(0); // 如果當前頁面在 searchPaths 中，重新整理頁面
        houseSearchStore.resetSearchResult();
    } else {
        router.push(searchPaths[0]); // 如果不是 searchPaths 中的頁面，導航到第一個 searchPath
        houseSearchStore.resetSearchResult();
    }
}

onMounted(() => {
    houseSearchStore.getPostulateList();
    // init search param values
    searchParams.value.minPrice = housePriceRange.value[0];
    searchParams.value.maxPrice = housePriceRange.value[1];
});
</script>

<style scoped></style>
