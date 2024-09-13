
<!--
圖片上傳功能尚未修正
發送功能
-->
<template>
      <!-- 工具欄 -->
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
        <template v-slot:header.name>
          <div class="text-center">名稱</div>
        </template>
        <template v-slot:header.image>
        <div class="text-center">圖片</div>
      </template>
      <template v-slot:item.image="{ item }">

        <div class="text-center">
            
          <v-card class="my-2" elevation="2" rounded>
            <v-img
              :src="`/assets/banner01.webp`" 
              height="64"
              width="70"
              cover
            ></v-img>
          </v-card>
        </div>
      </template>
       
        <template v-slot:header.discount>
          <div class="text-center">折扣比率</div>
        </template>
        <template v-slot:header.startDate>
          <div class="text-center">使用開始日</div>
        </template>
        <template v-slot:header.endDate>
          <div class="text-center">使用截止日</div>
        </template>
        <template v-slot:top >
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
          <v-icon @click="editPromotion(item)" class="me-2" small>
            mdi-pencil
          </v-icon>
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
        <template v-slot:header.code>
          <div class="text-center">名稱</div>
        </template>
        <template v-slot:header.image>
        <div class="text-center">圖片</div>
      </template>
      <template v-slot:item.image="{ item }">
        <div class="text-center">
          <v-card class="my-2" elevation="2" rounded>
            <v-img
              :src="`data:image/png;base64,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`" 
              aspect-ratio="16/9" 
              contain
            ></v-img>
          </v-card>
        </div>
      </template>
        <template v-slot:header.discount>
          <div class="text-center">折扣金額</div>
        </template>
        <template v-slot:header.startDate>
          <div class="text-center">使用開始日</div>
        </template>
        <template v-slot:header.endDate>
          <div class="text-center">使用截止日</div>
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
          <v-icon @click="editDiscountCode(item)" class="me-2" small>
            mdi-pencil
          </v-icon>
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
            <v-text-field v-model="currentPromotion.name" label="活動名稱"></v-text-field>
            
            <v-text-field v-model="currentPromotion.discount" label="折扣百分比" type="number"></v-text-field>
            <v-menu v-model="promotionStartDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="currentPromotion.startDate"
                  label="開始日期"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="currentPromotion.startDate" @input="promotionStartDateMenu = false"></v-date-picker>
            </v-menu>
            <v-menu v-model="promotionEndDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="currentPromotion.endDate"
                  label="結束日期"
                  v-bind="attrs"
                  v-on="on"
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
            <v-text-field v-model="currentDiscountCode.code" label="優惠碼"></v-text-field>
            <v-text-field v-model="currentDiscountCode.discount" label="折扣金額" type="number"></v-text-field>
            <v-menu v-model="discountCodeStartDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="currentDiscountCode.startDate"
                  label="開始日期"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="currentDiscountCode.startDate" @input="discountCodeStartDateMenu = false"></v-date-picker>
            </v-menu>
            <v-menu v-model="discountCodeEndDateMenu" :close-on-content-click="false">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="currentDiscountCode.endDate"
                  label="結束日期"
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="currentDiscountCode.endDate" @input="discountCodeEndDateMenu = false"></v-date-picker>
            </v-menu>
            <!-- 文件上传和图片预览 -->
          <v-file-input
            v-model="discountCodeImage"
            label="選擇圖片"
            accept="image/*"
            @change="previewDiscountCodeImage"
          ></v-file-input>
          <v-img
            v-if="discountCodeImagePreviewUrl"
            :src="discountCodeImagePreviewUrl"
            height="100"
            width="100"
            contain
          ></v-img>
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
  import { ref, onMounted } from 'vue'
  
  const searchPromotions = ref('')
  const searchDiscountCodes = ref('')
  const promotions = ref([])
  const discountCodes = ref([])
  
  const dialogPromotion = ref(false)
  const dialogDiscountCode = ref(false)
  const promotionStartDateMenu = ref(false)
  const promotionEndDateMenu = ref(false)
  const discountCodeStartDateMenu = ref(false)
  const discountCodeEndDateMenu = ref(false)
  
  const currentPromotion = ref({ name: '', discount: '', startDate: '', endDate: '' })
  const currentDiscountCode = ref({ code: '', discount: '', startDate: '', endDate: '' })
  
  const promotionHeaders = [
    { text: '活動名稱', value: 'name' },
    { text: '圖片', value: 'image' },
    { text: '折扣百分比', value: 'discount' },
    { text: '開始日期', value: 'startDate' },
    { text: '結束日期', value: 'endDate' },
    { text: '操作', value: 'actions', sortable: false }
  ]
  
  const discountCodeHeaders = [
    { text: '優惠碼', value: 'code' },
    { text: '圖片', value: 'image' },
    { text: '折扣金額', value: 'discount' },
    { text: '開始日期', value: 'startDate' },
    { text: '結束日期', value: 'endDate' },
    { text: '操作', value: 'actions', sortable: false }
  ]
  
  // 初始化數據
  const initialize = () => {
    promotions.value = [
      { id: 1, name: '冬季促銷',image: "123", discount: '10', startDate: '2024-12-01', endDate: '2024-01-31' },
      { id: 2, name: '春季促銷',image: "123", discount: '15', startDate: '2024-02-01', endDate: '2024-03-31' }
    ]
  
    discountCodes.value = [
      { id: 1, code: 'welcome200',image: "123", discount: '200', startDate: '2024-12-01', endDate: '2099-12-31' },
      { id: 2, code: 'welcome200',image: "123", discount: '200', startDate: '2024-03-01', endDate: '2099-03-31' }
    ]
  }
  
  // 創建和編輯促銷活動
  const openCreatePromotionDialog = () => {
    currentPromotion.value = { name: '', discount: '', startDate: '', endDate: '' }
    dialogPromotion.value = true
  }
  
  const savePromotion = () => {
    if (!currentPromotion.value.name || !currentPromotion.value.discount) {
      alert('促銷活動名稱和折扣百分比為必填項')
      return
    }
  
    if (currentPromotion.value.id) {
      // 編輯促銷活動
      const index = promotions.value.findIndex(p => p.id === currentPromotion.value.id)
      if (index !== -1) {
        promotions.value[index] = { ...currentPromotion.value }
      }
    } else {
      // 創建新促銷活動
      currentPromotion.value.id = promotions.value.length + 1
      promotions.value.push({ ...currentPromotion.value })
    }
    closePromotionDialog()
  }
  
  const editPromotion = (promotion) => {
    currentPromotion.value = { ...promotion }
    dialogPromotion.value = true
  }
  
  const deletePromotion = (promotion) => {
    const index = promotions.value.findIndex(p => p.id === promotion.id)
    if (index !== -1) {
      promotions.value.splice(index, 1)
    }
  }
  
  const closePromotionDialog = () => {
    dialogPromotion.value = false
  }
  
  // 創建和編輯優惠碼
  const openCreateDiscountCodeDialog = () => {
    currentDiscountCode.value = { code: '', discount: '', startDate: '', endDate: '' }
    dialogDiscountCode.value = true
  }
  
  const saveDiscountCode = () => {
    if (!currentDiscountCode.value.code || !currentDiscountCode.value.discount) {
      alert('優惠碼和折扣金額為必填項')
      return
    }
  
    if (currentDiscountCode.value.id) {
      // 編輯優惠碼
      const index = discountCodes.value.findIndex(d => d.id === currentDiscountCode.value.id)
      if (index !== -1) {
        discountCodes.value[index] = { ...currentDiscountCode.value }
      }
    } else {
      // 創建新優惠碼
      currentDiscountCode.value.id = discountCodes.value.length + 1
      discountCodes.value.push({ ...currentDiscountCode.value })
    }
    closeDiscountCodeDialog()
  }
  
  const editDiscountCode = (discountCode) => {
    currentDiscountCode.value = { ...discountCode }
    dialogDiscountCode.value = true
  }
  
  const deleteDiscountCode = (discountCode) => {
    const index = discountCodes.value.findIndex(d => d.id === discountCode.id)
    if (index !== -1) {
      discountCodes.value.splice(index, 1)
    }
  }
  
  const closeDiscountCodeDialog = () => {
    dialogDiscountCode.value = false
  }
  

  const previewImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target.result
      currentPromotion.value.image = file.name // 只是將文件名保存到數據中
    }
    reader.readAsDataURL(file)
  }
}

  const previewDiscountCodeImage = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      discountCodeImagePreviewUrl.value = e.target.result
      currentDiscountCode.value.image = file.name // 只是將文件名保存到數據中
    }
    reader.readAsDataURL(file)
  }
}
  onMounted(() => {
    initialize()
  })
  </script>
  
  <style scoped>
  
  </style>
  