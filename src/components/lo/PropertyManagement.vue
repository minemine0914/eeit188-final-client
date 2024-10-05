<template>
    <v-container>
        <!-- 統計卡片 -->
        <v-row class="d-flex flex-row">
            <v-col cols="12" md="4" class="flex-grow-1">
                <v-card class="h-100" color="brown-lighten-5">
                    <v-card-title>總房源數</v-card-title>
                    <v-card-item class="pt-0">
                        <v-sheet
                            v-if="hosuCountDetail.totalHouses == null"
                            class="d-flex flex-row justify-center flex-nowrap"
                            color="transparent"
                        >
                            <v-sheet color="transparent" class="flex-grow-1 text-center">
                                <span class="text-h6 px-1">載入中...</span>
                            </v-sheet>
                        </v-sheet>
                        <v-sheet
                            v-else
                            class="d-flex flex-row justify-center flex-nowrap"
                            color="transparent"
                        >
                            <v-sheet color="transparent" class="flex-grow-1 text-center">
                                <span class="text-h6 px-1">{{ hosuCountDetail.totalHouses }}</span
                                >間
                            </v-sheet>
                        </v-sheet>
                    </v-card-item>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" class="flex-grow-1">
                <v-card class="h-100" color="brown-lighten-5">
                    <v-card-title>審核狀態</v-card-title>
                    <v-card-item class="pt-0">
                        <v-sheet
                            v-if="hosuCountDetail.totalHouses == null"
                            class="d-flex flex-row justify-center flex-nowrap"
                            color="transparent"
                        >
                            <v-sheet color="transparent" class="flex-grow-1 text-center">
                                <span class="text-h6 px-1">載入中...</span>
                            </v-sheet>
                        </v-sheet>
                        <v-sheet
                            v-else
                            class="d-flex flex-row justify-center flex-nowrap"
                            color="transparent"
                        >
                            <v-sheet color="transparent" class="flex-grow-1 text-center"
                                >待審核<span class="text-h6 px-1">{{
                                    hosuCountDetail.reviewNull
                                }}</span
                                >間</v-sheet
                            >
                            <v-sheet color="transparent" class="flex-grow-1 text-center"
                                >未通過<span class="text-h6 px-1">{{
                                    hosuCountDetail.reviewFalse
                                }}</span
                                >間</v-sheet
                            >
                            <v-sheet color="transparent" class="flex-grow-1 text-center"
                                >已通過<span class="text-h6 px-1">{{
                                    hosuCountDetail.reviewTrue
                                }}</span
                                >間</v-sheet
                            >
                        </v-sheet>
                    </v-card-item>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" class="flex-grow-1">
                <v-card class="h-100" color="brown-lighten-5">
                    <v-card-title>上架狀態</v-card-title>
                    <v-card-item class="pt-0">
                        <v-sheet
                            v-if="hosuCountDetail.totalHouses == null"
                            class="d-flex flex-row justify-center flex-nowrap"
                            color="transparent"
                        >
                            <v-sheet color="transparent" class="flex-grow-1 text-center">
                                <span class="text-h6 px-1">載入中...</span>
                            </v-sheet>
                        </v-sheet>
                        <v-sheet
                            v-else
                            class="d-flex flex-row justify-center flex-nowrap"
                            color="transparent"
                        >
                            <v-sheet color="transparent" class="flex-grow-1 text-center"
                                >刊登中<span class="text-h6 px-1">{{
                                    hosuCountDetail.showTrue
                                }}</span
                                >間</v-sheet
                            >
                            <v-sheet color="transparent" class="flex-grow-1 text-center"
                                >下架中<span class="text-h6 px-1">{{
                                    hosuCountDetail.showFalse
                                }}</span
                                >間</v-sheet
                            >
                        </v-sheet>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <!-- 房源管理表格 -->
        <v-data-table-server
            class="elevation-1 mt-3"
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="houseList"
            :items-length="totalItems"
            :loading="loading"
            :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
            item-value="id"
            @update:options="loadItems"
            :search="search"
            show-current-page
            :sort-by="[{key: 'createdAt', order: 'asc'}]"
        >
            <!--欄位 房源名稱-->
            <template v-slot:item.name="{ item }">
                <div class="cursor-pointer" @click="handleClick(item)">
                    {{ item.name }}
                </div>
            </template>
            <!--欄位 建立時間-->
            <template v-slot:item.createdAt="{ item }">
                <div class="cursor-pointer" @click="handleClick(item)">
                    {{ new Date(item.createdAt).toLocaleString() }}
                </div>
            </template>
            <!--欄位 平台審核-->
            <template v-slot:item.review="{ item }">
                <v-chip :color="getReviewColor(item.review)" size="small" class="text-uppercase">
                    {{ getReviewText(item.review) }}
                </v-chip>
            </template>
            <!--欄位 刊登狀態-->
            <template v-slot:item.show="{ item }">
                <v-sheet color="transparent" class="d-flex flex-row align-center ga-2">
                    <v-icon
                        v-if="false"
                        @click="openDialog(item)"
                        class="me-2"
                        small
                        icon="mdi-pencil"
                    ></v-icon>
                    <v-chip :color="getStatusColor(item.show)" size="small">
                        {{ getStatusText(item.show) }}
                    </v-chip>
                    <v-switch
                        :model-value="item.show"
                        hide-details
                        inline
                        :loading="isLoadingSwitch"
                        :readonly="isLoadingSwitch"
                        :color="item.show ? 'green-lighten-2' : ''"
                        @update:model-value="updateStatusBySwitche(item.id, !item.show)"
                    >
                    </v-switch>
                </v-sheet>
            </template>
            <!--欄位 房源操作-->
            <template v-slot:item.actions="{ item }">
                <v-sheet
                    color="transparent"
                    class="d-flex flex-row justify-start aligm-center ga-1"
                >
                    <v-btn
                        prepend-icon="mdi-pencil"
                        color="primary"
                        @click="openUpdateDialog(item)"
                        density="comfortable"
                        variant="outlined"
                        rounded="xl"
                        >編輯</v-btn
                    >
                    <v-btn
                        prepend-icon="mdi-delete"
                        color="error"
                        @click="deleteItem(item)"
                        density="comfortable"
                        variant="outlined"
                        rounded="xl"
                        >刪除</v-btn
                    >
                    <v-btn
                        prepend-icon="mdi-image-edit"
                        color="info"
                        @click="goToEditPropertyImage(item.id)"
                        density="comfortable"
                        variant="outlined"
                        rounded="xl"
                        >圖片管理</v-btn
                    >
                </v-sheet>
            </template>
        </v-data-table-server>
    </v-container>
    <!--狀態修改彈出視窗-->
    <v-dialog v-model="dialog" max-width="290">
        <v-card>
            <v-card-title class="headline">選擇狀態</v-card-title>
            <v-card-text>
                <v-radio-group v-model="selectedStatus">
                    <v-radio label="上架" :value="true"></v-radio>
                    <v-radio label="下架" :value="false"></v-radio>
                </v-radio-group>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="updateStatus" color="primary">確認</v-btn>
                <v-btn @click="resetDialog" color="grey">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!--房源詳細資訊修改彈出視窗-->
    <v-dialog v-model="updateDialog" max-width="290">
        <v-card class="submit-card">
            <v-form class="update-form" @submit.prevent="submitForm">
                <!-- 房源名稱 -->
                <v-text-field label="房源名稱" v-model="currentItem.name" required></v-text-field>

                <!-- 房源類別 -->
                <v-select
                    :items="categories"
                    label="房源類別"
                    v-model="currentItem.category"
                    required
                ></v-select>

                <!-- 房源描述 -->
                <v-textarea
                    label="房源描述"
                    v-model="currentItem.information"
                    rows="3"
                    required
                ></v-textarea>

                <!-- 地址欄位 -->
                <v-select
                    :items="countries"
                    label="國家"
                    v-model="currentItem.country"
                    required
                    outlined
                ></v-select>
                <v-select
                    :items="cities"
                    label="城市"
                    v-model="currentItem.city"
                    required
                    outlined
                ></v-select>
                <v-select
                    :items="districts"
                    label="行政區"
                    v-model="currentItem.region"
                    required
                    outlined
                ></v-select>
                <v-text-field
                    label="街道與門牌號碼"
                    v-model="currentItem.address"
                    required
                ></v-text-field>

                <!-- 經緯度自動生成 -->
                <v-text-field label="經度" v-model="currentItem.latitudeX" readonly></v-text-field>
                <v-text-field label="緯度" v-model="currentItem.longitudeY" readonly></v-text-field>

                <!-- 房間設置 -->
                <v-text-field
                    label="客廳數量"
                    v-model="currentItem.livingDiningRoom"
                    type="number"
                ></v-text-field>
                <v-text-field
                    label="臥室數量"
                    v-model="currentItem.bedroom"
                    type="number"
                ></v-text-field>
                <v-text-field
                    label="浴室數量"
                    v-model="currentItem.bathroom"
                    type="number"
                ></v-text-field>
                <v-text-field
                    label="廁所數量"
                    v-model="currentItem.restroom"
                    type="number"
                ></v-text-field>

                <!-- 價格設置 -->
                <v-text-field
                    label="每日價格"
                    v-model="currentItem.price"
                    type="number"
                    required
                ></v-text-field>

                <!-- 額外設置 -->
                <v-checkbox label="允許寵物" v-model="currentItem.pet"></v-checkbox>
                <v-checkbox label="允許吸煙" v-model="currentItem.smoke"></v-checkbox>
                <v-checkbox label="廚房" v-model="currentItem.kitchen"></v-checkbox>
                <v-checkbox label="陽台" v-model="currentItem.balcony"></v-checkbox>

                <!-- 提交按鈕 -->
                <v-btn class="btn" type="submit" color="primary">提交</v-btn>
                <v-btn class="btn" @click="resetUpdateDialog">取消</v-btn>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useHostManagementStore } from "@/stores/hostManagementStore";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import { storeToRefs } from "pinia";
