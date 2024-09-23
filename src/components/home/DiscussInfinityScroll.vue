<template>
    <v-infinite-scroll :height="300" :items="discussList" :onLoad="loadDiscussList">
        <v-row>
            <template v-for="(discuss, index) in discussList" :key="item">
                <v-col cols="12" md="6">
                    <v-card color="brown-lighten-5" flat>
                        <template v-slot:prepend>
                            <v-avatar size="large" border>
                                <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
                            </v-avatar>
                        </template>
                        <template v-slot:append>
                            <v-rating
                                hover
                                :length="5"
                                :size="23"
                                :model-value="discuss.score"
                                color="warning"
                                active-color="warning"
                                readonly
                            />
                        </template>
                        <template v-slot:title>
                            <div>HAHAHA</div>
                        </template>
                        <template v-slot:subtitle>
                            <div>共100則評論</div>
                        </template>
                        <v-card-text class="pb-1">
                            <v-sheet max-height="80px" class="overflow-auto" color="transparent">
                                很棒很棒很棒很棒很棒很棒很棒很棒很棒很棒，很棒很棒很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                                很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!很棒很棒很棒，很棒!!!!!
                            </v-sheet>
                            <div class="text-caption text-end pt-3">評論日期: 2024-09-09</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </template>
        </v-row>
    </v-infinite-scroll>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useHouseDetailStore } from "../../stores/houseDetailStore";

const houseDetailStore = useHouseDetailStore();
const { discussList, currentDiscussPage } = storeToRefs(houseDetailStore);

async function loadDiscussList({ done }) {
    console.log("Infinity scroll get data...");
    let data = await houseDetailStore.getHouseDiscuss();
    if (data != null) {
        if (!data.empty) {
            discussList.value.push(...data.discusses);
            currentDiscussPage.value++;
            console.log(`Read discuss list ok! Page: ${currentDiscussPage.value}`);
            done("ok");
        } else {
            console.log(`Read discuss list empty! Page: ${currentDiscussPage.value}`);
            done("empty");
        }
    } else {
        console.log(`Read discuss list error! Page: ${currentDiscussPage.value}`);
        done("error");
    }
}
</script>
<style scoped></style>
