<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>金額管理</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
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
      <!-- <v-btn color="primary" @click="openDialog">新增</v-btn> -->
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      :sort-by="[{ key: 'date', order: 'desc' }]">
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item)">
          mdi-delete
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
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.date" label="日期"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.orderQuantity" label="訂單數量" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.totalAmount" label="總金額" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="editedItem.discountAmount" label="折扣金額" readonly></v-text-field>
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
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新增訂單' : '編輯訂單';
    },
  },

  methods: {
    fetchOrders() {
      fetch('http://localhost:8080/transcation_record/all')
        .then(response => response.json())
        .then(data => {
          const combinedData = {};
          data.content.forEach(item => {
            console.log('Item createdAt:', item.createdAt); // 日誌輸出

            const date = new Date(item.createdAt);
            if (isNaN(date)) {
              console.error('Invalid date:', item.createdAt); // 如果日期無效，輸出錯誤
              return;
            }

            const formattedDate = date.toISOString().split('T')[0];
            const cashFlow = parseFloat(item.cashFlow) || 0;

            // 計算折扣金額
            let discount = 0;
            if (item.user && item.user.coupons) {
              console.log('Coupons for this item:', item.user.coupons);
              item.user.coupons.forEach(coupon => {
                console.log(`Processing coupon: ${JSON.stringify(coupon)}`);
                if (coupon.discount) {
                  discount += coupon.discount; // 添加固定折扣
                  console.log(`Added fixed discount: ${coupon.discount}`);
                }
                if (coupon.discountRate) {
                  const rateDiscount = (cashFlow * coupon.discountRate) / 100;
                  discount += rateDiscount; // 添加折扣率
                  console.log(`Added percentage discount: ${rateDiscount}`);
                }
              });
            } else {
              console.log('No coupons found for this item.');
            }

            console.log(`Total discount for this item: ${discount}`);

            if (!combinedData[formattedDate]) {
              combinedData[formattedDate] = {
                date: formattedDate,
                orderQuantity: 0,
                totalAmount: 0,
                discountAmount: 0,
              };
            }
            combinedData[formattedDate].orderQuantity += 1; // 計算每個日期的訂單數量
            combinedData[formattedDate].totalAmount += cashFlow; // 計算每個日期的總金額
            combinedData[formattedDate].discountAmount += discount; // 計算每個日期的折扣金額
          });
          this.desserts = Object.values(combinedData);
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
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
  },

  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