import Swal from "@/plugins/sweetalert2";
import axios from "@/plugins/axios.js";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const router = useRouter();
const hostManagementStore = useHostManagementStore();

const totalItems = ref(0);
const loading = ref(true);
const isLoadingSwitch = ref(false);
const itemsPerPage = ref(10);
const hosuCountDetail = ref({
    showFalse: null,
    showTrue: null,
    reviewNull: null,
    totalHouses: null,
    reviewFalse: null,
    reviewTrue: null,
});
const search = ref("");

// 統計數據
// const totalProperties = ref(0);

// 房源列表
const houseList = ref([]);

// 房源類別選項
const categories = ["公寓", "度假別墅", "包棟民宿", "旅店", "露營地", "酒店式公寓", "其他"];
const countries = ["臺灣"];

import cityData from "@/assets/CityCountyData.json";

const cities = ref(cityData.map((city) => city.CityName));
const districts = ref([]);

// 確保 currentItem 已經初始化為空物件
const currentItem = ref({});

// 監聽 city 的變化以更新對應的區域（行政區）
watch(
    () => currentItem.value.city,
    (newCity) => {
        const selectedCity = cityData.find((city) => city.CityName === newCity);
        districts.value = selectedCity ? selectedCity.AreaList.map((area) => area.AreaName) : [];
        if (!districts.value.includes(currentItem.value.region)) {
            currentItem.value.region = "";
        }
    }
);

