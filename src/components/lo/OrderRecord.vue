<template>
    <!-- 訂單管理表格 (分頁) -->
    <v-data-table-server
        :items-per-page="itemsPerPage"
        :items-length="totalItems"
        :search="search"
        :loading="loading"
        :headers="headers"
        :items="orders"
        :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
        @update:options="fetchOrder"
    >
        <template v-slot:item.deal="{ item }">
            <v-chip :color="getStatusColor(item.deal)" size="small" class="text-uppercase">
                {{ getStatusText(item.deal) }}
            </v-chip>
        </template>

        <template v-slot:item.house="{ item }">
            <div @click.stop="$router.push(`/house/${item.house.id}`)" class="cursor-pointer">
                {{ item.house.name }}
            </div>
        </template>
        <template v-slot:item.user="{ item }">
            <div>{{ item.user.name }}</div>
        </template>

        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>訂單管理</v-toolbar-title>
                <!-- 搜尋欄位下拉選單 -->
                <v-select
                prefix="搜尋條件:"
                    v-model="selectedField"
                    :items="[
                        { title: '金額', value: 'cashFlow' },
                        { title: '房源名稱', value: 'houseName' },
                        { title: '訂單編號', value: 'id' },
                    ]"
                    density="compact"
                    label="選擇搜尋欄位"
                    variant="solo-filled"
                    flat
                    hide-details
                    single-line
                    :style="{ width: '30px' }"
                ></v-select>
                <v-text-field
                    density="compact"
                    label="查詢"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo-filled"
                    flat
                    hide-details
                    single-line
                    :style="{ width: '200px' }"
                    @blur="onSearchTextFieldUpdate"
                    @keyup.enter="onSearchTextFieldUpdate"
                    clearable
                ></v-text-field>
                <!-- 匯出 CSV 按鈕 -->
                <v-btn color="success" @click="exportCSV">匯出 CSV</v-btn>
            </v-toolbar>
        </template>

        <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="openDeal(item)"> mdi-pencil </v-icon>
            <v-icon class="me-2" size="small" @click="openOrder(item)"> mdi-eye </v-icon>
        </template>
    </v-data-table-server>

    <!-- 顯示訂單資訊 -->
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
                                label="房源名稱"
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
                <v-btn color="blue-darken-1" variant="text" @click="close"> 取消 </v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="save"> 儲存 </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <!-- 刪除 -->
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
    <!-- 選擇狀態 -->
    <v-dialog v-model="DDeal" max-width="290">
        <v-card>
            <v-card-title class="headline">選擇狀態</v-card-title>
            <v-card-text>
                <v-radio-group v-model="selectedStatus">
                    <v-radio
                        :label="orderStatuses.CANCELLED"
                        :value="orderStatuses.CANCELLED"
                    ></v-radio>
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
</template>

<script>
//import axios from 'axios';
import axios from "@/plugins/axios";
import { useUserStore } from "@/stores/userStore.js";
import { mapStores } from "pinia";

