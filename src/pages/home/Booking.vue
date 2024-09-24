<template>
    <v-container v-if="isErrorGetHouseInfo || isLoading">
        <v-overlay :model-value="true" class="align-center justify-center">
            <v-progress-circular color="brown" size="64" indeterminate></v-progress-circular>
        </v-overlay>
    </v-container>
    <v-container v-else>
        <v-sheet class="d-flex flex-row align-center">
            <v-btn
                class="mr-2"
                flat
                rounded="pill"
                icon="mdi-chevron-left"
                @click="$router.back"
            ></v-btn>
            <div class="text-h5">預訂房源 {{ houseInfo.name }}</div>
        </v-sheet>
        <v-sheet>
            <v-stepper
                v-model="bookingStep"
                alt-labels
                flat
                color="brown"
                :items="['確認資訊', '付款方式', '進行付款', '訂房結果']"
            >
                <template v-slot:item.1>
                    <v-card title="房源資訊" flat>
                        <v-sheet
                            class="d-flex align-center justify-center border mb-5 elevation-0"
                            color="brown-lighten-5"
                            rounded="xl"
                        >
                            <v-row class="fill-height" no-gutters>
                                <v-col class="pa-5" cols="12" sm="5" md="4" lg="3" xl="3">
                                    <!-- 圖片 -->
                                    <v-sheet
                                        color="transparent"
                                        rounded="lg"
                                        class="overflow-hidden"
                                    >
                                        <v-carousel
                                            height="200"
                                            show-arrows="hover"
                                            hide-delimiter-background
                                            hide-delimiters
                                        >
                                            <template v-slot:prev="{ props }">
                                                <v-btn
                                                    v-if="
                                                        houseInfo.houseExternalResourceRecords
                                                            .length > 1
                                                    "
                                                    :class="props.class"
                                                    color="rgba(255,255,255,0.5)"
                                                    size="small"
                                                    density="compact"
                                                    icon="mdi-chevron-left"
                                                    variant="elevated"
                                                    @click="props.onClick"
                                                ></v-btn>
                                            </template>
                                            <template v-slot:next="{ props }">
                                                <v-btn
                                                    v-if="
                                                        houseInfo.houseExternalResourceRecords
                                                            .length > 1
                                                    "
                                                    :class="props.class"
                                                    color="rgba(255,255,255,0.5)"
                                                    size="small"
                                                    density="compact"
                                                    icon="mdi-chevron-right"
                                                    variant="elevated"
                                                    @click="props.onClick"
                                                ></v-btn>
                                            </template>
                                            <v-carousel-item
                                                v-for="imageSrc in houseSearchStore.getHouseImageUrlList(
                                                    houseInfo.houseExternalResourceRecords
                                                )"
                                            >
                                                <v-img
                                                    :aspect-ratio="1"
                                                    :height="200"
                                                    :src="imageSrc"
                                                    cover
                                                ></v-img>
                                            </v-carousel-item>
                                        </v-carousel>
                                    </v-sheet>
                                </v-col>
                                <v-col
                                    class="d-flex justify-start align-start pa-5"
                                    cols="12"
                                    sm="7"
                                    md="8"
                                    lg="9"
                                    xl="9"
                                >
                                    <div class="d-flex flex-row mb-6 w-100 h-100">
                                        <!-- 房源名稱與資訊 -->
                                        <v-sheet class="flex-grow-1" color="transparent">
                                            <div
                                                class="text-h5 font-weight-medium text-brown-darken-4 pt-1 mb-1"
                                            >
                                                {{ houseInfo.name }}
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mdi mdi-map-marker mr-2"></span>
                                                <span class="mr-2">{{
                                                    `位於 ${houseInfo.city} ${houseInfo.region}`
                                                }}</span>
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mdi mdi-sofa mr-2"></span>
                                                <span
                                                    class="mr-1"
                                                    v-if="houseInfo.livingDiningRoom > 0"
                                                >
                                                    {{ `${houseInfo.livingDiningRoom} 廳` }}
                                                </span>
                                                <span class="mr-1" v-if="houseInfo.bedroom > 0">
                                                    {{ `${houseInfo.bedroom} 房` }}
                                                </span>
                                                <span class="mr-1" v-if="houseInfo.bathroom > 0">
                                                    {{ `${houseInfo.bathroom} 淋浴` }}
                                                </span>
                                                <span class="mr-1" v-if="houseInfo.restroom > 0">
                                                    {{ `${houseInfo.restroom} 衛生` }}
                                                </span>
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mdi mdi-bed mr-2"></span>
                                                <span>可住 </span>
                                                <span class="mr-1" v-if="houseInfo.adult > 0">
                                                    {{ `${houseInfo.adult} 位成人 ` }}
                                                </span>
                                                <span class="mr-1" v-if="houseInfo.child > 0">
                                                    {{ `${houseInfo.child} 位孩童 ` }}
                                                </span>
                                            </div>
                                            <div class="text-grey-darken-1">
                                                <span class="mr-2" v-if="!houseInfo.pet">
                                                    <span class="mdi mdi-paw-off mr-2"></span>
                                                    <span>禁止寵物</span>
                                                </span>

                                                <span class="mr-2" v-if="!houseInfo.smoke">
                                                    <span class="mdi mdi-smoking-off mr-2"></span>
                                                    <span>禁止吸菸</span>
                                                </span>
                                            </div>
                                        </v-sheet>
                                        <!-- 價錢與詳細按鈕 -->
                                        <v-sheet
                                            class="d-flex flex-column flex-grow-1 justify-end align-end"
                                            color="transparent"
                                        >
                                            <v-sheet color="transparent">
                                                <div
                                                    class="text-h5 font-weight-medium text-brown-darken-4 mb-2 mr-1"
                                                >
                                                    NT ${{ houseInfo.price }}
                                                </div>
                                            </v-sheet>
                                            <!-- <v-sheet color="transparent">
                                                <v-btn
                                                    color="brown-lighten-1"
                                                    min-width="130"
                                                    size="large"
                                                    :to="`/house/${item.id}`"
                                                    >詳細資訊</v-btn
                                                >
                                            </v-sheet> -->
                                        </v-sheet>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </v-card>
                    <v-card title="入住期間" flat>
                        <v-row>
                            <v-col cols="12" md="5">
                                <v-date-input
                                    multiple="range"
                                    variant="outlined"
                                    label="入住期間"
                                ></v-date-input>
                            </v-col>
                        </v-row>
                    </v-card>
                </template>

                <template v-slot:item.2>
                    <v-card title="付款方式" flat>...</v-card>
                    <v-card title="優惠券" flat>...</v-card>
                </template>

                <template v-slot:item.3>
                    <v-card title="優惠券" flat>
                        <v-card-item class="text-center">
                            <v-progress-circular
                                class="mb-3"
                                color="primary"
                                indeterminate
                                :size="128"
                                :width="8"
                                >付款中</v-progress-circular
                            >
                            <h2 class="text-h5 mb-1">付款中 請稍候...</h2>
                            <p class="mb-4 text-medium-emphasis text-body-1">
                                交由綠界第三方支付付款
                            </p>
                            <p class="mb-4 text-medium-emphasis text-body-1">
                                付款成功後請關閉支付頁面，並完成付款流程
                            </p>
                        </v-card-item>
                    </v-card>
                </template>

                <template v-slot:item.4>
                    <v-card v-if="paymentResult" title="完成訂房" flat>
                        <v-card-item class="text-center">
                            <v-icon
                                class="mb-5"
                                color="success"
                                icon="mdi-check-circle"
                                size="112"
                            ></v-icon>

                            <h2 class="text-h5 mb-4">恭喜! 您的預定已完成</h2>

                            <p class="mb-4 text-medium-emphasis text-body-2">
                                查看您的預定，了解預定資訊
                            </p>
                            <v-btn color="success" class="mb-3">訂單詳情</v-btn>
                        </v-card-item>
                    </v-card>
                    <v-card v-else title="訂房失敗" flat>
                        <v-card-item class="text-center">
                            <v-icon
                                class="mb-5"
                                color="red"
                                icon="mdi-close-circle"
                                size="112"
                            ></v-icon>
                            <h2 class="text-h5 mb-4">付款失敗，請重新預定</h2>
                            <v-btn color="orange" class="mb-3" @click="resetStep">重新預定</v-btn>
                        </v-card-item>
                    </v-card>
                </template>

                <template v-slot:actions>
                    <v-sheet class="d-flex px-6 py-3">
                        <v-sheet class="flex-grow-1 d-flex justify-start">
                            <v-btn
                                v-if="renderStepPrevBtn"
                                :loading="isLoadingStepBtn"
                                color="brown"
                                @click="checkStepPrev"
                                size="large"
                                >上一步</v-btn
                            >
                        </v-sheet>
                        <v-sheet class="flex-grow-1 d-flex justify-end">
                            <v-btn
                                v-if="renderStepNextBtn"
                                :loading="isLoadingStepBtn"
                                color="brown"
                                @click="checkStepNext"
                                size="large"
                                >下一步</v-btn
                            >
                        </v-sheet>
                    </v-sheet>
                </template>
            </v-stepper>
        </v-sheet>
    </v-container>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "@/stores/houseDetailStore";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import ImageGrid from "@/components/home/ImageGrid.vue";
