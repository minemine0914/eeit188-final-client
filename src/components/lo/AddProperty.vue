<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      
      <!-- 基本資訊 -->
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            label="房源名稱 *"
            v-model="property.name"
            :error-messages="!$v.property.name.required && $v.property.name.$error ? ['房源名稱為必填項'] : []"
            required
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            :items="categories"
            label="房源類別 *"
            v-model="property.category"
            :error-messages="!$v.property.category.required && $v.property.category.$error ? ['房源類別為必填項'] : []"
            required
            outlined
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
            :error-messages="!$v.property.information.required && $v.property.information.$error ? ['房源描述為必填項'] : []"
            required
            outlined
            persistent-hint
          ></v-textarea>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <!-- 圖片上傳 -->
      <v-row>
        <v-col cols="12">
          <v-file-input
            label="圖片上傳"
            v-model="property.images"
            :error-messages="!$v.property.images.required && $v.property.images.$error ? ['請上傳房源圖片'] : []"
            required
            multiple
            show-size
            accept="image/*"
            outlined
          ></v-file-input>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <!-- 地址欄位 -->
      <v-row>
        <v-col cols="12" md="4">
          <v-select
            :items="countries"
            label="國家 *"
            v-model="property.country"
            :error-messages="!$v.property.country.required && $v.property.country.$error ? ['國家為必填項'] : []"
            required
            outlined
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            :items="cities"
            label="城市 *"
            v-model="property.city"
            :error-messages="!$v.property.city.required && $v.property.city.$error ? ['城市為必填項'] : []"
            required
            outlined
          ></v-select>
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            :items="districts"
            label="行政區 *"
            v-model="property.region"
            :error-messages="!$v.property.region.required && $v.property.region.$error ? ['行政區為必填項'] : []"
            required
            outlined
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            label="地址 *"
            v-model="property.address"
            :error-messages="!$v.property.address.required && $v.property.address.$error ? ['地址為必填項'] : []"
            required
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- 房間設置 -->
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="客廳數量 (選填)"
            v-model="property.livingDiningRoom"
            type="number"
            :error-messages="$v.property.livingDiningRoom.$error ? ['數值必須大於或等於 0'] : []"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="臥室數量 *"
            v-model="property.bedroom"
            type="number"
            :error-messages="$v.property.bedroom.$error ? ['不可小於一間'] : []"
            outlined
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="浴室數量 *"
            v-model="property.bathroom"
            type="number"
            :error-messages="$v.property.bathroom.$error ? ['不可小於一間'] : []"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-checkbox label="廚房" v-model="property.kitchen"></v-checkbox>
        </v-col>

        <v-col cols="12" md="6">
          <v-checkbox label="陽台" v-model="property.balcony"></v-checkbox>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <!-- 價格設置 -->
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="每晚價格/元(NTD) *"
            v-model="property.pricePerDay"
            type="number"
            :error-messages="!$v.property.pricePerDay.required && $v.property.pricePerDay.$error ? ['每日價格為必填項'] : []"
            required
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="每週價格/元(NTD) (選填)"
            v-model="property.pricePerWeek"
            type="number"
            :error-messages="$v.property.pricePerWeek.minValue && $v.property.pricePerWeek.$error ? ['每週價格不能為負'] : []"
            outlined
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="每月價格/元(NTD) (選填)"
            v-model="property.pricePerMonth"
            type="number"
            :error-messages="$v.property.pricePerMonth.minValue && $v.property.pricePerMonth.$error ? ['每月價格不能為負'] : []"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>

      <!-- 額外設置 -->
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" md="6">
          <v-checkbox label="允許寵物" v-model="property.pet"></v-checkbox>
        </v-col>

        <v-col cols="12" md="6">
          <v-checkbox label="允許吸煙" v-model="property.smoke"></v-checkbox>
        </v-col>
      </v-row>

      <!-- 提交按鈕 -->
      <v-btn type="submit" color="primary" block class="mt-4">提交</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import { useHostManagementStore } from '@/stores/hostManagementStore'

// 定義表單資料
const property = ref({
  name: '',
  category: '',
  information: '',
  country: '',
  city: '',
  region: '',
  address: '',
  latitudeX: null,
  longitudeY: null,
  pricePerDay: 0,
  pricePerWeek: 0,
  pricePerMonth: 0,
  livingDiningRoom: 0,
  bedroom: 1,
  bathroom: 1,
  pet: false,
  smoke: false,
  kitchen: false,
  balcony: false,
  images: [], 
})

// 定義下拉選單的選項
const categories = ['公寓', '度假別墅', '包棟民宿','旅店','露營地','酒店式公寓','其他']
const countries = ['臺灣']
const cities = ['台北', '東京', '紐約']
const districts = ['大安區', '澀谷區', '曼哈頓區']

// 定義驗證規則
const rules = {
  property: {
    name: { required },
    category: { required },
    information: { required },
    country: { required },
    city: { required },
    region: { required },
    address: { required },
    pricePerDay: { required, minValue: minValue(1) },
    pricePerWeek: { minValue: minValue(0) }, 
    pricePerMonth: { minValue: minValue(0) }, 
    livingDiningRoom: { minValue: minValue(0) },
    bedroom: { minValue: minValue(1) },
    bathroom: { minValue: minValue(1) },
    images: { required }
  },
}

// 使用 Vuelidate
const $v = useVuelidate(rules, { property })

const hostManagementStore = useHostManagementStore()

// 表單提交處理
const submitForm = async () => {
  $v.value.$touch() // 啟動驗證

  if ($v.value.$invalid) {
    alert('表單有誤，請檢查填寫內容')
    return
  }

  try {
    // 假設經緯度生成完成
    property.value.latitudeX = 25.0330
    property.value.longitudeY = 121.5654

    // 發送表單資料到後端
    await hostManagementStore.addProperty(property.value)

    // 圖片上傳處理
    if (property.value.images.length > 0) {
      const propertyId = hostManagementStore.properties[hostManagementStore.properties.length - 1].id
      for (let image of property.value.images) {
        await hostManagementStore.uploadPropertyImage(propertyId, image)
      }
    }

    alert('房源已成功提交！')
  } catch (error) {
    console.error('提交失敗', error)
    alert(error.message || '提交失敗，請稍後再試')
  }
}
</script>

<style scoped>
</style>
