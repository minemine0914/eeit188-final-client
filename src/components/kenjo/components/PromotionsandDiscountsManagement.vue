<template>
    <v-container fluid>
        <v-toolbar flat color="brown-lighten-5" rounded="lg">
            <v-toolbar-title>促銷和優惠管理</v-toolbar-title>
            <!-- <v-spacer></v-spacer> -->
            <v-sheet color="transparent" class="d-flex flex-row flex-grow-1 ga-2 mr-2">
                <v-select
                    prefix="搜尋欄位:"
                    v-model="selectedField"
                    :items="[
                        { title: '活動名稱', value: 'name' },
                        { title: '使用者名稱', value: 'userName' },
                    ]"
                    density="compact"
                    label="選擇搜尋欄位"
                    variant="solo-filled"
                    flat
                    hide-details
                    single-line
                    :style="{ width: '50px' }"
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
            <v-sheet class="d-flex flex-row ga-3 mr-3" color="transparent">
                <v-btn
                    color="primary"
                    @click="openCreateDiscountRateDialog"
                    size="large"
                    variant="tonal"
                    >新增促銷活動</v-btn
                >
                <v-btn
                    color="primary"
                    @click="openCreateDiscountDialog"
                    size="large"
                    variant="tonal"
                    >新增優惠碼</v-btn
                >
            </v-sheet>
        </v-toolbar>
        <!-- 促銷活動表格 -->
        <v-data-table-server
            :search="discountRateSearch"
            :headers="discountRateHeaders"
            :items="discountRateList"
            item-value="id"
            :items-per-page="discountRateItemsPerPage"
            :items-length="discountRateTotalItems"
            :loading="discountRateLoading"
            :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
            show-current-page
            @update:options="fetchDiscountRate"
        >
            <template v-slot:item.discountRate="{ item }">
                {{ item.discountRate.toFixed(2) * 100 }} %
            </template>
            <template v-slot:item.expire="{ item }"> {{ item.expire }} 天 </template>
            <template v-slot:item.createdAt="{ item }"> {{ new Date(item.createdAt).toLocaleString().split(' ')[0] }}  </template>
            <template v-slot:item.actions="{ item }">
                <v-btn
                    prepend-icon="mdi-delete"
                    variant="outlined"
                    color="red"
                    density="comfortable"
                    rounded="pill"
                    @click.stop="deleteDiscountRate(item)"
                    >刪除</v-btn
                >
            </template>
        </v-data-table-server>

        <!-- 折扣金 -->
        <v-data-table-server
            :search="discountSearch"
            :headers="discountHeaders"
            :items="discountList"
            item-value="id"
            :items-per-page="discountItemsPerPage"
            :items-length="discountTotalItems"
            :loading="discountLoading"
            :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
            show-current-page
            @update:options="fetchDiscount"
        >
            <template v-slot:item.expire="{ item }"> {{ item.expire }} 天 </template>
            <template v-slot:item.createdAt="{ item }"> {{ new Date(item.createdAt).toLocaleString().split(' ')[0] }}  </template>
            <template v-slot:item.actions="{ item }">
                <v-btn
                    prepend-icon="mdi-delete"
                    variant="outlined"
                    color="red"
                    density="comfortable"
                    rounded="pill"
                    @click.stop="deleteDiscount(item)"
                    >刪除</v-btn
                >
            </template>
        </v-data-table-server>

        <!-- 創建和編輯促銷活動對話框 -->
        <v-dialog v-model="dialogPromotion" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ promotionDialogTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="currentDiscountRate.name"
                        label="活動名稱"
                    ></v-text-field>
                    <v-text-field
                        v-model="currentDiscountRate.discountRate"
                        label="折扣百分比(請輸入0~1之間的值)"
                    ></v-text-field>
                    <!-- <v-text-field v-model="currentPromotion.discountRate" label="使用者ID" ></v-text-field> -->
                    <v-menu v-model="promotionStartDateMenu" :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="currentDiscountRate.expire"
                                label="使用期限"
                                v-bind="attrs"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="currentDiscountRate.startDate"
                            @input="promotionStartDateMenu = false"
                        ></v-date-picker>
                    </v-menu>
                    <v-text-field
                        v-model="currentDiscountRate.userId"
                        label="輸入使用者ID"
                    ></v-text-field>
                    <v-checkbox v-model="assignToAllUsers" label="分配給所有使用者"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDiscountRateDialog">取消</v-btn>
                    <v-btn @click="saveDiscountRate" :loading="isLoadingCreateDiscountRate"
                        >保存</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- 創建和編輯優惠碼對話框 -->
        <v-dialog v-model="dialogDiscountCode" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ discountCodeDialogTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="currentDiscount.name" label="活動名稱"></v-text-field>
                    <v-text-field
                        v-model="currentDiscount.discount"
                        label="折扣金額"
                        type="number"
                    ></v-text-field>
                    <v-menu v-model="discountCodeStartDateMenu" :close-on-content-click="false">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="currentDiscount.expire"
                                label="使用期限"
                                v-bind="attrs"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="currentDiscount.startDate"
                            @input="discountCodeStartDateMenu = false"
                        ></v-date-picker>
                    </v-menu>
                    <v-text-field
                        v-model="currentDiscount.userId"
                        label="輸入使用者ID"
                    ></v-text-field>
                    <v-checkbox v-model="assignToAllUsers" label="分配給所有使用者"></v-checkbox>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="closeDiscountDialog">取消</v-btn>
                    <v-btn @click="saveDiscount" :loading="isLoadingCreateDiscount">保存</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/plugins/axios";

