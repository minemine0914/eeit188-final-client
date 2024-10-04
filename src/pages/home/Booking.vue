<template>
  <v-container v-if="isErrorGetHouseInfo || isLoading">
    <v-overlay :model-value="true" class="align-center justify-center">
      <v-progress-circular
        color="brown"
        size="64"
        indeterminate
      ></v-progress-circular>
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
        :border="true"
        rounded="lg"
        :items="['住房資訊', '確認價格', '進行付款', '訂房結果']"
      >
        <template v-slot:item.1>
          <v-row>
            <v-col cols="12" md="6">
              <v-card
                :border="true"
                rounded="lg"
                flat
                class="h-100"
                color="brown-lighten-5"
              >
                <v-card-item class="bg-brown-lighten-1">
                  <v-card-title>房源資訊</v-card-title>
                </v-card-item>
                <v-divider class="border-opacity-25"></v-divider>
                <v-card-item class="pb-0">
                  <v-sheet class="d-flex flex-column ga-3" color="transparent">
                    <!-- 房源名稱 -->
                    <v-sheet color="transparent">
                      <div
                        class="text-h6 font-weight-medium text-brown-darken-4"
                      >
                        {{ houseInfo.name }}
                      </div>
                    </v-sheet>
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
                              houseInfo.houseExternalResourceRecords.length > 1
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
                              houseInfo.houseExternalResourceRecords.length > 1
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
                    <!-- 房源名稱與資訊 -->
                    <v-sheet class="flex-grow-1" color="transparent">
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
                    <!-- 價錢 -->
                    <v-sheet
                      class="d-flex flex-column flex-grow-1 justify-end align-end"
                      color="transparent"
                    >
                      <v-sheet color="transparent">
                        <div
                          class="text-h6 font-weight-medium text-brown-darken-4"
                        >
                          NT ${{ houseInfo.price }} / 晚
                        </div>
                      </v-sheet>
                    </v-sheet>
                  </v-sheet>
                </v-card-item>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card
                :border="true"
                rounded="lg"
                flat
                class="h-100"
                color="brown-lighten-5"
              >
                <v-card-item class="bg-brown-lighten-1">
                  <v-card-title>入住期間</v-card-title>
                </v-card-item>
                <v-divider class="border-opacity-25"></v-divider>
                <v-card-item class="pt-0">
                  <v-sheet
                    class="d-flex flex-column ga-3 pt-5"
                    color="transparent"
                  >
                    <v-sheet class="d-flex flex-row ga-2" color="transparent">
                      <v-date-input
                        label="入住日期"
                        :model-value="inputDateRange[0]"
                        prepend-icon=""
                        variant="outlined"
                        hide-details
                        readonly
                        flat
                        @update:focused="onFocusDateRange"
                      />
                      <v-date-input
                        label="退房日期"
                        :model-value="inputDateRange[inputDateRange.length - 1]"
                        prepend-icon=""
                        variant="outlined"
                        hide-details
                        readonly
                        flat
                        @update:focused="onFocusDateRange"
                      />
                    </v-sheet>
                    <v-sheet
                      class="d-flex justify-center align-center w-100"
                      color="transparent"
                    >
                      <v-date-picker
                        bg-color="transparent"
                        class="w-100"
                        border="opacity-25 sm"
                        rounded="lg"
                        v-model="inputDateRange"
                        multiple="range"
                        show-adjacent-months
                        hide-header
                        :min="new Date().toDateString()"
                      ></v-date-picker>
                    </v-sheet>
                  </v-sheet>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <template v-slot:item.2>
          <v-row class="d-flex flex-row">
            <v-col cols="12" md="7">
              <v-card
                :border="true"
                rounded="lg"
                flat
                class="h-100"
                color="brown-lighten-5"
              >
                <v-card-item class="bg-brown-lighten-1">
                  <v-card-title>優惠券</v-card-title>
                </v-card-item>
                <v-divider class="border-opacity-25"></v-divider>
                <v-sheet min-height="300" color="transparent">
                  <v-infinite-scroll
                    max-height="480"
                    :items="couponList"
                    @load="loadCouponList"
                    class="w-100"
                  >
                    <v-item-group
                      v-model="selectedCouponIndex"
                      class="d-flex flex-column ga-3"
                    >
                      <template
                        v-for="(coupon, index) in couponList"
                        :key="index"
                      >
                        <v-item v-slot="{ isSelected, toggle }">
                          <div class="flex-grow-1">
                            <CouponCard
                              :selected="isSelected"
                              :coupon="coupon"
                              :toggle="toggle"
                              :show="true"
                            />
                          </div>
                        </v-item>
                      </template>
                    </v-item-group>
                    <!-- Scroll empty component -->
                    <template v-slot:empty>
                      <v-sheet color="transparent">
                        <v-alert variant="plain">
                          <span>{{
                            couponList.length > 0
                              ? "沒有更多優惠券了"
                              : "尚無優惠券"
                          }}</span>
                        </v-alert>
                      </v-sheet>
                    </template>
                  </v-infinite-scroll>
                </v-sheet>
              </v-card>
            </v-col>
            <v-col cols="12" md="5">
              <v-card :border="true" rounded="lg" flat color="brown-lighten-5">
                <v-card-item class="bg-brown-lighten-1">
                  <v-card-title>價格詳情</v-card-title>
                </v-card-item>
                <v-divider class="border-opacity-25"></v-divider>
                <v-card-item>
                  <v-sheet
                    class="d-flex flex-column ga-1 my-2"
                    color="transparent"
                  >
                    <v-sheet
                      class="flex-grow-1 d-flex flex-row justify-space-between align-center"
                      color="transparent"
                    >
                      <div class="text-subtitle-1">
                        NT ${{ houseInfo.price }} x {{ liveDays }} 晚
                      </div>
                      <div class="text-body-1">
                        NT ${{ houseInfo.price * liveDays }}
                      </div>
                    </v-sheet>
                    <v-sheet
                      class="flex-grow-1 d-flex flex-row justify-space-between align-center"
                      color="transparent"
                    >
                      <div class="text-subtitle-1">平台抽成(5%)</div>
                      <div class="text-body-1">NT ${{ platformIncome }}</div>
                    </v-sheet>
                    <v-sheet
                      v-if="selectedCoupon != null"
                      class="flex-grow-1 d-flex flex-row justify-space-between align-center"
                      color="transparent"
                    >
                      <div class="text-subtitle-1">優惠券</div>
                      <div class="text-body-1 text-green-darken-1">
                        折扣 - NT ${{ discountPrice }}
                      </div>
                    </v-sheet>
                  </v-sheet>
                </v-card-item>
                <v-divider class="border-opacity-25 mx-3"></v-divider>
                <v-card-actions
                  class="d-flex flex-row justify-space-between align-center px-4"
                >
                  <div class="text-h6">稅前總價</div>
                  <div class="text-h6">NT ${{ finalPrice }}</div>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
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
              <v-btn color="success" class="mb-3" to="/order">訂單詳情</v-btn>
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
              <v-btn color="orange" class="mb-3" @click="resetStep"
                >重新預定</v-btn
              >
            </v-card-item>
          </v-card>
        </template>

        <template v-slot:actions>
          <v-sheet
            class="d-flex justify-space-between align-center mx-6 mb-6"
            color="transparent"
          >
            <v-sheet>
              <v-btn
                v-if="renderStepPrevBtn"
                :loading="isLoadingStepBtn"
                color="brown-lighten-1"
                @click="checkStepPrev"
                size="large"
                >上一步</v-btn
              >
            </v-sheet>
            <v-sheet>
              <v-btn
                v-if="renderStepNextBtn"
                :loading="isLoadingStepBtn"
                color="brown-lighten-1"
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
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "@/stores/houseDetailStore";
import { useHouseSearchStore } from "@/stores/houseSearchStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import CouponCard from "@/components/home/CouponCard.vue";
import { useHouseBookingStore } from "@/stores/houseBookingStore";
import Swal from "@/plugins/sweetalert2";
// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const houseSearchStore = useHouseSearchStore();
const houseBookingStore = useHouseBookingStore();
const userStore = useUserStore();
const { houseInfo, isErrorGetHouseInfo, isLoading } =
  storeToRefs(houseDetailStore);

