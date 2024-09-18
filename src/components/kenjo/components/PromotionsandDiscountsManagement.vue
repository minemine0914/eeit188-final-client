<!--/*促銷和優惠管理	
	促銷活動:創建和管理促銷活動和折扣。
	優惠碼:生成和管理優惠碼，用於促銷和使用者激勵。

  移除修改功能
  userid不能是空值暫時無法新增
  抓取資料部份資料會出現問題
*/ -->
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
    >
      <template v-slot:header.id>
        <div class="text-center">名稱</div>
      </template>
      <template v-slot:item.image="{ item }">
        <div class="text-center">
          <v-card class="my-2" elevation="2" rounded>
            <v-img
              :src="`/assets/${item.image}`"
              height="64"
              width="70"
              cover
            ></v-img>
          </v-card>
        </div>
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
        <!-- <v-icon @click="editPromotion(item)" class="me-2" small>
          mdi-pencil
        </v-icon> -->
        <v-icon @click="deletePromotion(item)" small>
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- 優惠碼表格 -->
    <v-data-table
      v-model:search="searchDiscountCodes"
      :headers="discountCodeHeaders"
      :items="discountCodes"
      item-key="id"
    >
      <template v-slot:header.id>
        <div class="text-center">名稱</div>
      </template>
      <template v-slot:header.discount>
        <div class="text-center">折扣金額</div>
      </template>
      <template v-slot:header.expire>
        <div class="text-center">使用期限</div>
      </template>
      <template v-slot:header.createdAt>
        <div class="text-center">創建日期</div>
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
        <!-- <v-icon @click="editDiscountCode(item)" class="me-2" small>
          mdi-pencil
        </v-icon> -->
        <v-icon @click="deleteDiscountCode(item)" small>
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- 創建和編輯促銷活動對話框 -->
    <v-dialog v-model="dialogPromotion" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ promotionDialogTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="currentPromotion.id" label="活動名稱"></v-text-field>
          <v-text-field v-model="currentPromotion.discountRate" label="折扣百分比" type="number"></v-text-field>
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
          <v-menu v-model="promotionEndDateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="currentPromotion.createdAt"
                label="創建日期"
                v-bind="attrs"
                
              ></v-text-field>
            </template>
            <v-date-picker v-model="currentPromotion.endDate" @input="promotionEndDateMenu = false"></v-date-picker>
          </v-menu>
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
          <v-text-field v-model="currentDiscountCode.id" label="優惠碼"></v-text-field>
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
          <v-menu v-model="discountCodeEndDateMenu" :close-on-content-click="false">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="currentDiscountCode.createdAt"
                label="創建日期"
                v-bind="attrs"
                
              ></v-text-field>
            </template>
            <v-date-picker v-model="currentDiscountCode.endDate" @input="discountCodeEndDateMenu = false"></v-date-picker>
          </v-menu>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';

const searchPromotions = ref('');
const searchDiscountCodes = ref('');
const promotions = ref([]);
const discountCodes = ref([]);
const discountCodeDialogTitle = ref('');
const dialogPromotion = ref(false);
const dialogDiscountCode = ref(false);
const promotionStartDateMenu = ref(false);
const promotionEndDateMenu = ref(false);
const discountCodeStartDateMenu = ref(false);
const discountCodeEndDateMenu = ref(false);
const promotionDialogTitle = ref('');
const currentPromotion = ref({ name: '', discount: '', startDate: '', endDate: '' });
const currentDiscountCode = ref({ code: '', discount: '', startDate: '', endDate: '' });

const promotionHeaders = [
  { text: '活動名稱', value: 'id' },
  { text: '折扣百分比', value: 'discountRate' },
  { text: '使用期限', value: 'expire' },
  { text: '創建日期', value: 'createdAt' },
  { text: '操作', value: 'actions', sortable: false }
];

const discountCodeHeaders = [
  { text: '優惠碼', value: 'id' },
  { text: '折扣金額', value: 'discount' },
  { text: '使用期限', value: 'expire' },
  { text: '創建日期', value: 'createdAt' },
  { text: '操作', value: 'actions', sortable: false }
];

// 從 API 獲取數據
const fetchPromotions = async () => {
  try {
    const response = await axios.get('http://localhost:8080/coupon/all');
    const allPromotions = response.data.content || [];

     // 篩選指定欄位有值的資料
     promotions.value = allPromotions.filter(promotion => 
      promotion.discountRate !== null && 
      promotion.discountRate !== undefined &&
      promotion.discountRate !== ''
    );
    console.log(promotions.value );
  } catch (error) {
    console.error('Error fetching discountRate:', error);
  }
};

