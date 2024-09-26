<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>金額管理</v-toolbar-title>
      <v-text-field
        v-model="search"
        density="compact"
        label="查詢"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        :style="{ width: '200px' }"
      ></v-text-field>
    </v-toolbar>
    <v-toolbar>
      <v-select
        v-model="selectedYear"
        :items="years"
        label="選擇年份"
        @change="filterByYear"
        :style="{ width: '200px' }"
      ></v-select>
      <v-select
        v-model="selectedMonth"
        :items="months"
        label="選擇月份"
        @change="filterByMonth"
        :style="{ width: '200px' }"
      ></v-select>
      <v-btn color="primary" @click="clearFilters">查詢全部訂單</v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="filteredDesserts"
      :search="search"
      :sort-by="[{ key: 'date', order: 'desc' }]">
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" @click="editItem(item)">
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.date" label="日期"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.orderQuantity" label="訂單數量" readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.totalAmount" label="總金額" readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.discountAmount" label="折扣金額" readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.AP" label="應付帳款" readonly></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.R" label="收益" readonly></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">取消</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">儲存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
const currentYear = new Date().getFullYear(); // 獲取當前年份
const currentMonth = new Date().getMonth() + 1; // 獲取當前月份 
export default {
  data() {
    return {
      search: '',
      dialog: false,
      headers: [
        { title: '日期', value: 'date' },
        { title: '訂單數量', value: 'orderQuantity' },
        { title: '總金額', value: 'totalAmount' },
        { title: '折扣金額', value: 'discountAmount' },
        { title: '應付帳款', value: 'AP' },
        { title: '收益', value: 'R' },
        { text: '操作', value: 'actions', sortable: false },
      ],
      desserts: [],
      editedItem: {
        date: '',
        orderQuantity: 0,
        totalAmount: 0,
        discountAmount: 0,
      },
      editedIndex: -1,
      months: Array.from({ length: 12 }, (v, k) => k + 1), 
      years: Array.from({ length: 10 }, (v, k) => new Date().getFullYear() -5 + k),//區間為getFullYear-5  ~  getFullYear+5
      selectedMonth: currentMonth, // 預設為當前月份
      selectedYear: currentYear,// 預設為當前年份
    };
  },

  computed: {
    filteredDesserts() {
      return this.desserts.filter(item => {
        const itemDate = new Date(item.date);
        const yearMatch = this.selectedYear ? (itemDate.getFullYear() === this.selectedYear) : true;
        const monthMatch = this.selectedMonth ? (itemDate.getMonth() + 1 === this.selectedMonth) : true;
        return yearMatch && monthMatch;
      });
    },
    formTitle() {
      return this.editedIndex === -1 ? '新增訂單' : '編輯訂單';
    },
  },

  methods: {
    async fetchOrders() {
      try {
        const response = await fetch('http://localhost:8080/transcation_record/all');
        const data = await response.json();
        const combinedData = {};
        data.content.forEach(item => {
          const date = new Date(item.createdAt);
          if (isNaN(date)) {
            console.error('Invalid date:', item.createdAt);
            return;
          }

          const formattedDate = date.toISOString().split('T')[0];
          const cashFlow = parseFloat(item.cashFlow) || 0;

          let discount = 0;
          if (item.user && item.user.coupons) {
            item.user.coupons.forEach(coupon => {
              if (coupon.discount) {
                discount += coupon.discount;
              }
              if (coupon.discountRate) {
                discount += (cashFlow * coupon.discountRate) / 100;
              }
            });
          }

          if (!combinedData[formattedDate]) {
            combinedData[formattedDate] = {
              date: formattedDate,
              orderQuantity: 0,
              totalAmount: 0,
              discountAmount: 0,
              AP: 0,
              R: 0
            };
          }
          combinedData[formattedDate].orderQuantity += 1;
          combinedData[formattedDate].totalAmount += (cashFlow * 1.1);
          combinedData[formattedDate].discountAmount += discount;
          combinedData[formattedDate].AP += cashFlow;
          combinedData[formattedDate].R += ((cashFlow * 0.1) - discount); 
        });
        this.desserts = Object.values(combinedData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },

    openDialog() {
      this.editedIndex = -1;
      this.editedItem = {
        date: '',
        orderQuantity: 0,
        totalAmount: 0,
        discountAmount: 0,
      };
      this.dialog = true;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push({ ...this.editedItem });
      }
      this.close();
    },

    filterByMonth() {
      this.filteredDesserts;
    },

    filterByYear() {
      this.filteredDesserts;
    },
  
    clearFilters() {
      this.selectedYear = new Date().getFullYear(); // 重置為當前年份
      this.selectedMonth = new Date().getMonth() + 1; // 重置為當前月份
    },
  },  
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
</style>
