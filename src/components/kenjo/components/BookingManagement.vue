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
    <v-data-table-server
        :headers="headers"
        :items="orders"
        :items-per-page="itemsPerPage"
        :items-length="totalItems"
        :search="search"
        :loading="loading"
        :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
        show-current-page
        @update:options="fetchOrder"
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
                                            @click="showGuestInfo"
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
                            <v-btn color="blue-darken-1" variant="text" @click="save"> 儲存 </v-btn>
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
                            <v-btn color="blue-darken-1" variant="text" @click="deleteOrderConfirm"
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
                                <v-radio
                                    :label="orderStatuses.CANCELLED"
                                    :value="orderStatuses.CANCELLED"
                                ></v-radio>
                                <v-radio
                                    :label="orderStatuses.PAID"
                                    :value="orderStatuses.PAID"
                                ></v-radio>
                                <v-radio
                                    :label="orderStatuses.UNPAID"
                                    :value="orderStatuses.UNPAID"
                                ></v-radio>
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
                <v-dialog v-model="dialogHostInfo" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">房東資訊</v-card-title>
                        <v-card-text>
                            <p>姓名:{{ hostInfo.name }}</p>
                            <!-- <p>聯絡方法:</p> -->
                            <p>電話:{{ hostInfo.phone }}</p>
                            <p>信箱:{{ hostInfo.email }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeHostInfo"
                                >關閉</v-btn
                            >
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- 房客資訊對話框 -->
                <v-dialog v-model="dialogGuestInfo" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">房客資訊</v-card-title>
                        <v-card-text>
                            <p>姓名:{{ guestInfo.name }}</p>
                            <!-- <p>聯絡方法:</p> -->
                            <p>電話:{{ guestInfo.phone }}</p>
                            <p>信箱:{{ guestInfo.email }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeGuestInfo"
                                >關閉</v-btn
                            >
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

                <!-- 房屋資訊對話框 -->
                <v-dialog v-model="dialogPropertyId" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">房屋資訊</v-card-title>
                        <v-card-text>
                            <p>名稱:{{ propertyInfo.name }}</p>
                            <p>城市:{{ propertyInfo.city }}</p>
                            <p>地址:{{ propertyInfo.location }}</p>
                            <p>類型:{{ propertyInfo.category }}</p>
                            <p>每晚價格:{{ propertyInfo.price }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closePropertyId"
                                >關閉</v-btn
                            >
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="openDeal(item)"> mdi-pencil </v-icon>
            <v-icon class="me-2" size="small" @click="openOrder(item)"> mdi-eye </v-icon>
            <!-- <v-icon size="small" @click="deleteOrder(item)"> mdi-delete </v-icon> -->
        </template>
    </v-data-table-server>
</template>

<script>
import axios from "@/plugins/axios";
import { useUserStore } from "@/stores/userStore.js";
import { mapStores } from "pinia";

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
            formTitle: "檢視訂單",
            orderStatuses: {
                CANCELLED: "取消訂單",
                PAID: "付款成功",
                UNPAID: "確認付款中",
            },
            itemsPerPage: 10,
            totalItems: 0,
            loading: false,
        };
    },

    // watch: {
    //     dialog(val) {
    //         val || this.close();
    //     },
    //     dialogDelete(val) {
    //         val || this.closeDelete();
    //     },
    //     dialogHostInfo(val) {
    //         val || this.closeHostInfo();
    //     },
    //     dialogGuestInfo(val) {
    //         val || this.closeGuestInfo();
    //     },
    //     dialogPropertyId(val) {
    //         val || this.closePropertyId();
    //     },
    //     DDeal(val) {
    //         val || this.close();
    //     },
    // },

    // created() {
    //     this.fetchOrder();
    // },
    computed: {
        ...mapStores(useUserStore),
    },

    methods: {
        async fetchOrder({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            const requestData = Object.assign({
                page: page - 1,
                limit: itemsPerPage,
                dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
                order: sortBy.length > 0 ? sortBy[0].key : null,
            });
            try {
                const response = await axios.post("/transcation_record/search", requestData);
                console.log("Fetch Order success: ", response.data);
                this.totalItems = response.data.totalElements;
                this.orders = response.data.content;
            } catch (error) {
                console.error("Fetch Order error: Status code: ", error.response.status);
                // Handle error (e.g., show error message to user)
            } finally {
                this.loading = false;
            }
        },
        async updateStatusDeal() {
            try {
                const response = await axios.put(`/transcation_record/${this.currentItem.id}`, {
                    deal: this.selectedStatus,
                });

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
                await axios.delete(`/transcation_record/${this.editedOrder.id}`);
                this.orders.splice(this.editedIndex, 1);
                this.closeDelete();
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        },

        async showHostInfo() {
            try {
                const response = await axios.get(`/user/find/${this.editedOrder.house.userId}`); // 假設 userId 是房東的 ID
                if (response.status === 200) {
                    this.hostInfo = {
                        name: response.data.name,
                        phone: response.data.phone,
                        email: response.data.email,
                    };
                    this.dialogHostInfo = true;
                } else {
                    console.error("無法獲取房東資訊:", response.status);
                    // 可以顯示提示訊息給使用者
                }
            } catch (error) {
                console.error("獲取房東資訊時發生錯誤:", error);
                // 可以顯示提示訊息給使用者
            }
        },

        showGuestInfo() {
            this.guestInfo = {
                name: this.editedOrder.user.name,
                phone: this.editedOrder.user.phone,
                email: this.editedOrder.user.email,
            };
            this.dialogGuestInfo = true;
        },

        showPropertyId() {
            this.propertyInfo = {
                name: this.editedOrder.house.name,
                location: this.editedOrder.house.address,
                category: this.editedOrder.house.category,
                price: this.editedOrder.house.price,
                city: this.editedOrder.house.city,
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
                    await axios.put(`/transcation_record/${this.editedOrder.id}`, this.editedOrder);
                    this.orders[this.editedIndex] = this.editedOrder; // 更新本地列表
                } else {
                    // 創建新訂單
                    const response = await axios.post("/transcation_record", this.editedOrder);
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
                const response = await axios.get(`/transcation_record/${orderId}`);

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
};
</script>

<style scoped></style>