const fetchDiscountCodes = async () => {
  try {
    const response = await axios.get('http://localhost:8080/coupon/all');
    
    const allDiscountCodes = response.data.content || []; // 獲取所有折扣碼

    // 篩選指定欄位有值的資料
    discountCodes.value = allDiscountCodes.filter(discountCode => 
      discountCode.discount != null && 
      discountCode.discount != undefined &&
      discountCode.discount !==''
    );

    console.log(discountCodes.value);
  } catch (error) {
    console.error('Error fetching discount codes:', error);
  }
};

// 創建和編輯促銷活動
const openCreatePromotionDialog = () => {
  currentPromotion.value = {  discountRate: '', expire: '', createdAt: '' };
  promotionDialogTitle.value = '新增促銷活動';
  dialogPromotion.value = true;
};

const savePromotion = async () => {
  if (!currentPromotion.value.id || !currentPromotion.value.discountRate) {
    alert('促銷活動名稱和折扣百分比為必填項');
    return;
  }

  try {
    if (currentPromotion.value.id) {
      // 編輯促銷活動
      // const response = await axios.put(`http://localhost:8080/coupon/${currentPromotion.value.id}`, currentPromotion.value);
      // console.log('促銷活動更新成功', response.data);
      // const index = promotions.value.findIndex(p => p.id === currentPromotion.value.id);
      // if (index !== -1) {
      //   promotions.value[index] = { ...currentPromotion.value }; // 更新現有的促銷活動
      // }
    } else {
      // 創建新促銷活動
      const response = await axios.post('http://localhost:8080/coupon/', currentPromotion.value);
      console.log('促銷活動創建成功', response.data);
      promotions.value.push({ id: response.data.id, ...currentPromotion.value }); // 添加新促銷活動
    }
    closePromotionDialog(); // 關閉對話框
  } catch (error) {
    console.error('保存促銷活動時出錯:', error);
  }
};

// const editPromotion = (promotion) => {
//   currentPromotion.value = { ...promotion };
//   dialogPromotion.value = true;
// };

const deletePromotion = (promotion) => {
  const index = promotions.value.findIndex(p => p.id === promotion.id);
  discountCodeDialogTitle.value = '新增優惠碼';
  if (index !== -1) {
    promotions.value.splice(index, 1);
  }
};

const closePromotionDialog = () => {
  dialogPromotion.value = false;
};

// 創建和編輯優惠碼
const openCreateDiscountCodeDialog = () => {
  currentDiscountCode.value = {  discount: '', expire: '', createdAt: '' };
  dialogDiscountCode.value = true;
};

const saveDiscountCode = async () => {
  if (!currentDiscountCode.value.id || !currentDiscountCode.value.discount) {
    alert('優惠碼和折扣金額為必填項');
    return;
  }

  try {
    if (currentDiscountCode.value.id) {
      // 編輯優惠碼
      // const response = await axios.put(`http://localhost:8080/coupon/${currentDiscountCode.value.id}`, currentDiscountCode.value);
      // console.log('優惠碼更新成功', response.data);
      // const index = discountCodes.value.findIndex(d => d.id === currentDiscountCode.value.id);
      // if (index !== -1) {
      //   discountCodes.value[index] = { ...currentDiscountCode.value }; // 更新現有的優惠碼
      // }
    } else {
      // 創建新優惠碼
      const response = await axios.post('http://localhost:8080/coupon/', currentDiscountCode.value);
      console.log('優惠碼創建成功', response.data);
      discountCodes.value.push({ id: response.data.id, ...currentDiscountCode.value }); // 添加新優惠碼
    }
    closeDiscountCodeDialog(); // 關閉對話框
  } catch (error) {
    console.error('保存優惠碼時出錯:', error);
  }
};

const editDiscountCode = (discountCode) => {
  currentDiscountCode.value = { ...discountCode };
  dialogDiscountCode.value = true;
};

const deleteDiscountCode = (discountCode) => {
  const index = discountCodes.value.findIndex(d => d.id === discountCode.id);
  if (index !== -1) {
    discountCodes.value.splice(index, 1);
  }
};

const closeDiscountCodeDialog = () => {
  dialogDiscountCode.value = false;
};

// 在組件掛載時獲取數據
onMounted(() => {
  fetchPromotions();
  fetchDiscountCodes();
});
</script>

<style scoped>

</style>
