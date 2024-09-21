<template>
    <v-row class="ma-0 w-100" :style="{ height: `${containerHeight}px` }">
        <v-slide-x-transition>
            <v-col
                v-show="isShowInfoCard"
                xs="12"
                sm="6"
                md="5"
                lg="4"
                class="h-100"
                style="contain: size; padding-top: 100px"
            >
                <v-card ref="infoCardRef" class="h-100" rounded="xl">
                    <v-toolbar color="transparent" ref="infoCardToolbarRef" class="pa-2">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-map-search-outline" class="ml-3"></v-icon>
                        </template>
                        <v-toolbar-title class="text-h6" text="搜尋結果"></v-toolbar-title>
                        <template v-slot:append>
                            <v-btn icon="mdi-close" @click="isShowInfoCard = false"></v-btn>
                        </template>
                    </v-toolbar>
                    <div
                        class="d-flex"
                        :style="{ height: `${infoCardScrollHeight}px` }"
                        v-show="isShowInfoCard"
                    >
                        <!-- <v-virtual-scroll :items="features">
                                        <template v-slot:default="{ item, index }">
                                            <v-list-item>
                                                <v-responsive
                                                    :aspect-ratio="4 / 3"
                                                    class="border pa-4"
                                                    >{{ index }}</v-responsive
                                                >
                                                <div>{{ item.properties.name }}</div>
                                                <div>{{ item.properties.display_name }}</div>
                                            </v-list-item>
                                        </template>
                                    </v-virtual-scroll> -->
                    </div>
                </v-card>
            </v-col>
        </v-slide-x-transition>
        <!-- Open Info Card Button -->
        <v-slide-x-reverse-transition>
            <v-btn
                v-show="!isShowInfoCard"
                class="position-absolute top-0 left-0"
                @click.stop="isShowInfoCard = !isShowInfoCard"
                append-icon="mdi-chevron-right"
                size="large"
                :ripple="true"
                style="margin: 100px 0 0 30px"
                rounded="xl"
            >
                開啟清單
                <template v-slot:append>
                    <v-icon></v-icon>
                </template>
            </v-btn>
        </v-slide-x-reverse-transition>
    </v-row>
</template>
<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserViewStore } from "@/stores/userViewStore";
import { useElementSize } from "@vueuse/core";
const userViewStore = useUserViewStore();
const { containerHeight } = storeToRefs(userViewStore);
// Result controll
const isShowInfoCard = ref(true);
const infoCardRef = ref(null);
const infoCardToolbarRef = ref(null);
const infoCardScrollHeight = computed(() => infoCardHeight.value - infoCardToolbarHeight.value);
const { height: infoCardHeight } = useElementSize(infoCardRef);
const { height: infoCardToolbarHeight } = useElementSize(infoCardToolbarRef);
</script>
<style scoped></style>
