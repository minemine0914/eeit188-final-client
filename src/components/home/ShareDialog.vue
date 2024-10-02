<template>
    <v-dialog v-model="isShareDialogOpen" width="auto" :scrim="false" max-width="600">
        <template v-slot:default="{ isActive }">
            <v-card rounded="lg" min-width="500">
                <v-card-title class="d-flex justify-space-between align-center">
                    <div class="d-flex flex-row align-top">
                        <v-icon icon="mdi-share-variant" color="light-green-darken-3"></v-icon>
                        <div class="text-h6 text-medium-emphasis pl-2">分享房源</div>
                    </div>
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
                                    @click="actionShare(copy)"
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
                        <v-slide-group-item v-for="network in networks">
                            <share-network
                                :network="network.network"
                                :key="network.network"
                                :title="sharingInfo.title"
                                :url="sharingInfo.url"
                                :description="sharingInfo.description"
                                :quote="sharingInfo.quote"
                                :hashtags="sharingInfo.hashtags"
                                :twitterUser="sharingInfo.twitterUser"
                                :media="sharingInfo.media"
                                v-slot="{ share }"
                            >
                                <v-btn icon class="ma-3" @click.stop="actionShare(share)">
                                    <v-avatar :icon="network.icon"></v-avatar>
                                </v-btn>
                            </share-network>
                        </v-slide-group-item>
                    </v-slide-group>
                </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { computed, ref } from "vue";
import { UseClipboard } from "@vueuse/components";

const houseDetailStore = useHouseDetailStore();
const { isShareDialogOpen, houseInfo } = storeToRefs(houseDetailStore);
const shareHouseLink = computed(() => {
    return window.location.origin + "/house/" + houseInfo.value.id;
});
const networks = ref([
    { network: "facebook", icon: "fa:fa-brands fa-square-facebook" },
    { network: "line", icon: "fa:fa-brands fa-line" },
    { network: "x", icon: "fa:fab fah fa-lg fa-twitter" },
    { network: "whatsapp", icon: "fa:fab fah fa-lg fa-whatsapp" },
    { network: "skype", icon: "fa:fab fah fa-lg fa-skype" },
    { network: "telegram", icon: "fa:fab fah fa-lg fa-telegram-plane" },
    { network: "sms", icon: "fa:far fah fa-lg fa-comment-dots" },
    { network: "email", icon: "fa:fa fa-envelope" },
]);
const sharingInfo = ref({
    title: "Nomad: " + houseInfo.value.name,
    url: shareHouseLink.value,
    description: "我找到了優質的房源 " + houseInfo.value.name,
    quote: "Nomad House",
    hashtags: "nomad",
    twitterUser: "NOMAD",
});
function actionShare(func) {
    console.log("[typeof] ", typeof func);
    if ( typeof func === 'function' ) {
        func();
    }
    houseDetailStore.recordHouseMongoShare();
}
</script>
<style scoped></style>