const inputDateRange = ref([]);
const dateRange = computed(() => {
  if (!inputDateRange.value || inputDateRange.value.length === 0) {
    return [null, null]; // 或者根據需求返回其他預設值
  }

  let start = inputDateRange.value[0];
  let end =
    inputDateRange.value.length > 1
      ? inputDateRange.value[inputDateRange.value.length - 1]
      : inputDateRange.value[0];

  return [start, end];
});

const liveDays = computed(() => {
  const [start, end] = dateRange.value;

  if (!start || !end) {
    return 0; // 如果日期範圍無效，返回0天
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  // 如果 start 和 end 是同一天，返回 1 天
  if (startDate.getTime() === endDate.getTime()) {
    return 1;
  }

  // 計算兩個日期之間的天數
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 每天的毫秒數

  return diffDays; // 返回日期範圍內的天數
});

// Step state
const bookingStep = ref(1);
const renderStepPrevBtn = ref(false);
const renderStepNextBtn = ref(true);
const isLoadingStepBtn = ref(false);
const paymentResult = ref(false);

// Coupon
const currentCouponListPage = ref(0);
const couponList = reactive([]);
const selectedCouponIndex = ref(null);

const selectedCoupon = computed(() =>
  selectedCouponIndex.value != null
    ? couponList.at(selectedCouponIndex.value)
    : null
);

const totalPrice = computed(() => {
  const price = houseInfo.value?.price || 0;
  return price * liveDays.value;
});

const platformIncome = computed(() => {
  return parseInt((totalPrice.value * 0.05).toFixed(0));
});

const priceWithCommission = computed(() => {
  return totalPrice.value + platformIncome.value;
});

const discountPrice = computed(() => {
  const coupon = selectedCoupon.value;
  if (coupon) {
    if (coupon.discount != null) {
      // 固定折扣
      return coupon.discount;
    } else if (coupon.discountRate != null) {
      // 折扣率
      return (priceWithCommission.value * coupon.discountRate).toFixed(0); // 四捨五入至整數
    }
  }
  return 0;
});

const finalPrice = computed(() => {
  return priceWithCommission.value - discountPrice.value;
});

// Funcions
async function checkStepPrev() {
  if (bookingStep.value > 1) {
    bookingStep.value--;
    renderStepPrevBtn.value = bookingStep.value > 1;
    renderStepNextBtn.value = true; // Enable next button after going back
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
      // Perform any action needed in step 3
      break;
  }
}
async function checkBookingDate() {
  isLoadingStepBtn.value = true;
  if (dateRange.value[0] == null || dateRange.value[1] == null) {
    Swal.fire({
      title: "請選擇日期",
      icon: "error",
      showConfirmButton: false,
      showDenyButton: true,
    });
    isLoadingStepBtn.value = false;
    return false;
  }
  try {
    const isAvailable = await houseBookingStore.isHouseAvailable(
      houseDetailStore.houseInfo.id,
      dateRange.value
    );
    if (isAvailable) {
      console.log("當前選擇的日期區間可用");
      renderStepPrevBtn.value = true;
      isLoadingStepBtn.value = false;
      bookingStep.value = 2;
    } else {
      console.log("當前選擇的日期區間不可用");
      isLoadingStepBtn.value = false;
      Swal.fire({
        title: "當前選擇的日期區間不可用",
        icon: "error",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "v-btn v-btn--elevated v-theme--nomadTheme bg-brown-lighten-1 v-btn--density-default v-btn--size-large v-btn--variant-elevated",
          cancelButton:
            "v-btn v-btn--elevated v-theme--nomadTheme bg-brown-lighten-1 v-btn--density-default v-btn--size-large v-btn--variant-elevated",
        },
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "重試",
      });
    }
  } catch (err) {
    console.log("當前選擇的日期區間不可用", err?.response?.data);
    isLoadingStepBtn.value = false;
    Swal.fire({
      title: "當前選擇的日期區間不可用",
      text: `原因: ${err?.response?.data}`,
      icon: "error",
      showConfirmButton: false,
      showDenyButton: true,
    });
  }
}

