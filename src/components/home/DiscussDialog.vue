<template>
    <v-dialog v-model="isDiscussDialogOpen" width="auto" :scrim="false" max-width="600">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">評論 {{ houseInfo.name }}</div>
                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-item class="text-center">
                    <div>您覺得 {{ houseInfo.name }} 值幾顆星</div>
                    <v-rating
                        hover
                        :length="5"
                        :size="40"
                        :model-value="4"
                        color="warning"
                        active-color="warning"
                        class="text-h5"
                    />
                </v-card-item>
                <v-divider class="mb-1 mx-5"></v-divider>
                <v-card-item>
                    <v-textarea :label="`寫下您住宿體驗感想 (選填)`" variant="outlined" class="mt-3" rows="5"></v-textarea>
                </v-card-item>
                <v-divider class="mb-4"></v-divider>
                <v-card-actions>
                    <v-btn>取消</v-btn>
                    <v-btn>送出</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useHouseDetailStore } from "@/stores/houseDetailStore";
import { computed, ref } from "vue";

const houseDetailStore = useHouseDetailStore();
const { isDiscussDialogOpen, houseInfo } = storeToRefs(houseDetailStore);
</script>
<style scoped></style>