// 表格標題
const headers = [
    { title: "房源名稱", key: "name", sortable: false },
    { title: "建立時間", key: "createdAt", sortable: true, sort: true },
    { title: "平台審核", key: "review", sortable: true },
    { title: "刊登狀態", key: "show", sortable: true },
    { title: "房源操作", key: "actions", sortable: false },
];

const dialog = ref(false);
const updateDialog = ref(false);
const selectedStatus = ref(null);

async function loadItems({ page, itemsPerPage, sortBy }) {
    loading.value = true;
    const requestData = Object.assign({
        page: page - 1,
        limit: itemsPerPage,
        userId: user.value.id,
        dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
        order: sortBy.length > 0 ? sortBy[0].key : null,
    });
    try {
        const response = await axios.post("/house/search", requestData);
        console.log("Fetch Order success: ", response.data);
        totalItems.value = response.data.totalElements;
        houseList.value = response.data.content;
    } catch (error) {
        console.error("Fetch Order error: Status code: ", error.response.status);
        // Handle error (e.g., show error message to user)
    } finally {
        loading.value = false;
    }
}

// 更新統計數據
// const updateStatistics = (propertyList) => {
//     availableProperties.value = propertyList.filter((p) => p.status === "available").length;
//     bookedProperties.value = propertyList.filter((p) => p.status === "booked").length;
//     totalProperties.value = propertyList.length;
// };

