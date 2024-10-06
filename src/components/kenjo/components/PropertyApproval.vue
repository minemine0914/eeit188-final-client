<!--/*房源審核	
	待審核房源:顯示所有待審核的房源申請。
	房源審核:處理房源審核請求，批准或拒絕房源發布。
  //review 判斷欄位 >>需要新增
*/ -->
<template>
    <v-toolbar flat>
        <v-toolbar-title>房源審核</v-toolbar-title>
        <!-- 搜尋欄位下拉選單 -->
        <v-sheet color="transparent" class="d-flex flex-row flex-grow-1 ga-2 mr-2">
            <v-select
                prefix="搜尋欄位:"
                v-model="selectedField"
                :items="[
                    { title: '房源名稱', value: 'name' },
                    { title: '房東', value: 'userName' },
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
        </v-sheet>
    </v-toolbar>

    <div>
        <v-data-table-server
            :search="search"
            :expanded="expanded"
            :headers="headers"
            :items="houses"
            item-value="name"
            :items-per-page="itemsPerPage"
            :items-length="totalItems"
            :loading="loading"
            :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
            show-current-page
            @update:options="fetchHouses"
        >
            <template v-slot:item.createdAt="{item}">{{new Date(item.createdAt).toLocaleString()}}</template>
            <template v-slot:item.review="{ item }">
                <!--狀態欄位-->
                <v-chip :color="getStatusColor(item.review)" size="small" class="text-uppercase">
                    {{ getStatusText(item.review) }}
                </v-chip>
                <!-- <v-btn @click="openDialog(item)" small color="primary">
        修改
    </v-btn> -->
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon @click="openDialog(item)" class="me-2" small> mdi-pencil </v-icon>
            </template>
        </v-data-table-server>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline">選擇狀態</v-card-title>
                <v-card-text>
                    <v-radio-group v-model="selectedStatus">
                        <v-radio label="待審核" :value="null"></v-radio>
                        <v-radio label="審核通過" :value="true"></v-radio>
                        <v-radio label="審核失敗" :value="false"></v-radio>
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="updateStatus" color="primary">確認</v-btn>
                    <v-btn @click="resetDialog" color="grey">取消</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
// import axios from 'axios';
import axios from "@/plugins/axios";

export default {
    data() {
        return {
            search: "",
            expanded: [],
            dialog: false,
            selectedStatus: null,
            currentItem: null,
            headers: [
                //標題
                {
                    title: "房屋名稱",
                    align: "start",
                    sortable: false,
                    key: "name",
                },
                { title: "房東", key: "userName" },
                { title: "地址 ", key: "address" },
                { title: "房屋類型 ", key: "category" },
                { title: "提交時間 ", key: "createdAt" },
                { title: "狀態 ", key: "review" },
                { title: "編輯", value: "actions", sortable: false },
            ],
            houses: [],
            itemsPerPage: 10,
            totalItems: 0,
            loading: false,
            selectedField: "name",
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
    // },

    // created() {
    //     this.fetchOrder();
    // },
    // watch: {
    //     dialog(val) {
    //         if (!val) {
    //             this.selectedStatus = null;
    //         }
    //     },
    // },

    methods: {
        onSearchTextFieldUpdate(e) {
            console.log(e.target.value);
            this.search = e.target.value;
        },
        async fetchHouses({ page, itemsPerPage, sortBy }) {
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
            const requestData = Object.assign(
                {
                    page: page - 1,
                    limit: itemsPerPage,
                    dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
                    order: sortBy.length > 0 ? sortBy[0].key : null,
                },
                searchCondition
            );
            try {
                const response = await axios.post("/house/search", requestData);
                console.log("Fetch Order success: ", response.data);
                this.totalItems = response.data.totalElements;
                this.houses = response.data.content;
            } catch (error) {
                console.error("Fetch Order error: Status code: ", error.response.status);
                // Handle error (e.g., show error message to user)
            } finally {
                this.loading = false;
            }
        },
        formatDate(dateString) {
            if (!dateString) return "";
            const date = new Date(dateString);
            return date.toISOString().split("T")[0];
        },
        getStatusColor(review) {
            switch (review) {
                case null:
                    return "orange"; // 待審核
                case true:
                    return "green"; // 審核通過
                case false:
                    return "red"; // 審核失敗
                default:
                    return "grey"; // 未知狀態
            }
        },
        resetDialog() {
            this.selectedStatus = null; // 重設狀態
            this.dialog = false; // 關閉對話框
        },
        getStatusText(review) {
            switch (review) {
                case null:
                    return "待審核";
                case true:
                    return "審核通過";
                case false:
                    return "審核失敗";
                default:
                    return "確認中";
            }
        },

        async updateStatus() {
            try {
                const response = await axios.put(`/house/${this.currentItem.id}`, {
                    review: this.selectedStatus,
                });

                if (response.status === 200) {
                    this.currentItem.review = this.selectedStatus;
                    this.dialog = false;
                }
            } catch (error) {
                console.error("Error updating status:", error);
            }
        },

        openDialog(item) {
            this.currentItem = item; // 記錄當前項目
            this.selectedStatus = item.review; // 設置選擇的狀態
            this.dialog = true; // 打開對話框
        },
        resetDialog() {
            this.selectedStatus = null;
            this.dialog = false;
        },
    },
};
</script>

<style scoped>
.title-center {
    display: flex;
    justify-content: center;
    flex-grow: 1;
}
</style>