// const promotions = ref([]);
// const discountCodes = ref([]);
const discountCodeDialogTitle = ref("");
const dialogPromotion = ref(false);
const dialogDiscountCode = ref(false);
const promotionStartDateMenu = ref(false);
const discountCodeStartDateMenu = ref(false);
const promotionDialogTitle = ref("");
const currentDiscountRate = ref({ discountRate: "", expire: "" });
const currentDiscount = ref({ discount: "", expire: "" });
// const userIds = ref([]);
// const users = ref([]);
const assignToAllUsers = ref(false);
// const currentPage = ref(0); // 注意：後端頁碼通常從0開始
// const itemsPerPage = ref(5); // 每頁顯示的項目數量
// const totalItems = ref(0); // 總項目數

// [DiscountRate] value
const discountRateSearch = ref("");
const discountRateList = ref([]);
const discountRateItemsPerPage = ref(10);
const discountRateTotalItems = ref(0);
const discountRateLoading = ref(false);
const discountRateSeelectedField = ref("name");
const discountRateHeaders = [
    { title: "折扣碼", key: "id" },
    { title: "活動名稱", key: "name" },
    { title: "使用者", key: "userName" },
    { title: "折扣百分比", key: "discountRate" },
    { title: "使用期限", key: "expire" },
    { title: "創建日期", key: "createdAt" },
    { title: "操作", key: "actions", sortable: false },
];
const isLoadingCreateDiscountRate = ref(false);

// [Discount] value
const discountSearch = ref("");
const discountList = ref([]);
const discountItemsPerPage = ref(10);
const discountTotalItems = ref(0);
const discountLoading = ref(false);
const discountSeelectedField = ref("name");
const discountHeaders = [
    { title: "優惠碼", key: "id" },
    { title: "活動名稱", key: "name" },
    { title: "使用者", key: "userName" },
    { title: "折扣金額", key: "discount" },
    { title: "使用期限", key: "expire" },
    { title: "創建日期", key: "createdAt" },
    { title: "操作", key: "actions", sortable: false },
];
const isLoadingCreateDiscount = ref(false);

// Search text field
const search = ref("");
const selectedField = ref("name");

// const fetchUsers = async () => {
//     try {
//         const response = await axios.get("/user/find-users", {
//             params: {
//                 pageSize: 1000,
//             },
//         });
//         console.log("Fetched users:", response.data);
//         users.value = response.data.users || [];
//         // 確保從 response.data 中提取正確的用戶數組
//         if (Array.isArray(response.data.users)) {
//             userIds.value = response.data.users.map((user) => user.id); // 提取用戶 ID
//         } else {
//             console.error("Fetched users is not an array", response.data.users);
//         }
//     } catch (error) {
//         console.error("Error fetching users:", error);
//     }
// };
// const updateUserId = (id) => {
//     currentDiscountRate.value.userId = id; // 更新當前促銷活動的用戶 ID
// };

