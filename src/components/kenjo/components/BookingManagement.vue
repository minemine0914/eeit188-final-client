<!--訂單管理系統-->

<!--/*預訂管理	
	預訂列表:顯示所有的預訂記錄，包括當前、未來和歷史的預訂。
	預訂詳情:查看和編輯單個預訂的詳細信息，包括客戶信息、預訂狀態、房間分配等。
	預訂確認/取消:處理預訂確認和取消請求。

  部分資料無法顯示
  修改功能、連結資料尚未完成
  彈跳視窗暫停
  
*/ -->

<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="orders"
    :sort-by="[{ key: 'createdAt', order: 'asc' }]"
  >
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
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.house.name"
                      label="房屋ID"
                      @click="showPropertyId"
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
                      v-model="editedOrder.user.name"
                      label="房客資訊"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      v-model="editedOrder.house.userName"
                      label="房東資訊"
                      @click="showHostInfo"
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
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >取消</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteOrderConfirm"
                >刪除</v-btn
              >
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
        <!-- 房東資訊對話框 -->
        <!-- <v-dialog v-model="dialogHostInfo" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">房東資訊</v-card-title>
            <v-card-text>
              <p>姓名:{{ hostInfo.name }}</p>
              <p>聯絡方法:</p>
              <p>電話:{{ hostInfo.phone }}</p>
              <p>信箱:{{ hostInfo.email }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeHostInfo">關閉</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog> -->

        <!-- 房客資訊對話框 -->
        <!-- <v-dialog v-model="dialogGuestInfo" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">房客資訊</v-card-title>
            <v-card-text>
              <p>姓名:{{ house.userName.phone }}</p>
              <p>聯絡方法:</p>
              <p>電話:{{ guestInfo.phone }}</p>
              <p>信箱:{{ guestInfo.email }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="closeGuestInfo"
                >關閉</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>  -->

        <!-- 房屋資訊對話框 -->
        <!-- <v-dialog v-model="dialogPropertyId" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">房屋資訊</v-card-title>
            <v-card-text>
              <p>名稱:{{ propertyInfo.name }}</p>
              <p>地點:{{ propertyInfo.location }}</p>
              <p>類型:{{ propertyInfo.type }}</p>
              <p>平日價格:{{ propertyInfo.weekdayPrice }}</p>
              <p>假日價格:{{ propertyInfo.weekendPrice }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closePropertyId">關閉</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="openDeal(item)">
        mdi-pencil
      </v-icon>
      <v-icon class="me-2" size="small" @click="openOrder(item)">
        mdi-eye
      </v-icon>
      <v-icon size="small" @click="deleteOrder(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      search: "",
      dialog: false,
      dialogDelete: false,
      dialogHostInfo: false,
      dialogGuestInfo: false,
      dialogPropertyId: false,
      selectedStatus: null,
      DDeal: false,
      headers: [
        { title: "訂單編號", align: "start", sortable: false, key: "id" },
        { title: "房屋名稱", key: "house.name" },
        { title: "房客資訊", key: "user.name" },
        { title: "房東資訊", key: "house.userName" },
        { title: "金額", key: "cashFlow" },
        // { title: '付款方式', key: '' },
        { title: "下單時間", key: "createdAt" },
        { title: "訂單狀態", key: "deal" },
        { title: "編輯", key: "actions", sortable: false },
      ],
     
      orders: [],
      editedIndex: -1,
      editedOrder: {
        id: "",
        house: {
          name: "",
          userName: "",
        },
        user: {
          name: "",
        },
        cashFlow: "",
        createdAt: "",
        deal: "",
      },
      defaultOrder: {
        id: "",
        house: {
          name: "",
          userName: "",
        },
        user: {
          name: "",
        },
        cashFlow: "",
        createdAt: "",
        deal: "",
      },
      hostInfo: {
        name: "",
        phone: "",
        email: "",
      },
      guestInfo: {
        name: "",
        phone: "",
        email: "",
      },
      propertyInfo: {
        name: "",
        location: "",
        type: "",
        weekdayPrice: "",
        weekendPrice: "",
      },
      formTitle: '檢視訂單',
      orderStatuses: {
        CANCELLED: '取消訂單',
        PAID: '付款成功',
        UNPAID: '尚未付款'
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
      try {
        const response = await axios.get(
          "http://localhost:8080/transcation_record/all",
          {
            params: {
              page: 0,
              limit: 1000,
              order: "createdAt",
              dir: true,
            },
          }
        );

        if (response.status === 200) {
          console.log("API response:", response.data);

          if (response.data && Array.isArray(response.data.content)) {
            this.orders = response.data.content;
            // 檢查每個訂單，並記錄格式不正確或缺少資料的訂單
            const invalidOrders = this.orders.filter(
              (order) =>
                typeof order !== "object" ||
                order === null ||
                !order.id ||
                order.cashFlow === undefined ||
                !order.house ||
                !order.house.name ||
                order.user
            );
              console.log(this.orders);
              console.log(this.orderStatuses)
            //console.log('API 返回的完整資料:', response.data);
            if (invalidOrders.length > 0) {
              //console.error('以下訂單格式不正確或缺少房屋資料，將進行重新抓取:', invalidOrders);
              // 確保重抓取時不會有 undefined 的 ID
              const validIds = invalidOrders
                .map((order) => order.id)
                .filter((id) => id);
              await Promise.all(validIds.map((id) => this.reFetchOrder(id)));
            }
            this.orders = response.data.content.map((oder) => ({
              ...oder,
              createdAt: this.formatDate(oder.createdAt),
            }));
          } else {
            //console.error('API response is not in expected format:', response.data);
            this.orders = [];
          }
        } else {
          //console.error('API response status is not OK:', response.status);
        }
      } catch (error) {
        //console.error('Error in fetchOrder:', error);
        // 可以顯示錯誤提示給用戶
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
      if (!dateString) return "";
      const match = dateString.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[0] : "";
    },

    openOrder(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedOrder = Object.assign({}, item);
      console.log(this.editedOrder);
      this.dialog = true;
    },

    deleteOrder(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedOrder = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteOrderConfirm() {
      try {
        await axios.delete(
          `http://localhost:8080/transcation_record/${this.editedOrder.id}`
        );
        this.orders.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    },

    showHostInfo() {
      this.hostInfo = {
        name: this.editedOrder.house.userName,
        phone: "我是電話",
        email: "我是信箱",
      };
      this.dialogHostInfo = true;
    },

    showGuestInfo() {
      this.guestInfo = {
        name: this.editedOrder.user.name,
        phone: "我是電話",
        email: "我是信箱",
      };
      this.dialogGuestInfo = true;
    },

    showPropertyId() {
      this.propertyInfo = {
        name: this.editedOrder.house.name,
        location: "我在..",
        type: "我是xx",
        weekdayPrice: "$$$$",
        weekendPrice: "$$$$",
      };
      this.dialogPropertyId = true;
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

    closeHostInfo() {
      this.dialogHostInfo = false;
    },

    closeGuestInfo() {
      this.dialogGuestInfo = false;
    },

    closePropertyId() {
      this.dialogPropertyId = false;
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
        alert("訂單編號和房屋ID為必填項");
        return;
      }

      try {
        if (this.editedIndex > -1) {
          // 更新現有訂單
          await axios.put(
            `http://localhost:8080/transcation_record/${this.editedOrder.id}`,
            this.editedOrder
          );
          this.orders[this.editedIndex] = this.editedOrder; // 更新本地列表
        } else {
          // 創建新訂單
          const response = await axios.post(
            "http://localhost:8080/transcation_record",
            this.editedOrder
          );
          this.orders.push(response.data); // 添加新訂單到本地列表
        }
        this.close();
      } catch (error) {
        console.error("Error saving order:", error);
        // 顯示錯誤消息
        alert("儲存訂單時發生錯誤。");
      }
    },
    
    async reFetchOrder(orderId) {
      try {
        const response = await axios.get(
          `http://localhost:8080/transcation_record/${orderId}`
        );

        if (response.status === 200) {
          console.log(`重新抓取訂單 ${orderId}:`, response.data);
          // 假設 API 返回的格式是正確的，更新相應的訂單資料
          const index = this.orders.findIndex((order) => order.id === orderId);
          if (index !== -1) {
            this.orders[index] = response.data; // 更新訂單
          }
        } else {
          console.error(`無法重新抓取訂單 ${orderId}:`, response.status);
        }
      } catch (error) {
        console.error(`重新抓取訂單 ${orderId} 時發生錯誤:`, error);
      }
    },
  },
  
      
}
</script>

<style scoped></style>
