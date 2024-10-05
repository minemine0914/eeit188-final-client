<template>
  <v-toolbar flat>
    <v-toolbar-title>促銷和優惠管理</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="openCreatePromotionDialog">新增促銷活動</v-btn>
    <v-btn color="primary" @click="openCreateDiscountCodeDialog">新增優惠碼</v-btn>
  </v-toolbar>
  
  <div class="text-center">
    <!-- 促銷活動表格 -->
    <v-data-table
      v-model:search="searchPromotions"
      :headers="promotionHeaders"
      :items="promotions"
      item-key="id"
       :items-per-page="itemsPerPage"
    >
      <template v-slot:header.id>
        <div class="text-center">折扣碼</div>
      </template>
      <template v-slot:item.image="{ item }">
        <div class="text-center">
          <v-card class="my-2" elevation="2" rounded>
            <v-img :src="`/assets/${item.image}`" height="64" width="70" cover></v-img>
          </v-card>
        </div>
      </template>
      <template v-slot:header.name>
        <div class="text-center">活動名稱</div>
      </template>
      <template v-slot:item.discountRate="{ item }">
        <div class="text-center">{{ (item.discountRate ).toFixed(2) * 100 }}%</div>
      </template>
      <template v-slot:header.discountRate>
        <div class="text-center">折扣比率</div>
      </template>
      <template v-slot:header.expire>
        <div class="text-center">使用期限</div>
      </template>
      <template v-slot:header.createdAt>
        <div class="text-center">創建日期</div>
      </template>
      <template v-slot:top>
        <v-text-field
          v-model="searchPromotions"
          label="搜尋促銷活動"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="solo-filled"
          flat
          hide-details
          single-line
          :style="{ width: '300px' }"
        ></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon @click="deletePromotion(item)" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- 折扣金 -->
    <v-data-table
      v-model:search="searchDiscountCodes"
      :headers="discountCodeHeaders"
      :items="discountCodes"
      item-key="id"
      :items-per-page="5"
    >
      <template v-slot:header.id>
        <div class="text-center">優惠碼</div>
      </template>
      <template v-slot:header.name>
        <div class="text-center">活動名稱</div>
      </template>
      <template v-slot:header.discount>
        <div class="text-center">折扣金額</div>
      </template>
      <template v-slot:header.expire>
        <div class="text-center">使用期限</div>
      </template>
      <template v-slot:header.createdAt="{ item }">
        <div class="text-center">創建日期</div>
      </template>
      <template v-slot:item.expire="{ item }">
        <div class="text-center">{{ item.expire }}</div>
      </template>
      <template v-slot:top>
        <v-text-field
          v-model="searchDiscountCodes"
          label="搜尋優惠碼"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="solo-filled"
          flat
          hide-details
          single-line
          :style="{ width: '300px' }"
        ></v-text-field>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon @click="deleteDiscountCode(item)" small>mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- 創建和編輯促銷活動對話框 -->
    <v-dialog v-model="dialogPromotion" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ promotionDialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="currentPromotion.name" label="活動名稱" ></v-text-field>
          <v-text-field v-model="currentPromotion.discountRate" label="折扣百分比(請輸入0~1之間的值)" ></v-text-field>
          <!-- <v-text-field v-model="currentPromotion.discountRate" label="使用者ID" ></v-text-field> -->
          <v-menu v-model="promotionStartDateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="currentPromotion.expire"
                label="使用期限"
                v-bind="attrs"
              ></v-text-field>
            </template>
            <v-date-picker v-model="currentPromotion.startDate" @input="promotionStartDateMenu = false"></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="currentPromotion.userId"
            :items="userIds"
            label="輸入使用者ID"
            :style="{ width: '300px' }"
          ></v-text-field>
          <!-- <v-select
            v-model="currentPromotion.userId"
            :items="userIds"
            label="選擇用戶ID (可選)"
            @change="updateUserId"
            :style="{ width: '300px' }"
          ></v-select> -->
          <v-checkbox
            v-model="assignToAllUsers"
            label="分配給所有使用者"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closePromotionDialog">取消</v-btn>
          <v-btn @click="savePromotion">保存</v-btn>
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
          <v-text-field v-model="currentDiscountCode.name" label="活動名稱" ></v-text-field>
          <v-text-field v-model="currentDiscountCode.discount" label="折扣金額" type="number"></v-text-field>
          <v-menu v-model="discountCodeStartDateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="currentDiscountCode.expire"
                label="使用期限"
                v-bind="attrs"
              ></v-text-field>
            </template>
            <v-date-picker v-model="currentDiscountCode.startDate" @input="discountCodeStartDateMenu = false"></v-date-picker>
          </v-menu>
          <v-text-field
            v-model="currentDiscountCode.userId"
            :items="userIds"
            label="輸入使用者ID"
            :style="{ width: '300px' }"
          ></v-text-field>
          <v-checkbox
            v-model="assignToAllUsers"
            label="分配給所有使用者"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDiscountCodeDialog">取消</v-btn>
          <v-btn @click="saveDiscountCode">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue';