// 刪除房源
const deleteItem = async (item) => {
  const result = await Swal.fire({
    title: '是否確定要刪除此房源？',
    text: "此操作將無法恢復！",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '確定',
    cancelButtonText: '取消'
  });

  if (result.isConfirmed) {
    try {
      await hostManagementStore.deleteProperty(item.id);
      Swal.fire(
        '已刪除！',
        '指定房源已成功刪除。',
        'success'
      );
      await reloadHostCountDetail();
    } catch (error) {
      console.error("刪除失敗:", error);
      Swal.fire(
        '刪除失敗',
        '刪除房源時出現錯誤，請稍後再試。',
        'error'
      );
    }
};}

const goToEditPropertyImage = (propertyId) => {
    router.push(`/host/edit-property/${propertyId}`);
};

// 處理彈出視窗
function openDialog(item) {
    currentItem.value = JSON.parse(JSON.stringify(item));
    selectedStatus.value = item.show;
    dialog.value = true;
}

function openUpdateDialog(item) {
    currentItem.value = JSON.parse(JSON.stringify(item));
    updateDialog.value = true;
}

function resetDialog() {
    selectedStatus.value = null;
    dialog.value = false;
}

function resetUpdateDialog() {
    updateDialog.value = false;
}

function getStatusColor(show) {
    switch (show) {
        case true:
            return "green";
        case false:
            return "orange";
        default:
            return "green";
    }
}

function getStatusText(show) {
    switch (show) {
        case true:
            return "刊登中";
        case false:
            return "下架中";
        default:
            return "刊登中";
    }
}

function getReviewColor(review) {
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
}

function getReviewText(review) {
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
}

const updateStatus = async () => {
    try {
        const response = await axios.put(`/house/${currentItem.value.id}`, {
            show: selectedStatus.value,
        });

        if (response.status === 200) {
            currentItem.value.show = selectedStatus.value;
            dialog.value = false;
        }
        await reloadHostCountDetail();
    } catch (error) {
        console.error("Error updating status:", error);
    }
};

const updateStatusBySwitche = async (houseId, show) => {
    isLoadingSwitch.value = true;
    try {
        const response = await axios.put(`/house/${houseId}`, {
            show: show,
        });

        if (response.status === 200) {
            currentItem.value.show = selectedStatus.value;
            dialog.value = false;
        }

        await reloadHostCountDetail();
    } catch (error) {
        console.error("Error updating status:", error);
    } finally {
        isLoadingSwitch.value = false;
    }
};

const submitForm = async () => {
    try {
        await hostManagementStore.updateProperty(currentItem.value.id, currentItem.value);

        Swal.fire({
            icon: "success",
            title: "房源已修改成功！",
        });

        updateDialog.value = false;
        await reloadHostCountDetail();
    } catch (error) {
        console.error("修改失敗", error);
        Swal.fire({
            icon: "error",
            title: "修改失敗",
            text: "請稍後再試",
        });
    }
};

function handleClick(item) {
    const url = `/house/${item.id}`;
    window.open(url, "_blank");
}

async function reloadHostCountDetail() {
    Object.assign(
        hosuCountDetail.value,
        await hostManagementStore.fetchHostCountDetail(user.value.id)
    );
    search.value = new Date().getTime().toString();
}

// 取得房源列表並更新統計數據
onMounted(async () => {
    await reloadHostCountDetail();
});

</script>

<style scoped>
.submit-card {
    width: 600px;
    padding: 50px;
}

.update-form {
    display: flex;
    flex-direction: column;
}

.btn {
    width: 50px;
    margin: 10px;
}
</style>
