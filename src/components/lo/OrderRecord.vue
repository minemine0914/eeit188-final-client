<template>
  <v-container>
    <!-- 排序和篩選 -->
    <v-row>
      <v-col cols="12" sm="4">
        <v-select v-model="sortBy" :items="['最高金額', '最低金額']" label="排序方式" dense outlined
          @change="sortOrders"></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <v-select v-model="filterByStayStatus" :items="['全部', '已入住', '未入住']" label="入住狀態" dense outlined
          @change="filterOrders"></v-select>
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
        <v-card-title>訂單詳情</v-card-title>
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

<script>
import OrderDetail from './OrderDetail.vue';

export default {
  data() {
    return {
      orders: [
        { id: 1, name: '歷史訂單 1', stayDate: '2024-09-11', stayStatus: '已入住', amount: 1500 },
        { id: 2, name: '歷史訂單 2', stayDate: '2024-09-12', stayStatus: '未入住', amount: 2000 },
      ],
      sortBy: '最高金額',
      filterByStayStatus: '全部',
      page: 1,
      itemsPerPage: 5,
      showDialog: false,
      selectedOrderId: null,
    };
  },
  computed: {
    sortedAndFilteredOrders() {
      let filtered = this.filterByStayStatus === '全部'
        ? this.orders
        : this.orders.filter(o => o.stayStatus === this.filterByStayStatus);

      return filtered.sort((a, b) => {
        return this.sortBy === '最高金額'
          ? b.amount - a.amount
          : a.amount - b.amount;
      });
    },
    paginatedOrders() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = this.page * this.itemsPerPage;
      return this.sortedAndFilteredOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedAndFilteredOrders.length / this.itemsPerPage);
    },
  },
  methods: {
    sortOrders() {
      // 排序邏輯已經處理
    },
    filterOrders() {
      // 篩選邏輯已經處理
    },
    viewDetails(id) {
      this.selectedOrderId = id;
      this.showDialog = true;
    },
    closeDialog() {
      this.showDialog = false;
    },

    deleteOrder(id) {
      // 刪除訂單邏輯
      console.log('刪除訂單:', id);
    },
  },
  components: {
    OrderDetail,
  },
};
</script>
