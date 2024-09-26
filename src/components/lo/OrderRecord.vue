<template>
  <v-container>
    <!-- 排序和篩選 -->
    <v-row>
      <v-col cols="12" sm="4">
        <v-select v-model="sortBy" :items="['最高金額', '最低金額']" label="排序方式" dense outlined @change="sortOrders"></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select v-model="filterByStayStatus" :items="['全部', '已入住', '未入住']" label="入住狀態" dense outlined @change="filterOrders"></v-select>
      </v-col>
    </v-row>

    <!-- 訂單列表 -->
    <v-row>
      <v-col v-for="order in paginatedOrders" :key="order.id" cols="12">
        <v-card>
          <v-card-title>{{ order.name }}</v-card-title>
          <v-card-subtitle>
            入住日期: {{ order.stayDate }} | 金額: {{ order.amount }} | 入住狀態: {{ order.stayStatus }}
          </v-card-subtitle>
          <v-card-actions>
            <v-btn color="primary" @click="viewDetails(order.id)">查看詳情</v-btn>
            <v-btn color="error" @click="deleteOrder(order.id)">刪除</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 分頁導航 -->
    <v-row justify="center">
      <v-pagination v-model="page" :length="totalPages"></v-pagination>
    </v-row>

    <!-- 查看詳情的彈出視窗 -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-text>
          <OrderDetail :id="selectedOrderId" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeDialog">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagementStore'
import OrderDetail from './OrderDetail.vue'

const hostManagementStore = useHostManagementStore()

const orders = ref([])
const sortBy = ref('最高金額')
const filterByStayStatus = ref('全部')
const page = ref(1)
const itemsPerPage = ref(5)
const showDialog = ref(false)
const selectedOrderId = ref(null)

const sortOrders = () => {
  // 排序邏輯處理
}

const filterOrders = () => {
  // 篩選邏輯處理
}

const viewDetails = (id) => {
  selectedOrderId.value = id
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const deleteOrder = async (id) => {
  try {
    await hostManagementStore.deleteOrder(id) // 調用後端 API 刪除訂單
    orders.value = orders.value.filter(order => order.id !== id) // 從本地移除已刪除的訂單
  } catch (error) {
    console.error('刪除失敗:', error)
  }
}

// 計算排序與篩選後的訂單
const sortedAndFilteredOrders = computed(() => {
  let filtered = filterByStayStatus.value === '全部'
    ? orders.value
    : orders.value.filter(o => o.stayStatus === filterByStayStatus.value)

  return filtered.sort((a, b) => {
    return sortBy.value === '最高金額'
      ? b.amount - a.amount
      : a.amount - b.amount
  })
})

// 計算分頁的訂單列表
const paginatedOrders = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = page.value * itemsPerPage.value
  return sortedAndFilteredOrders.value.slice(start, end)
})

// 計算總頁數
const totalPages = computed(() => {
  return Math.ceil(sortedAndFilteredOrders.value.length / itemsPerPage.value)
})

// 在組件掛載時獲取訂單列表
onMounted(async () => {
  try {
    const data = await hostManagementStore.fetchOrders() // 從後端 API 獲取訂單列表
    orders.value = data
  } catch (error) {
    console.error('獲取訂單失敗:', error)
  }
})
</script>
