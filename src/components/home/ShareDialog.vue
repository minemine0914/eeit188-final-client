<template>
    <v-dialog v-model="isShareDialogOpen" width="auto" :scrim="false" max-width="600">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="text-h5 text-medium-emphasis ps-2">分享房源</div>
                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                </v-card-title>
                <v-divider class="mb-4"></v-divider>
                <v-card-text>
                    <v-text-field
                        variant="outlined"
                        hide-details
                        readonly
                        prepend-inner-icon="mdi-link"
                        :model-value="shareHouseLink"
                    >
                        <template v-slot:append-inner>
                            <UseClipboard v-slot="{ copy, copied }" :source="shareHouseLink">
                                <v-btn
                                    size="default"
                                    rounded="pill"
                                    variant="tonal"
                                    @click="copy()"
                                    :color="copied ? 'success' : ''"
                                >
                                    {{ copied ? "已複製" : "複製連結" }}
                                </v-btn>
                            </UseClipboard>
                        </template>
                    </v-text-field>
                </v-card-text>
                <v-divider class="mb-1"></v-divider>
                <v-card-text>
                    <v-slide-group show-arrows>
                        <v-slide-group-item>
                            <share-network
                                network="facebook"
                                :url="shareHouseLink"
                                v-slot="{ share }"
                            >
                                <v-btn icon class="ma-3" @click.stop="share">
                                    <v-avatar icon="fa:fa-brands fa-square-facebook"></v-avatar>
                                </v-btn>
                            </share-network>
                        </v-slide-group-item>
                        <v-slide-group-item>
                            <share-network network="line" :url="shareHouseLink" v-slot="{ share }">
                                <v-btn icon class="ma-3" @click.stop="share">
                                    <v-avatar icon="fa:fa-brands fa-line"></v-avatar>
                                </v-btn>
                            </share-network>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-card-text>
                <!-- <v-card-actions class="my-2 d-flex justify-end">
                    <v-btn
                        class="text-none"q
                        rounded="xl"
                        text="關閉"
                        @click="isActive.value = false"
                    ></v-btn>
                </v-card-actions> -->
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { computed } from "vue";
import { UseClipboard } from "@vueuse/components";

const houseDetailStore = useHouseDetailStore();
const { isShareDialogOpen, houseInfo } = storeToRefs(houseDetailStore);
const shareHouseLink = computed(() => {
    return window.location.origin + "/house/" + houseInfo.value.id;
});
</script>
<style scoped></style>