async function checkPayment() {
  // 建立新視窗
  const paymentWindow = window.open(
    "",
    "_blank",
    "location=yes,height=570,width=520,scrollbars=yes,status=yes"
  );
  // 更新 UI 狀態
  renderStepPrevBtn.value = false;
  renderStepNextBtn.value = false;
  bookingStep.value = 3;
  try {
    const formHtml = await houseBookingStore.processBookingPayment(
      houseDetailStore.houseInfo.id,
      userStore.user.id,
      couponList[selectedCouponIndex.value]?.id,
      dateRange.value
    );

    paymentWindow.document.open();
    paymentWindow.document.write(formHtml);
    paymentWindow.document.close();

    const timer = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(timer);
        checkDetail(true);
      }
    }, 500);

    // 移除待結帳清單
    houseDetailStore.removeBookingList();
  } catch (error) {
    console.log("訂房失敗 ", error?.response?.data);
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
            <p>原因: ${error?.response?.data}</p>
            <button onclick="window.close();">關閉視窗</button>
        </div>
    </body>
</html>
        `);
    paymentWindow.document.close();

    // 監控窗口關閉狀態
    const timer = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(timer); // 清除定時器
        checkDetail(false); // 窗口關閉後執行
      }
    }, 500); // 每0.5秒檢查一次
  }
}
async function checkDetail(result) {
  paymentResult.value = result;
  renderStepPrevBtn.value = false;
  renderStepNextBtn.value = false;
  bookingStep.value = 4; // 假設步驟 4 是顯示結果
}
function resetStep() {
  bookingStep.value = 1;
  renderStepPrevBtn.value = false;
  renderStepNextBtn.value = true;
}

async function loadCouponList({ done }) {
  console.log("Get CouponList data...");
  try {
    let data = await houseBookingStore.getCouponList(
      userStore.user.id,
      currentCouponListPage.value,
      10
    );
    if (!data.empty) {
      couponList.push(...data.content);
      currentCouponListPage.value++;
      console.log(`Read CouponList ok! Page: ${currentCouponListPage.value}`);
      done("ok");
    } else {
      console.log(
        `Read CouponList empty! Page: ${currentCouponListPage.value}`
      );
      done("empty");
    }
  } catch (err) {
    console.log(`Read CouponList error! Page: ${currentCouponListPage.value}`);
    done("error");
  }
}

function onFocusDateRange(e) {
  console.log(e);
}

watch(
  // Watch Route params houseId change
  () => route.params.houseId,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await houseDetailStore.getHouseInfo(newId);
    }
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
      houseDetailStore.addToBookingList();
      console.log(
        "[Booking.vue] 當前User BookingList: ",
        houseDetailStore.getBookingList()
      );
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
