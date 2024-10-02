<template>
  <v-container>
    <!-- 統計卡片 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>總房源數</v-card-title>
          <v-card-text>{{ totalProperties }} 間</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 房源管理表格 -->
    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="house.houses"
          class="elevation-1"
        >
          <template v-slot:item.name="{ item }">
            <v-text class="title-name" @click="handleClick(item)">
              {{ item.name }}
            </v-text>
          </template>
          <template v-slot:item.review="{ item }">
            <!--狀態欄位-->
            <v-chip
              :color="getReviewColor(item.review)"
              size="small"
              class="text-uppercase"
            >
              {{ getReviewText(item.review) }}
            </v-chip>
          </template>
          <template v-slot:item.show="{ item }">
            <!--狀態欄位-->
            <v-chip
              :color="getStatusColor(item.show)"
              size="small"
              class="text-uppercase"
            >
              {{ getStatusText(item.show) }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon @click="openDialog(item)" class="me-2" small>
              mdi-pencil
            </v-icon>
            <v-btn color="primary" @click="openUpdateDialog(item)">編輯</v-btn>
            <v-btn color="error" @click="deleteItem(item)">刪除</v-btn>

            <v-btn color="info" @click="goToEditPropertyImage(item.id)"
              >圖片管理</v-btn
            >
          </template>
        </v-data-table>

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
              <v-text-field
                label="房源名稱"
                v-model="currentItem.name"
                required
              ></v-text-field>

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
              <v-text-field
                label="經度"
                v-model="currentItem.latitudeX"
                readonly
              ></v-text-field>
              <v-text-field
                label="緯度"
                v-model="currentItem.longitudeY"
                readonly
              ></v-text-field>

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
                v-model="currentItem.pricePerDay"
                type="number"
                required
              ></v-text-field>
              <v-text-field
                label="每週價格"
                v-model="currentItem.pricePerWeek"
                type="number"
              ></v-text-field>
              <v-text-field
                label="每月價格"
                v-model="currentItem.pricePerMonth"
                type="number"
              ></v-text-field>

              <!-- 額外設置 -->
              <v-checkbox
                label="允許寵物"
                v-model="currentItem.pet"
              ></v-checkbox>
              <v-checkbox
                label="允許吸煙"
                v-model="currentItem.smoke"
              ></v-checkbox>
              <v-checkbox
                label="廚房"
                v-model="currentItem.kitchen"
              ></v-checkbox>
              <v-checkbox
                label="陽台"
                v-model="currentItem.balcony"
              ></v-checkbox>

              <!-- 提交按鈕 -->
              <v-btn class="btn" type="submit" color="primary">提交</v-btn>
              <v-btn class="btn" @click="resetUpdateDialog">取消</v-btn>
            </v-form>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useHostManagementStore } from "@/stores/hostManagementStore";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";
import axios from "@/plugins/axios.js";

const userStore = useUserStore();
const { user } = userStore;

const router = useRouter();
const hostManagementStore = useHostManagementStore();

// 統計數據
const totalProperties = ref(0);

// 房源列表
const properties = ref([]);

const house = reactive({
  houses: [],
});

const categories = [
  "公寓",
  "度假別墅",
  "包棟民宿",
  "旅店",
  "露營地",
  "酒店式公寓",
  "其他",
];
const countries = ["臺灣"];

// 表格標題
const headers = [
  { title: "名稱", key: "name" },
  { title: "審核", key: "review" },
  { title: "狀態", key: "show" },
  { title: "操作", key: "actions", sortable: false },
];

const dialog = ref(false);
const updateDialog = ref(false);
const selectedStatus = ref(null);
const currentItem = ref(null);

// 更新統計數據
const updateStatistics = (propertyList) => {
  availableProperties.value = propertyList.filter(
    (p) => p.status === "available"
  ).length;
  bookedProperties.value = propertyList.filter(
    (p) => p.status === "booked"
  ).length;
  totalProperties.value = propertyList.length;
};

// 取得房源列表並更新統計數據
onMounted(async () => {
  house.houses.push(...(await hostManagementStore.fetchAllhouse(user.id)));
  totalProperties.value = await hostManagementStore.countAllhouse(user.id);
});

// 刪除房源
const deleteItem = async (item) => {
  const checked = confirm("是否確定要刪除此房源？");

  if (checked) {
    try {
      await hostManagementStore.deleteProperty(item.id);
      house.houses = [];
      house.houses.push(...(await hostManagementStore.fetchAllhouse(user.id)));
      totalProperties.value = await hostManagementStore.countAllhouse(user.id);
      alert("已刪除指定房源");
    } catch (error) {
      console.error("刪除失敗:", error);
      alert("刪除失敗，請稍後再試");
    }
  }
};

const goToEditPropertyImage = (propertyId) => {
  router.push(`/host/edit-property/${propertyId}`);
};

// 處理彈出視窗
function openDialog(item) {
  currentItem.value = item;
  selectedStatus.value = item.show;
  dialog.value = true;
}

function openUpdateDialog(item) {
  currentItem.value = item;
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
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

const submitForm = async () => {
  try {
    // 發送表單資料到後端
    const response = await hostManagementStore.updateProperty(
      currentItem.value.id,
      currentItem.value
    );

    if (response.status === 200) {
      updateDialog.value = false;
    }

    alert("房源已修改成功！");
  } catch (error) {
    console.error("修改失敗", error);
    alert("修改失敗，請稍後再試");
  }
};

function handleClick(item) {
  const url = `/house/${item.id}`;
  window.open(url, "_blank");
}

watch(dialog, (val) => {
  if (!val) close();
});

watch(dialog, (val) => {
  if (!val) selectedStatus.value = null;
});

watch(updateDialog, (val) => {
  if (!val) close();
});

watch(updateDialog, (val) => {
  if (!val) selectedStatus.value = null;
});
</script>

<style scoped>
.title-name {
  cursor: pointer;
}

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
