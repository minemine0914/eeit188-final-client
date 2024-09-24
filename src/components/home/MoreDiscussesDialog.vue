<template>
    <v-dialog v-model="isMoreDiscussesDialogOpen" max-width="650">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg" min-width="500" min-height="300">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">更多評論</div>
                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                </v-card-title>
                <v-divider class="mb-0"></v-divider>
                <v-infinite-scroll :items="discussList" :onLoad="loadDiscussList" v-if="renderDiscussList">
                    <!-- Scroll empty component -->
                    <template v-slot:empty>
                        <v-sheet>
                            <v-alert variant="plain">
                                <span>沒有更多評論了</span>
                            </v-alert>
                        </v-sheet>
                    </template>
                    <template v-for="(discuss, index) in discussList" :key="index">
                        <v-card-item>
                            <DiscussCard :discuss />
                        </v-card-item>
                    </template>
                </v-infinite-scroll>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import DiscussCard from "./DiscussCard.vue";
import { onMounted } from "vue";

const houseDetailStore = useHouseDetailStore();
const { discussList, currentDiscussPage, isMoreDiscussesDialogOpen, renderDiscussList } =
    storeToRefs(houseDetailStore);

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

onMounted(()=>{
    // Reset discuss list
    houseDetailStore.reloadDiscussList();
});

</script>
<style scoped>
:deep(.v-infinite-scroll__side) {
    padding: 0 !important;
}
</style>