export default {
    data() {
        return {
            userId: "",
            search: "",
            orders: [],
            dialog: false,
            dialogDelete: false,
            dialogHostInfo: false,
            dialogGuestInfo: false,
            dialogPropertyId: false,
            selectedStatus: null,
            DDeal: false,
            headers: [
                { title: "訂單編號", align: "start", sortable: false, key: "id" },
                { title: "房屋名稱", key: "house.name", sortable: false },
                { title: "房客資訊", key: "user.name", sortable: false },
                { title: "金額", key: "cashFlow", sortable: true },
                { title: "下單時間", key: "createdAt", sortable: true },
                { title: "訂單狀態", key: "deal" },
                { title: "編輯", key: "actions", sortable: false },
                // { title: '房東資訊', key: 'house.userName' },
                // { title: '付款方式', key: '' },
            ],
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
                ticket: {
                    people: "",
                    startedAt: "",
                    endedAt: "",
                },
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
                ticket: {
                    people: 0,
                    startedAt: "",
                    endedAt: "",
                },
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
            selectedField: "cashFlow",
        };
    },
    computed: {
        ...mapStores(useUserStore),
    },
    methods: {
        onSearchTextFieldUpdate(e) {
            console.log(e.target.value);
            this.search = e.target.value;
        },
        isUUID(value) {
            // UUID 格式的正則表達式 (8-4-4-4-12)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return uuidRegex.test(value);
        },
        async fetchOrder({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            // 動態生成搜尋條件
            const searchCondition = {};
            if (this.selectedField === "id") {
                // 如果選擇的是 ID，檢查是否為有效 UUID
                searchCondition["id"] = this.isUUID(this.search) ? this.search : null;
            } else if (this.search) {
                // 如果選擇的是其他欄位，直接設置搜尋條件
                searchCondition[this.selectedField] = this.search;
            }
            // 使用 Object.assign 合併搜尋條件和其他參數
            const requestData = Object.assign(
                {
                    page: page - 1,
                    limit: itemsPerPage,
                    hostId: this.userStore.user.id,
                    dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
                    order: sortBy.length > 0 ? sortBy[0].key : null,
                },
                searchCondition // 合併動態搜尋條件
            );
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
            const date = new Date(dateString);
            console.log("date=", date);
            console.log(date.toLocaleString().split("/").join("-"));
            return date.toLocaleString().split("/").join("-").split(" ")[0];
            // 返回 yyyy-mm-dd 格式
        },

        openOrder(item) {
            if (item) {
                this.editedOrder = Object.assign({}, item);
                this.dialog = true;
            } else {
                console.error("Invalid item:", item);
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
                await axios.delete(`/transcation_record/${this.editedOrder.id}`);
                this.orders.splice(this.editedIndex, 1);
                this.closeDelete();
            } catch (error) {
                console.error("Error deleting order:", error);
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
                    //console.log(`重新抓取訂單 ${orderId}:`, response.data);
                    // 假設 API 返回的格式是正確的，更新相應的訂單資料
                    //   const index = this.orders.findIndex(order => order.id === orderId);
                    //   if (index !== -1) {
                    //     const updatedOrder = {
                    //     ...response.data,
                    //     createdAt: this.formatDate(response.data.createdAt),
                    //     startedAt: this.formatDate(response.data.ticket.startedAt),
                    //     endedAt: this.formatDate(response.data.ticket.endedAt),
                    //     ticket: response.data.ticket || { people: 0 }
                    // };
                    // console.log("AAA=",updatedOrder)
                    //     this.orders[index] = updatedOrder; // 更新訂單
                    //   }
                } else {
                    console.error(`無法重新抓取訂單 ${orderId}:`, response.status);
                }
            } catch (error) {
                console.error(`重新抓取訂單 ${orderId} 時發生錯誤:`, error);
            }
        },

        // async fetchUserHouses() {
        //   try {
        //     const response = await axios.get(`http://localhost:8080/find/${this.userId}/allHouses`); // 假設你有這個端點返回用戶所有房屋
        //     return response.data; // 返回房屋數組
        //   } catch (error) {
        //     console.error('Error fetching user houses:', error);
        //   }
        // },

        // async fetchOrdersForHouse(houseId) {
        //   try {
        //     const response = await axios.get(`http://localhost:8080/orders`, {
        //       params: { houseId } // 根據房屋 ID 獲取訂單
        //     });
        //     return response.data; // 返回訂單數組
        //   } catch (error) {
        //     console.error('Error fetching orders for house:', error);
        //   }
        // },
        // async fetchOrdersForUser() {
        //   const houses = await this.fetchUserHouses();
        //   if (houses && houses.length > 0) {
        //     const ordersPromises = houses.map(house => this.fetchOrdersForHouse(house.id));
        //     const ordersArrays = await Promise.all(ordersPromises);

        //     // 合併所有訂單
        //     this.orders = [].concat(...ordersArrays);
        //   }
        // },
        exportCSV() {
            const csvContent = this.generateCSV(this.orders); // 使用 orders
            const bom = "\uFEFF"; // 加入 BOM
            const blob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "orders.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        generateCSV(data) {
            const filteredHeaders = this.headers.filter((header) => header.key !== "actions"); // 不列印出 actions 欄位
            const headers = filteredHeaders.map((header) => `"${header.title}"`).join(",") + "\n";

            const rows = data
                .map((item) =>
                    filteredHeaders
                        .map((header) => {
                            const keys = header.key.split(".");
                            let value = item;
                            keys.forEach((key) => {
                                value = value ? value[key] : "";
                            });
                            return `"${
                                value !== undefined && value !== null
                                    ? value.toString().replace(/"/g, '""')
                                    : ""
                            }"`;
                        })
                        .join(",")
                )
                .join("\n");

            return headers + rows;
        },
    },
};
</script>

<style scoped></style>
