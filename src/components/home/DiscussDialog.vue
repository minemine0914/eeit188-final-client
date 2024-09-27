<template>
    <v-dialog v-model="isDiscussDialogOpen" width="auto" :scrim="false" max-width="600">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="d-flex flex-row align-top">
                        <v-icon icon="mdi-message-draw" color="brown-darken-1"></v-icon>
                        <div class="text-h6 text-medium-emphasis pl-2">評價 {{ houseInfo.name }}</div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-item class="text-center">
                    <div class="text-subtitle-1">您覺得 {{ houseInfo.name }} 值幾顆星</div>
                    <v-rating
                        hover
                        :length="5"
                        :size="40"
                        v-model="selfHouseDiscuss.score"
                        color="warning"
                        active-color="warning"
                        class="text-h5"
                    />
                </v-card-item>
                <v-divider class="mb-1 mx-5"></v-divider>
                <v-card-item>
                    <v-textarea v-model="selfHouseDiscuss.discuss" :label="`寫下您住宿體驗感想 (選填)`" variant="outlined" class="mt-3" rows="5"></v-textarea>
                </v-card-item>
                <v-divider class="mb-4"></v-divider>
                <v-card-actions>
                    <!-- <v-btn>取消</v-btn> -->
                    <v-btn @click="onClickWriteDiscuss" :loading="isWritingDiscuss" :disabled="!canWriteDiscuss">送出</v-btn>
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
const { isDiscussDialogOpen, houseInfo, selfHouseDiscuss } = storeToRefs(houseDetailStore);

const isWritingDiscuss = ref(false);
const canWriteDiscuss = computed(()=>{
    return selfHouseDiscuss.value.score !== null || selfHouseDiscuss.value.score > 0;
});

async function onClickWriteDiscuss() {
    if ( canWriteDiscuss ) {
        isWritingDiscuss.value = true;
        await houseDetailStore.writeSelfHouseDiscuss();
        isWritingDiscuss.value = false;
        isDiscussDialogOpen.value = false;
    } else {
        console.log("score is empty or > 0");
    }

}

</script>
<style scoped></style>