import api from "@/plugins/axios.js";
// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const houseSearchStore = useHouseSearchStore();
const userStore = useUserStore();
const { houseInfo, isErrorGetHouseInfo, isLoading, isLoadingCollection, isCollected } =
    storeToRefs(houseDetailStore);
//
const bookingStep = ref(1);
const renderStepPrevBtn = ref(false);
const renderStepNextBtn = ref(true);
const isLoadingStepBtn = ref(false);
const paymentResult = ref(false);

// Funcions

async function checkStepPrev() {
    switch (bookingStep.value) {
        case 1:
            break;
        case 2:
            renderStepPrevBtn.value = false;
            bookingStep.value--;
            break;
        case 3:
            renderStepPrevBtn.value = true;
            bookingStep.value--;
            break;
        default:
            break;
    }
}
async function checkStepNext() {
    switch (bookingStep.value) {
        case 1:
            await checkBookingDate();
            break;
        case 2:
            await checkPayment();
            break;
        case 3:
            break;
        default:
            break;
    }
}

async function checkBookingDate() {
    isLoadingStepBtn.value = true;
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            renderStepPrevBtn.value = true;
            isLoadingStepBtn.value = false;
            bookingStep.value = 2;
            resolve("anything");
        }, 1000);
    });
}

async function checkPayment() {
    // 創建新視窗
    const paymentWindow = window.open(
        "",
        "_blank",
        "location=yes,height=570,width=520,scrollbars=yes,status=yes"
    );
    renderStepPrevBtn.value = false;
    renderStepNextBtn.value = false;
    bookingStep.value = 3;
    await api
        .post("/payment/booking-house", {
            houseId: houseInfo.value.id,
            userId: userStore.user.id,
        })
        .then((response) => {
            const formHtml = response.data;
            // 將返回的表單寫入新視窗並提交
            paymentWindow.document.open();
            paymentWindow.document.write(formHtml);
            paymentWindow.document.close();
            // 監聽新視窗關閉狀態
            const timer = setInterval(() => {
                if (paymentWindow.closed) {
                    clearInterval(timer); // 清除定時器
                    checkDetail(true); // 視窗關閉後執行
                }
            }, 500); // 每0.5秒檢查一次
        })
        .catch((error) => {
            console.error("Error creating order:", error);
            // 將返回的表單寫入新視窗並提交
            paymentWindow.document.open();
            paymentWindow.document.write(`
<html>
    <head>
        <meta charset="UTF-8">
        <title>NOMAD支付</title>
    </head>
    <body>
        <div style="text-align: center; width: 100%;">
            <p>交易失敗，請關閉視窗重新預定房源!</p>
            <button onclick="window.close();">關閉視窗</button>
        </div>
    </body>
</html>
                        `);
            paymentWindow.document.close();
            // 監聽新視窗關閉狀態
            const timer = setInterval(() => {
                if (paymentWindow.closed) {
                    clearInterval(timer); // 清除定時器
                    checkDetail(false); // 視窗關閉後執行
                }
            }, 500); // 每0.5秒檢查一次
        });
}

async function checkDetail(result) {
    result ? (paymentResult.value = true) : (paymentResult.value = false);
    renderStepPrevBtn.value = false;
    renderStepNextBtn.value = false;
    bookingStep.value = 4;
}

function resetStep() {
    bookingStep.value = 1;
    renderStepPrevBtn.value = false;
    renderStepNextBtn.value = true;
}

watch(
    // Watch Route params houseId change
    () => route.params.houseId,
    (newId, oldId) => {
        console.log(newId, oldId);
        houseDetailStore.getHouseInfo(newId);
    }
);
onMounted(async () => {
    if (route.params.houseId) {
        // If Route params houseId found
        console.log("Found houseId in url param: " + route.params.houseId);
        await houseDetailStore.getHouseInfo(route.params.houseId);
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        } else {
            // Record booking list
            houseDetailStore.addToBookingList();
            
        }
    } else {
        // If Route params houseId not found
        console.log("HouseId not found in url param! Take you to home page!");
        isErrorGetHouseInfo.value = true;
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    }
});
</script>
<style scoped></style>
