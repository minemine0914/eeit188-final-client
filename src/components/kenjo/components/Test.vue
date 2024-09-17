<!--訂單管理系統-->
  
<!--/*預訂管理	
	預訂列表:顯示所有的預訂記錄，包括當前、未來和歷史的預訂。
	預訂詳情:查看和編輯單個預訂的詳細信息，包括客戶信息、預訂狀態、房間分配等。
	預訂確認/取消:處理預訂確認和取消請求。
*/ -->

<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="orders"
    :sort-by="[{ key: 'createdAt', order: 'asc' }]">
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
        <v-dialog v-model="dialog" max-width="500px">
          
          <v-card>
            <v-card-title>
              <!-- <span class="text-h5">{{ formTitle }}</span> -->
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6" v-if="editedIndex !== -1">
                    <v-text-field
                      v-model="editedOrder.orderNumber"
                      label="訂單編號"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.propertyId"
                      label="房屋ID"
                      @click="showPropertyId(editedOrder)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.amount"
                      label="金額"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.guestInfo"
                      label="房客資訊"
                      @click="showGuestInfo(editedOrder)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.hostInfo"
                      label="房東資訊"
                      @click="showHostInfo(editedOrder)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.orderDate"
                      label="下單時間"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.startDate"
                      label="訂單開始時間"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.endDate"
                      label="訂單結束時間"
                    ></v-text-field>
                  </v-col>
                  
                  
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedOrder.status"
                      label="訂單狀態"
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
        <template>
      <!-- 房東資訊框 -->
      <v-dialog v-model="dialogHostInfo" max-width="500px">
          <v-card>
          <v-card-title class="text-h5">房東資訊</v-card-title>
          <v-card-text>
              <p>姓名:{{ hostInfo }}</p>
              <P>----------聯絡方法------------</P>
              <p>電話:我是電話</p>
              <p>信箱:我是信箱</p>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeHostInfo">關閉</v-btn>
              <v-spacer></v-spacer>
          </v-card-actions>
          </v-card>
      </v-dialog>

      <!-- 房客資訊框 -->
      <v-dialog v-model="dialogGuestInfo" max-width="500px">
          <v-card>
          <v-card-title class="text-h5">房客資訊</v-card-title>
          <v-card-text>
              <p>{{ guestInfo }}</p>
              <P>----------聯絡方法------------</P>
              <p>電話:我是電話</p>
              <p>信箱:我是信箱</p>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeGuestInfo">關閉</v-btn>
              <v-spacer></v-spacer>
          </v-card-actions>
          </v-card>
      </v-dialog>
       <!-- 房屋資訊框 -->
       <v-dialog v-model="dialogPropertyId" max-width="500px">
          <v-card>
          <v-card-title class="text-h5">房屋資訊</v-card-title>
          <v-card-text>
              <p>名稱:{{ propertyId }}</p>
              <p>地點:我在..</p>
              <p>類型:我是xx</p>
              <p>平日價格:$$$$</p>
              <p>假日價格:$$$$</p>
          </v-card-text>
          <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closePropertyId">關閉</v-btn>
              <v-spacer></v-spacer>
          </v-card-actions>
          </v-card>
      </v-dialog>

      </template>
      </v-toolbar>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editOrder(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteOrder(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <!-- <v-btn color="primary" @click="initialize">
        Reset
      </v-btn> -->
    </template>
  </v-data-table>
</template>


<script>
import axios, { all } from 'axios';
export default {
data: () => ({
  search: '',
  dialog: false,
  dialogDelete: false,
  dialogHostInfo: false,
  dialogGuestInfo:false,
  dialogPropertyId:false,


  
  headers: [
    { title: '訂單編號', align: 'start', sortable: false, key: 'id' },
    { title: '房屋ID', key: 'house_id' },
    { title: '房客資訊', key: 'user.name' },
    { title: '房東資訊', key: 'user.name' },
    { title: '金額', key: 'cashFlow' },
    { title: '下單時間', key: 'createdAt' },
    { title: '訂單開始時間', key: 'startDate' },
    { title: '訂單結束時間', key: 'endDate' },
    { title: '訂單狀態', key: 'deal' },
    { title: '編輯', key: 'actions', sortable: false },
  ],
  orders: [],
  editedIndex: -1,
  editedOrder: {
    orderNumber: '',
    propertyId: '',
    guestInfo: '',
    hostInfo: '',
    startDate: '',
    endDate: '',
    amount: '',
    orderDate: '',
    status: ''
  },
  defaultOrder: {
    orderNumber: '',
    propertyId: '',
    guestInfo: '',
    hostInfo: '',
    startDate: '',
    endDate: '',
    amount: '',
    orderDate: '',
    status: ''
  },
  hostInfo: ''
}),



watch: {
  dialog (val) {
    val || this.close()
  },
  dialogDelete (val) {
    val || this.closeDelete()
  },
  dialogHostInfo (val) {
    val || this.closeHostInfo()
  },
  dialogGuestInfo (val) {
    val || this.closeGuestInfo()
  },
  dialogPropertyId (val) {
    val || this.closePropertyId()
  }
  
},

created () {
  this.fetchOrder()

},

methods: {
  
  async fetchOrder() {
  try {
    const response = await axios.get('http://localhost:8080/transcation_record/all', {
      params: {
        pageNo: 0,
        pageSize: 1000
      }
    });
    
    if (response.status === 200) {
      console.log('API response:', response.data);
      
      if (response.data && Array.isArray(response.data.orders)) { 
        this.orders = response.data.orders;
      } else {
        console.error('API response is not in expected format:', response.data);
        this.orders = [];
      }
    } else {
      console.error('API response status is not OK:', response.status);
    }
  } catch (error) {
    console.error('Error in fetchOrder:', error);
    // 可以顯示錯誤提示給用戶
  }
},


  editOrder (item) {
    this.editedIndex = this.orders.indexOf(item)
    this.editedOrder = Object.assign({}, item)
    this.dialog = true
  },

  deleteOrder (item) {
    this.editedIndex = this.orders.indexOf(item)
    this.editedOrder = Object.assign({}, item)
    this.dialogDelete = true
  },

  deleteOrderConfirm () {
    this.orders.splice(this.editedIndex, 1)
    this.closeDelete()
  },

  async deleteOrderConfirm() {
      try {
        await axios.delete(`http://localhost:8080/user/${this.editOrder.id}`);
        this.desserts.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    },

  showHostInfo (order) {
    this.hostInfo = order.hostInfo
    this.dialogHostInfo = true
  },
  showGuestInfo (order) {
    this.guestInfo = order.guestInfo
    this.dialogGuestInfo = true
  },
  
  showPropertyId (order) {
    this.propertyId = order.propertyId
    this.dialogPropertyId = true
  },
  close () {
    this.dialog = false
    this.$nextTick(() => {
      this.editedOrder = Object.assign({}, this.defaultOrder)
      this.editedIndex = -1
    })
  },

  closeDelete () {
    this.dialogDelete = false
    this.$nextTick(() => {
      this.editedOrder = Object.assign({}, this.defaultOrder)
      this.editedIndex = -1
    })
  },

  closeHostInfo () {
    this.dialogHostInfo = false
  },
  closeGuestInfo () {
    this.dialogGuestInfo = false
  },
  
  closePropertyId () {
    this.dialogPropertyId = false
  },

  async save() {
    if (!this.editedOrder.orderNumber || !this.editedOrder.propertyId) {
      alert('訂單編號和房屋ID為必填項');
      return;
    }

    try {
      if (this.editedIndex > -1) {
        // 更新現有訂單
        await axios.put(`http://localhost:8080/transcation_record/${this.editedOrder.orderNumber}`, this.editedOrder);
        this.orders[this.editedIndex] = this.editedOrder; // 更新本地列表
      } else {
        // 創建新訂單
        const response = await axios.post('http://localhost:8080/transcation_record/', this.editedOrder);
        this.orders.push(response.data); // 添加新訂單到本地列表
      }
      this.close();
    } catch (error) {
      console.error('Error saving order:', error);
      // 顯示錯誤消息
      alert('儲存訂單時發生錯誤。');
    }
  },

}
};

</script>

<style scoped>
</style>

