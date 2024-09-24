<template>
  <v-container>
    <v-row>
      <!-- 統計卡片 -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>可用房源</v-card-title>
          <v-card-text>{{ availableProperties }} 間</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>已預訂房源</v-card-title>
          <v-card-text>{{ bookedProperties }} 間</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>總房源數</v-card-title>
          <v-card-text>{{ totalProperties }} 間</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 房源管理表格 -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="properties"
          item-value="name"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" @click="editItem(item)">編輯</v-btn>
            <v-btn color="error" @click="deleteItem(item)">刪除</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHouseDetailStore } from '@/stores/houseDetailStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const houseDetailStore = useHouseDetailStore()

// 統計數據
const availableProperties = ref(0)
const bookedProperties = ref(0)
const totalProperties = ref(0)

// 房源列表
const properties = ref([])

// 表格標題
const headers = [
  { text: '名稱', value: 'name' },
  { text: '狀態', value: 'status' },
  { text: '操作', value: 'actions', sortable: false }
]

// 取得房源列表並更新統計數據
onMounted(async () => {
  const propertyList = await houseDetailStore.fetchAllProperties()
  properties.value = propertyList
  availableProperties.value = propertyList.filter(p => p.status === 'available').length
  bookedProperties.value = propertyList.filter(p => p.status === 'booked').length
  totalProperties.value = propertyList.length
})

// 編輯房源
const editItem = (item) => {
  router.push({ name: 'EditProperty', params: { id: item.id } })
}

// 刪除房源
const deleteItem = async (item) => {
  try {
    await houseDetailStore.deleteProperty(item.id)
    const propertyList = await houseDetailStore.fetchAllProperties()
    properties.value = propertyList
    availableProperties.value = propertyList.filter(p => p.status === 'available').length
    bookedProperties.value = propertyList.filter(p => p.status === 'booked').length
    totalProperties.value = propertyList.length
  } catch (error) {
    console.error('刪除失敗:', error)
    alert('刪除失敗，請稍後再試')
  }
}

// 新增房源導航
const navigateToAddProperty = () => {
  router.push({ name: 'AddProperty' })
}
</script>

<style scoped>
</style>
