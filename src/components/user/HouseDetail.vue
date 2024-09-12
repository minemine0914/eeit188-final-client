<template>
    <v-container v-if="isErrorGetHouseInfo">
        House not found
    </v-container>
    <v-btn to="/house/qwe">TEST1</v-btn>
    <v-btn to="/house/asd">TEST1</v-btn>
    <v-btn to="/house/f4d671db-d560-46b6-8606-276df8f8cadc">TEST1</v-btn>
    <v-container v-if="!isErrorGetHouseInfo">
        <v-row class="pa-1">
            <v-col cols="12">
                <v-sheet>
                    <div class="text-h4">{{ houseInfo.name }}</div>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="6">
                <v-responsive :aspect-ratio="5 / 4">
                    <v-sheet class="h-100 w-100 pa-1" >
                        <v-img :src="testImg" position="center" class="h-100" cover rounded></v-img>
                    </v-sheet>
                </v-responsive>
            </v-col>
            <v-col cols="6">
                <v-row no-gutters class="h-50">
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100">
                            <v-img :src="testImg" position="center" class="h-100" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100">
                            <v-img :src="testImg" position="center" class="h-100" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                </v-row>
                <v-row no-gutters class="h-50">
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100">
                            <v-img :src="testImg" position="center" class="h-100" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100">
                            <v-img :src="testImg" position="center" class="h-100" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row class="pa-1">
            <v-col cols="12" md="8">
                <v-sheet border>TEST</v-sheet>
            </v-col>
            <v-col cols="12" md="4">
                <v-sheet border>TEST</v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { storeToRefs } from "pinia";
import testImg from "@/assets/banner05.webp";

const houseDetailStore = useHouseDetailStore();
const { houseInfo, isErrorGetHouseInfo } = storeToRefs(houseDetailStore);

const route = useRoute();
function loadHouseInfo(id) {
    houseDetailStore.getHouseInfo(id);
}

watch(
    // Watch Route params houseId change
    () => route.params.houseId,
    (newId, oldId) => {
        console.log(newId, oldId);
        houseDetailStore.getHouseInfo(newId);
    }
);

onMounted(() => {
    if (route.params.houseId) {
        console.log(route.params.houseId);
        loadHouseInfo(route.params.houseId);
    } else {
        console.log("HouseId not set");
        isErrorGetHouseInfo.value = true;
    }
});
</script>

<style scoped></style>
