<template>
  <v-container>
    <!-- 統計卡片 -->
    <v-row>
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
import { ref, onMounted, computed } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagementStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const hostManagementStore = useHostManagementStore()

// 統計數據
const availableProperties = ref(0)
const bookedProperties = ref(0)
const totalProperties = ref(0)

// 房源列表 (從 store 中取得)
const properties = computed(() => hostManagementStore.state.properties);

// 表格標題
const headers = [
  { text: '名稱', value: 'name' },
  { text: '狀態', value: 'status' },
  { text: '操作', value: 'actions', sortable: false }
]

// 更新統計數據
const updateStatistics = (propertyList) => {
  availableProperties.value = propertyList.filter(p => p.status === 'available').length
  bookedProperties.value = propertyList.filter(p => p.status === 'booked').length
  totalProperties.value = propertyList.length
}

// 取得房源列表並更新統計數據
const fetchProperties = async () => {
  try {
    await hostManagementStore.fetchAllProperties();
    updateStatistics(hostManagementStore.state.properties);
  } catch (error) {
    console.error('獲取房源失敗:', error);
  }
}

// 編輯房源
const editItem = (item) => {
  router.push({ name: 'EditProperty', params: { id: item.id } });
}

// 刪除房源
const deleteItem = async (item) => {
  try {
    await hostManagementStore.deleteProperty(item.id);
    await fetchProperties();  // 刪除後重新取得資料並更新統計數據
  } catch (error) {
    console.error('刪除失敗:', error);
    alert('刪除失敗，請稍後再試');
  }
}

// 組件掛載後取得房源資料
onMounted(() => {
  fetchProperties();
});
</script>

<style scoped>
</style>