const isUUID = (value) => {
    // UUID 格式的正則表達式 (8-4-4-4-12)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};

const fetchDiscountRate = async ({ page, itemsPerPage, sortBy }) => {
    discountRateLoading.value = true;
    // 動態生成搜尋條件
    const searchCondition = {};
    if (selectedField.value === "id") {
        // 如果選擇的是 ID，檢查是否為有效 UUID
        searchCondition["id"] = isUUID(search.value) ? search.value : null;
    } else if (search.value) {
        // 如果選擇的是其他欄位，直接設置搜尋條件
        searchCondition[selectedField.value] = search.value;
    }
    const requestData = Object.assign(
        {
            page: page - 1,
            limit: itemsPerPage,
            dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
            order: sortBy.length > 0 ? sortBy[0].key : null,
            isDiscountNull: true,
        },
        searchCondition
    );
    try {
        const response = await axios.post("/coupon/search", requestData);
        console.log("Fetch Discount rate success: ", response.data);
        discountRateTotalItems.value = response.data.totalElements;
        discountRateList.value = response.data.content;
    } catch (error) {
        console.error("Fetch Discount rate error: Status code: ", error.response.status);
        // Handle error (e.g., show error message to user)
    } finally {
        discountRateLoading.value = false;
    }
};

const fetchDiscount = async ({ page, itemsPerPage, sortBy }) => {
    discountLoading.value = true;
    // 動態生成搜尋條件
    const searchCondition = {};
    if (selectedField.value === "id") {
        // 如果選擇的是 ID，檢查是否為有效 UUID
        searchCondition["id"] = isUUID(search.value) ? search.value : null;
    } else if (search.value) {
        // 如果選擇的是其他欄位，直接設置搜尋條件
        searchCondition[selectedField.value] = search.value;
    }
    const requestData = Object.assign(
        {
            page: page - 1,
            limit: itemsPerPage,
            dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
            order: sortBy.length > 0 ? sortBy[0].key : null,

            isDiscountRateNull: true,
        },
        searchCondition
    );
    console.log(requestData);
    try {
        const response = await axios.post("/coupon/search", requestData);
        console.log("Fetch Discount success: ", response.data);
        discountTotalItems.value = response.data.totalElements;
        discountList.value = response.data.content;
    } catch (error) {
        console.error("Fetch Discount error: Status code: ", error.response.status);
        // Handle error (e.g., show error message to user)
    } finally {
        discountLoading.value = false;
    }
};

const openCreateDiscountRateDialog = () => {
    promotionDialogTitle.value = "新增促銷活動";
    currentDiscountRate.value = { discountRate: "", expire: "" };
    assignToAllUsers.value = false;
    dialogPromotion.value = true;
};

const openCreateDiscountDialog = () => {
    discountCodeDialogTitle.value = "新增優惠碼";
    currentDiscount.value = { discount: "", expire: "" };
    dialogDiscountCode.value = true;
};

const closeDiscountRateDialog = () => {
    dialogPromotion.value = false;
};

const closeDiscountDialog = () => {
    dialogDiscountCode.value = false;
};

// const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "2-digit", day: "2-digit" };
//     return new Date(dateString).toLocaleDateString("zh-TW", options);
// };

const saveDiscountRate = async () => {
    isLoadingCreateDiscountRate.value = true;
    try {
        if (!currentDiscountRate.value.discountRate || !currentDiscountRate.value.expire) {
            alert("折扣百分比和使用期限為必填項");
            return;
        }
        const postData = {
            discountRate: currentDiscountRate.value.discountRate,
            expire: currentDiscountRate.value.expire,
            userId: currentDiscountRate.value.userId, // 這裡是選擇的用戶 ID
            name: currentDiscountRate.value.name,
        };
        // 如果選擇分配給所有用戶，則遍歷所有用戶 ID
        if (assignToAllUsers.value) {
            const response = await axios.post("/coupon/create-for-all-users", postData);
            console.log("促銷活動創建成功", response.data);
        } else {
            const response = await axios.post("/coupon/", postData);
            console.log("促銷活動創建成功", response.data);
        }
        isLoadingCreateDiscountRate.value = false;
        reloadDiscussRate(); // 更新促銷列表
        closeDiscountRateDialog(); // 關閉對話框
    } catch (error) {
        console.error("保存促銷活動時出錯:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            alert(`錯誤: ${error.response.data.message || "無法保存促銷活動"}`);
        } else {
            alert("無法連接到伺服器或其他錯誤，請稍後再試。");
        }
    }
};

const saveDiscount = async () => {
    isLoadingCreateDiscount.value = true;
    try {
        if (!currentDiscount.value.discount || !currentDiscount.value.expire) {
            alert("折扣金額和使用期限為必填項");
            return;
        }
        const postData = {
            discount: currentDiscount.value.discount,
            expire: currentDiscount.value.expire,
            userId: currentDiscount.value.userId, // 這裡是選擇的用戶 ID
            name: currentDiscount.value.name,
        };
        // 如果選擇分配給所有用戶，則遍歷所有用戶 ID
        if (assignToAllUsers.value) {
            const response = await axios.post("/coupon/create-for-all-users", postData);
            console.log("促銷活動創建成功", response.data);
        } else {
            // 只為當前選擇的用戶創建促銷活動
            const response = await axios.post("/coupon/", postData);
            console.log("促銷活動創建成功", response.data);
        }
        isLoadingCreateDiscount.value = false;
        reloadDiscuss(); // 更新促銷列表
        closeDiscountDialog(); // 關閉對話框
    } catch (error) {
        console.error("保存促銷活動時出錯:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            alert(`錯誤: ${error.response.data.message || "無法保存促銷活動"}`);
        } else {
            alert("無法連接到伺服器或其他錯誤，請稍後再試。");
        }
    }
};

const deleteDiscountRate = async (promotion) => {
    try {
        await axios.delete(`/coupon/${promotion.id}`);
        reloadDiscussRate();
        // fetchDiscountRate();
    } catch (error) {
        console.error("刪除促銷活動時出錯:", error);
    }
};

const deleteDiscount = async (discountCode) => {
    try {
        await axios.delete(`/coupon/${discountCode.id}`);
        reloadDiscuss();
        // fetchDiscount();
    } catch (error) {
        console.error("刪除優惠碼時出錯:", error);
    }
};

const reloadDiscussRate = () => {
    discountRateSearch.value = new Date().getTime().toString();
};
const reloadDiscuss = () => {
    discountSearch.value = new Date().getTime().toString();
};

const onSearchTextFieldUpdate = (e) => {
    console.log(e.target.value);
    search.value = e.target.value;
    reloadDiscuss();
    reloadDiscussRate();
};

// onMounted(() => {
//     fetchUsers();
//     fetchDiscountRate();
//     fetchDiscount();
// });
</script>

<style scoped>
/* .text-center {
    text-align: center;
} */
</style>
