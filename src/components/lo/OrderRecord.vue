<!--訂單管理系統-->
  
<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="orders"
    :sort-by="[{ key: 'createdAt', order: 'asc' }]">
    <template v-slot:item.deal="{ item }">
        <!--狀態欄位-->
        <v-chip
          
          :color="getStatusColor(item.deal)"
          size="small"
          class="text-uppercase"
        >
          {{ getStatusText(item.deal) }}
        </v-chip>
       </template>
    <template v-slot:top>

      
      <v-toolbar flat>
        <v-toolbar-title>訂單管理</v-toolbar-title>
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

        <!-- 編輯訂單對話框 -->
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" v-if="editedIndex !== -1">
                    <v-text-field
                      v-model="editedOrder.id"
                      label="訂單編號"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6" >
                    <v-text-field
                      v-model="editedOrder.house.name"
                      label="房屋名稱"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                    v-model="editedOrder.ticket.people" 
                      label="人數"
                      type="number"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.user.name"
                      label="房客名稱"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.user.phone"
                      label="連絡電話"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.user.email"
                      label="信箱"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.cashFlow"
                      label="金額"
                      type="number"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.startedAt" 
                      label="入住時間"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.endedAt"
                      label="退房時間"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.createdAt"
                      label="下單時間"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                    v-model="editedOrder.deal"
                    label="訂單狀態"
                    readonly
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                取消
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                儲存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 刪除確認對話框 -->
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">確定要刪除?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">取消</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteOrderConfirm">刪除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="DDeal" max-width="290">
          <v-card>
            <v-card-title class="headline">選擇狀態</v-card-title>
            <v-card-text>
              <v-radio-group v-model="selectedStatus">
                <v-radio :label="orderStatuses.CANCELLED" :value="orderStatuses.CANCELLED"></v-radio>
                <v-radio :label="orderStatuses.PAID" :value="orderStatuses.PAID"></v-radio>
                <v-radio :label="orderStatuses.UNPAID" :value="orderStatuses.UNPAID"></v-radio>
              </v-radio-group>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="updateStatusDeal" color="primary">確認</v-btn>
              <v-btn @click="resetDeal" color="grey">取消</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
       
      </v-toolbar>

      
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="openDeal(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="me-2" size="small" @click="openOrder(item)">
        mdi-eye
      </v-icon>
      <!-- <v-icon size="small" @click="deleteOrder(item)">
        mdi-delete
      </v-icon> -->
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';

   
export default {
  data() {
    return {
      userId: '', 
      search: '',
      orders: [],
      dialog: false,
      dialogDelete: false,
      dialogHostInfo: false,
      dialogGuestInfo: false,
      dialogPropertyId: false,
      selectedStatus: null,
      DDeal: false,
      headers: [
        { title: '訂單編號', align: 'start', sortable: false, key: 'id' },
        { title: '房屋名稱', key: 'house.name' },
        { title: '房客資訊', key: 'user.name' },
        { title: '金額', key: 'cashFlow' },
        // { title: '房東資訊', key: 'house.userName' },
        // { title: '付款方式', key: '' },
        { title: '下單時間', key: 'createdAt' },
        { title: '訂單狀態', key: 'deal' },
        { title: '編輯', key: 'actions', sortable: false },
      ],
      editedIndex: -1,
      editedOrder: {
        id: '',
        house: {
          name: '',
          userName: ''
        },
        user: {
          name: ''
        },
        cashFlow: '',
        createdAt: '',
        deal: '',
        ticket: { 
          people: '',
          startedAt: '',
          endedAt: ''
        }
        
      },
      defaultOrder: {
        id: '',
        house: {
          name: '',
          userName: ''
        },
        user: {
          name: ''
        },
        cashFlow: '',
        createdAt: '',
        deal: '',
        ticket: { 
        people: 0,
        startedAt: '',
        endedAt: ''
      }
      },
      hostInfo: {
        name: '',
        phone: '',
        email: ''
      },
      guestInfo: {
        name: '',
        phone: '',
        email: ''
      },
      propertyInfo: {
        name: '',
        location: '',
        type: '',
        weekdayPrice: '',
        weekendPrice: ''
      },
      formTitle: '檢視訂單',
      orderStatuses: {
        CANCELLED: '取消訂單',
        PAID: '付款成功',
        UNPAID: '確認付款中'
      },
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogHostInfo(val) {
      val || this.closeHostInfo();
    },
    dialogGuestInfo(val) {
      val || this.closeGuestInfo();
    },
    dialogPropertyId(val) {
      val || this.closePropertyId();
    },
    DDeal(val) {
      val || this.close();
    },
  },

  created() {
    this.fetchOrder();
  },

  methods: {
    async fetchOrder() {
    const userData = localStorage.getItem('user');

    if (userData) {
        const parsedData = JSON.parse(userData);
        const userId = parsedData.user.id;  // 獲取 userId
        console.log('User ID:', userId);

        try {
            const response = await axios.get('http://localhost:8080/transcation_record/all', {
                params: { page: 0, limit: 1000 }
            });
            console.log("API response content:", response.data.content);
            
            if (response.status === 200 && response.data && Array.isArray(response.data.content)) {
                console.log("Content length:", response.data.content.length); // 檢查資料長度

                // 過濾符合當前 userId 的訂單
                this.orders = response.data.content.filter(order => {
                    const houseUserId = order.house ? order.house.userId : null;
                    console.log(`House User ID: ${houseUserId}, Current User ID: ${userId}`); // 確保這裡被執行
                    return houseUserId === userId;  // 比較 userId
                }).map(order => {
                    return {
                      ...order,
                      createdAt: this.formatDate(order.createdAt),
                      endedAt: this.formatDate(order.ticket ? order.ticket.endedAt : ''),
                      startedAt: this.formatDate(order.ticket ? order.ticket.startedAt : '')
                    };
                  });
                    // 檢查無效的訂單
                    const invalidOrders = this.orders.filter(order => 
                        typeof order !== 'object' || order === null || 
                        order.cashFlow === undefined || 
                        !order.house || !order.house.name || order.user ||order.ticket||
                        order.ticket.people === undefined
                    );

                console.log("Filtered Orders:", this.orders);


                console.log("Invalid Orders:", invalidOrders);

                if (invalidOrders.length > 0) {
                    const validIds = invalidOrders.map(order => order.id).filter(id => id);
                    await Promise.all(validIds.map(id => this.reFetchOrder(id)));
                }
            } else {
                this.orders = [];
                console.error('No valid content in response.');
            }
        } catch (error) {
            console.error('Error in fetchOrder:', error);
        }
    } else {
        console.log('User data not found in localStorage.');
    }
},

    async updateStatusDeal() {
      try {
        const response = await axios.put(
          `http://localhost:8080/transcation_record/${this.currentItem.id}`,
          {
            deal: this.selectedStatus,
          }
        );

        if (response.status === 200) {
          this.currentItem.deal = this.selectedStatus;
          this.DDeal = false;
        } else {
          console.error("Failed to update status, response:", response);
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    },
      formatDate(dateString) {
          if (!dateString) return '';
          const date = new Date(dateString);
          console.log("date=",date)
          console.log( date.toLocaleString().split('/').join('-')); 
          return date.toLocaleString().split('/').join('-').split(' ')[0]; 
          // 返回 yyyy-mm-dd 格式
        },

      openOrder(item) {
        if (item) {
                  this.editedOrder = Object.assign({}, item);
                  this.dialog = true;
              } else {
                  console.error('Invalid item:', item);
              }
          },

          close() {
              this.dialog = false;
              this.editedOrder = Object.assign({}, this.defaultOrder); // 確保不會設置為 null
          },

    deleteOrder(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedOrder = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteOrderConfirm() {
      try {
        await axios.delete(`http://localhost:8080/transcation_record/${this.editedOrder.id}`);
        this.orders.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedOrder = Object.assign({}, this.defaultOrder);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedOrder = Object.assign({}, this.defaultOrder);
        this.editedIndex = -1;
      });
    },
    
    getStatusColor(deal) {
      if (!deal) return "gray"; // 如果 deal 是 undefined 或空，回傳灰色
      switch (deal) {
        case "取消訂單":
          return "red";
        case "付款成功":
          return "green";
        case "確認付款中":
          return "blue";
        default:
          return "gray"; // 預設狀態顏色
      }
    },
    getStatusText(deal) {
      switch (deal) {
        case "取消訂單":
          return "取消訂單";
        case "付款成功":
          return "付款成功";
        case "確認付款中":
          return "確認付款中";
        default:
          return "確認中";
      }
    },


    openDeal(item) {
      this.currentItem = item;
      this.selectedStatus = item.deal;
      this.DDeal = true;
    },

    resetDeal() {
      this.selectedStatus = null;
      this.DDeal = false;
    },
    async save() {
      if (!this.editedOrder.id || !this.editedOrder.house.name) {
        alert('訂單編號和房屋ID為必填項');
        return;
      }

      try {
        if (this.editedIndex > -1) {
          // 更新現有訂單
          await axios.put(`http://localhost:8080/transcation_record/${this.editedOrder.id}`, this.editedOrder);
          this.orders[this.editedIndex] = this.editedOrder; // 更新本地列表
        } else {
          // 創建新訂單
          const response = await axios.post('http://localhost:8080/transcation_record', this.editedOrder);
          this.orders.push(response.data); // 添加新訂單到本地列表
        }
        this.close();
      } catch (error) {
        console.error('Error saving order:', error);
        // 顯示錯誤消息
        alert('儲存訂單時發生錯誤。');
      }
    },
    
    async reFetchOrder(orderId) {
      try {
        const response = await axios.get(`http://localhost:8080/transcation_record/${orderId}`);
        
        if (response.status === 200) {
          console.log(`重新抓取訂單 ${orderId}:`, response.data);
          // 假設 API 返回的格式是正確的，更新相應的訂單資料
          const index = this.orders.findIndex(order => order.id === orderId);
          if (index !== -1) {
            const updatedOrder = {
            ...response.data,
            createdAt: this.formatDate(response.data.createdAt),
            startedAt: this.formatDate(response.data.ticket.startedAt),
            endedAt: this.formatDate(response.data.ticket.endedAt),
            ticket: response.data.ticket || { people: 0 } 
        };
        console.log("AAA=",updatedOrder)
            this.orders[index] = updatedOrder; // 更新訂單
          }
        } else {
          console.error(`無法重新抓取訂單 ${orderId}:`, response.status);
        }
      } catch (error) {
        console.error(`重新抓取訂單 ${orderId} 時發生錯誤:`, error);
      }
    },
    
    async fetchUserHouses() {
      try {
        const response = await axios.get(`http://localhost:8080/find/${this.userId}/allHouses`); // 假設你有這個端點返回用戶所有房屋
        return response.data; // 返回房屋數組
      } catch (error) {
        console.error('Error fetching user houses:', error);
      }
    },

    async fetchOrdersForHouse(houseId) {
      try {
        const response = await axios.get(`http://localhost:8080/orders`, {
          params: { houseId } // 根據房屋 ID 獲取訂單
        });
        return response.data; // 返回訂單數組
      } catch (error) {
        console.error('Error fetching orders for house:', error);
      }
    },
    async fetchOrdersForUser() {
      const houses = await this.fetchUserHouses();
      if (houses && houses.length > 0) {
        const ordersPromises = houses.map(house => this.fetchOrdersForHouse(house.id));
        const ordersArrays = await Promise.all(ordersPromises);
        
        // 合併所有訂單
        this.orders = [].concat(...ordersArrays);
      }
    }
  },
}
</script>

<style scoped>
</style>