import axios from "@/plugins/axios";


const searchPromotions = ref('');
const searchDiscountCodes = ref('');
const promotions = ref([]);
const discountCodes = ref([]);
const discountCodeDialogTitle = ref('');
const dialogPromotion = ref(false);
const dialogDiscountCode = ref(false);
const promotionStartDateMenu = ref(false);
const discountCodeStartDateMenu = ref(false);
const promotionDialogTitle = ref('');
const currentPromotion = ref({ discountRate: '', expire: '' });
const currentDiscountCode = ref({ discount: '', expire: '' });
const userIds = ref([]);
const users = ref([]);
const assignToAllUsers = ref(false);
const currentPage = ref(0); // 注意：後端頁碼通常從0開始
const itemsPerPage = ref(5); // 每頁顯示的項目數量
const totalItems = ref(0); // 總項目數

const promotionHeaders = [
  { text: '折扣碼', value: 'id' },
  { text: '活動名稱', value: 'name' },
  { text: '折扣百分比', value: 'discountRate' },
  { text: '使用期限', value: 'expire' },
  { text: '創建日期', value: 'createdAt' },
  { text: '操作', value: 'actions', sortable: false }
];

const discountCodeHeaders = [
  { text: '優惠碼', value: 'id' },
  { text: '活動名稱', value: 'name' },
  { text: '折扣金額', value: 'discount' },
  { text: '使用期限', value: 'expire' },
  { text: '創建日期', value: 'createdAt' },
  { text: '操作', value: 'actions', sortable: false }
];

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user/find-users', {
          params: {
            pageSize: 1000
          }
        });
      console.log('Fetched users:', response.data);
      users.value = response.data.users || []; 
      // 確保從 response.data 中提取正確的用戶數組
      if (Array.isArray(response.data.users)) {
        userIds.value = response.data.users.map(user => user.id); // 提取用戶 ID
      } else {
        console.error('Fetched users is not an array', response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const updateUserId = (id) => {
    currentPromotion.value.userId = id; // 更新當前促銷活動的用戶 ID
  };
    const fetchPromotions = async () => {
    try {
      const response = await axios.get('/coupon/all');
      promotions.value = response.data.content.filter(promotion => promotion.discountRate).map(promotion => ({
        ...promotion,
        createdAt: formatDate(promotion.createdAt)
      }));
      totalItems.value = response.data.totalElements;
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

    const fetchDiscountCodes = async () => {
    try {
      const response = await axios.get('/coupon/all');
      discountCodes.value = response.data.content.filter(discountCode => discountCode.discount).map(discountCode => ({
        ...discountCode,
        createdAt: formatDate(discountCode.createdAt)
      }));
      totalItems.value = response.data.totalElements; 
    } catch (error) {
      console.error('Error fetching discount codes:', error);
    }
  };

const openCreatePromotionDialog = () => {
  promotionDialogTitle.value = '新增促銷活動';
  currentPromotion.value = { discountRate: '', expire: '' };
  assignToAllUsers.value = false;
  dialogPromotion.value = true;
};

const closePromotionDialog = () => {
  dialogPromotion.value = false;
};
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('zh-TW', options);
};
const savePromotion = async () => {
  try {
    if (!currentPromotion.value.discountRate || !currentPromotion.value.expire) {
      alert('折扣百分比和使用期限為必填項');
      return;
    }

    // 如果選擇分配給所有用戶，則遍歷所有用戶 ID
    if (assignToAllUsers.value) {
      for (const userId of userIds.value) {
        const postData = {
          discountRate: currentPromotion.value.discountRate,
          expire: currentPromotion.value.expire,
          userId: userId, // 這裡是逐個用戶 ID
          name:currentPromotion.value.name
        };

        console.log('Post data for user:', postData); // 打印每個用戶的請求數據

        const response = await axios.post('/coupon/', postData);
        console.log('促銷活動創建成功', response.data);
      }} else {
        // 只為當前選擇的用戶創建促銷活動
        const postData = {
          discountRate: currentPromotion.value.discountRate,
          expire: currentPromotion.value.expire,
          userId: currentPromotion.value.userId,// 這裡是選擇的用戶 ID
          name:currentPromotion.value.name 
        };

        console.log('Post data:', postData); // 打印請求數據

        const response = await axios.post('/coupon/', postData);
        console.log('促銷活動創建成功', response.data);
      }

        fetchPromotions(); // 更新促銷列表
        closePromotionDialog(); // 關閉對話框
      } catch (error) {
        console.error('保存促銷活動時出錯:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          alert(`錯誤: ${error.response.data.message || '無法保存促銷活動'}`);
        } else {
          alert('無法連接到伺服器或其他錯誤，請稍後再試。');
        }
      }
    };

  const deletePromotion = async (promotion) => {
    try {
      await axios.delete(`/coupon/${promotion.id}`);
      fetchPromotions();
    } catch (error) {
      console.error('刪除促銷活動時出錯:', error);
    }
  };

const openCreateDiscountCodeDialog = () => {
  discountCodeDialogTitle.value = '新增優惠碼';
  currentDiscountCode.value = { discount: '', expire: '' };
  dialogDiscountCode.value = true;
};

const closeDiscountCodeDialog = () => {
  dialogDiscountCode.value = false;
};

const saveDiscountCode = async () => {
  try {
    if (!currentDiscountCode.value.discount || !currentDiscountCode.value.expire) {
      alert('折扣金額和使用期限為必填項');
      return;
    }

    // 如果選擇分配給所有用戶，則遍歷所有用戶 ID
    if (assignToAllUsers.value) {
      for (const userId of userIds.value) {
        const postData = {
          discount: currentDiscountCode.value.discount,
          expire: currentDiscountCode.value.expire,
          userId: userId, // 這裡是逐個用戶 ID
          name:currentDiscountCode.value.name
        };

        console.log('Post data for user:', postData); // 打印每個用戶的請求數據

        const response = await axios.post('/coupon/', postData);
        console.log('促銷活動創建成功', response.data);
      }} else {
        // 只為當前選擇的用戶創建促銷活動
        const postData = {
          discount: currentDiscountCode.value.discount,
          expire: currentDiscountCode.value.expire,
          userId: currentDiscountCode.value.userId,// 這裡是選擇的用戶 ID
          name:currentDiscountCode.value.name 
        };

        console.log('Post data:', postData); // 打印請求數據

        const response = await axios.post('/coupon/', postData);
        console.log('促銷活動創建成功', response.data);
      }

        fetchDiscountCodes(); // 更新促銷列表
        closeDiscountCodeDialog(); // 關閉對話框
      } catch (error) {
        console.error('保存促銷活動時出錯:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          alert(`錯誤: ${error.response.data.message || '無法保存促銷活動'}`);
        } else {
          alert('無法連接到伺服器或其他錯誤，請稍後再試。');
        }
      }
    };

    const deleteDiscountCode = async (discountCode) => {
      try {
        await axios.delete(`/coupon/code/${discountCode.id}`);
        fetchDiscountCodes();
      } catch (error) {
        console.error('刪除優惠碼時出錯:', error);
      }
    };
    
        
    onMounted(() => {
      fetchUsers();
      fetchPromotions();
      fetchDiscountCodes();
    });
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>
