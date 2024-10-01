<template>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-4">新增房源</h2>

    <!-- 基本資訊 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">基本資訊</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="房源名稱 *"
              v-model="property.name"
              :error-messages="
                !$v.property.name.required && $v.property.name.$error
                  ? ['房源名稱為必填項']
                  : []
              "
              outlined
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              :items="categories"
              label="房源類別 *"
              v-model="property.category"
              :error-messages="
                !$v.property.category.required && $v.property.category.$error
                  ? ['房源類別為必填項']
                  : []
              "
              outlined
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              label="房源描述 *"
              hint="請簡單描述房源特色與亮點"
              v-model="property.information"
              rows="3"
              :error-messages="
                !$v.property.information.required &&
                $v.property.information.$error
                  ? ['房源描述為必填項']
                  : []
              "
              outlined
              required
              persistent-hint
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 圖片上傳 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">圖片上傳</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-file-input
              label="圖片上傳 *"
              v-model="property.images"
              accept="image/*"
              multiple
              prepend-icon="mdi-image-plus"
              :error-messages="
                !$v.property.images.required && $v.property.images.$error
                  ? ['請上傳房源圖片']
                  : []
              "
              outlined
              required
              show-size
            ></v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 地址欄位 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">地址資訊</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              :items="countries"
              label="國家 *"
              v-model="property.country"
              :error-messages="
                !$v.property.country.required && $v.property.country.$error
                  ? ['國家為必填項']
                  : []
              "
              outlined
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              :items="cities"
              label="城市 *"
              v-model="property.city"
              :error-messages="
                !$v.property.city.required && $v.property.city.$error
                  ? ['城市為必填項']
                  : []
              "
              outlined
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              :items="districts"
              label="行政區 *"
              v-model="property.region"
              :error-messages="
                !$v.property.region.required && $v.property.region.$error
                  ? ['行政區為必填項']
                  : []
              "
              outlined
              required
            ></v-select>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-text-field
              label="地址 *"
              v-model="property.address"
              :error-messages="
                !$v.property.address.required && $v.property.address.$error
                  ? ['地址為必填項']
                  : []
              "
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 房間設置 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">房間設置</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              label="客廳數量"
              v-model="property.livingDiningRoom"
              type="number"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="臥室(床位)數量 *"
              v-model="property.bedroom"
              type="number"
              :error-messages="$v.property.bedroom.$error ? ['不可小於一間'] : []"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="浴室數量 *"
              v-model="property.bathroom"
              type="number"
              :error-messages="$v.property.bathroom.$error ? ['不可小於一間'] : []"
              outlined
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              label="廁所數量 *"
              v-model="property.restroom"
              type="number"
              :error-messages="$v.property.restroom.$error ? ['不可小於一間'] : []"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox label="廚房" v-model="property.kitchen"></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox label="陽台" v-model="property.balcony"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 人數設置 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">人數設置</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              label="建議成人數 *"
              v-model="property.adult"
              type="number"
              :error-messages="$v.property.adult.$error ? ['不可小於一位'] : []"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="建議幼童數"
              v-model="property.child"
              type="number"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 價格設置 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">價格設置</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              label="每晚價格/元(NTD) *"
              v-model="property.pricePerDay"
              :error-messages="
                !$v.property.pricePerDay.required &&
                $v.property.pricePerDay.$error
                  ? ['每日價格為必填項']
                  : []
              "
              type="number"
              outlined
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="每週價格/元(NTD) (選填)"
              v-model="property.pricePerWeek"
              type="number"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="每月價格/元(NTD) (選填)"
              v-model="property.pricePerMonth"
              type="number"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 額外設置 -->
    <v-card class="mb-4">
      <v-card-title class="text-h5">額外設置</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-checkbox label="允許寵物" v-model="property.pet"></v-checkbox>
          </v-col>
          <v-col cols="12" md="6">
            <v-checkbox label="允許吸煙" v-model="property.smoke"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 提交按鈕 -->
    <v-btn
      :disabled="isSubmitting"
      type="submit"
      color="primary"
      block
      class="mt-4"
      @click="submitForm"
    >
      <span v-if="isSubmitting">提交中...</span>
      <span v-else>提交</span>
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, minValue, numeric } from "@vuelidate/validators";
import Swal from "sweetalert2";
import { useHostManagementStore } from "@/stores/hostManagementStore";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

// 表單資料
const property = ref({
  name: "",
  userId: userStore.user.id,
  category: "",
  information: "",
  country: "",
  city: "",
  region: "",
  address: "",
  latitudeX: null,
  longitudeY: null,
  pricePerDay: 0,
  pricePerWeek: 0,
  pricePerMonth: 0,
  livingDiningRoom: 0,
  bedroom: 1,
  bathroom: 1,
  restroom: 1,
  adult: 1,
  child: 0,
  pet: false,
  smoke: false,
  kitchen: false,
  balcony: false,
  images: [],
});

// 下拉選單選項
const categories = [
  "公寓",
  "度假別墅",
  "包棟民宿",
  "旅店",
  "露營地",
  "酒店式公寓",
  "其他",
];
const countries = ["臺灣"];

// Vuelidate 驗證規則
const rules = {
  property: {
    name: { required },
    category: { required },
    information: { required },
    country: { required },
    city: { required },
    region: { required },
    address: { required },
    pricePerDay: { required, numeric, minValue: minValue(1) },
    pricePerWeek: { numeric, minValue: minValue(0) },
    pricePerMonth: { numeric, minValue: minValue(0) },
    bedroom: { required, numeric, minValue: minValue(1) },
    bathroom: { required, numeric, minValue: minValue(1) },
    restroom: { required, numeric, minValue: minValue(1) },
    adult: { required, numeric, minValue: minValue(1) },
    child: { numeric, minValue: minValue(0) },
    images: { required },
  },
};

const $v = useVuelidate(rules, { property });

// 狀態管理
const hostManagementStore = useHostManagementStore();
const isSubmitting = ref(false);

// 表單提交處理
const submitForm = async () => {
  $v.value.$touch(); // 驗證表單
  if ($v.value.$invalid) {
    Swal.fire({
      icon: "error",
      title: "表單有誤",
      text: "請檢查填寫內容",
    });
    return;
  }

  isSubmitting.value = true; // 提交狀態

  try {
    // 發送表單資料
    await hostManagementStore.addProperty(property.value);

    Swal.fire({
      icon: "success",
      title: "成功提交！",
      text: "房源已成功提交。",
    });

    router.push("/lo"); // 重定向
  } catch (error) {
    console.error("提交失敗", error);
    Swal.fire({
      icon: "error",
      title: "提交失敗",
      text: "提交過程中發生錯誤，請稍後再試。",
    });
  } finally {
    isSubmitting.value = false; // 重置提交狀態
  }
};
</script>

<style scoped></style>
