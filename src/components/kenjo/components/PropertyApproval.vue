<!--/*房源審核	
	待審核房源:顯示所有待審核的房源申請。
	房源審核:處理房源審核請求，批准或拒絕房源發布。
  //review 判斷欄位 >>需要新增
*/ -->
<template>
  <v-toolbar flat>
        <v-toolbar-title>房源審核</v-toolbar-title>
        <v-text-field
        v-model="search"
        density="compact"
        label="查詢"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        :style="{ width: '100px' }"
      ></v-text-field>
  </v-toolbar>
  
  <div >
  <v-data-table
  v-model:search="search" 
  
    v-model:expanded="expanded"
    :headers="dessertHeaders"
    :items="desserts"
    item-value="name"
  >
  <template v-slot:top>
      
    </template>
    <template v-slot:item.review="{ item }">    <!--狀態欄位-->
    <v-chip 
      :color="getStatusColor(item.review)"
      size="small"
      class="text-uppercase">
      {{ getStatusText(item.review) }}
    </v-chip>
    <!-- <v-btn @click="openDialog(item)" small color="primary">
        修改
    </v-btn> -->
  </template>
  <template v-slot:item.actions="{ item }">
        <v-icon @click="openDialog(item)" class="me-2" small>
          mdi-pencil
        </v-icon>
  </template>

  </v-data-table>
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
  data () {
    return {
      search:"",
      expanded: [],
      dialog: false,
      selectedStatus: null,
      currentItem: null,
      dessertHeaders: [
          //標題
        {
          title: '房屋名稱',align: 'start',sortable: false,key: 'name',
        },
        { title: '房東', key: 'userName' },
        { title: '地址 ', key: 'address' },
        { title: '房屋類型 ', key: 'category' },
        { title: '提交時間 ', key: 'createdAt' },
        { title: '狀態 ', key: 'review' },
        { title: '編輯', value: 'actions', sortable: false }
      
      ],
      desserts: [],
    }
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
    }
  },

  created() {
    this.fetchOrder();
  },
  watch: {
      dialog(val) {
        if (!val) {
          this.selectedStatus = null; 
        }
      },
    },

  methods: {
    async fetchOrder() {
      try {
        const response = await axios.get('/house/all', {
          params: {
            page: 0,
            limit: 1000,
            order: "createdAt",
            dir: true,
          },
        });

        console.log('API response:', response); // 詳細輸出整個響應

        if (response.status === 200) {
          if (response.data && Array.isArray(response.data.content)) {
            this.desserts =  response.data.content.map(desserts => ({
            ...desserts,
            createdAt: this.formatDate(desserts.createdAt) 
          })); 
            console.log('Data successfully loaded:', this.desserts); // 確認資料
          } else {
            console.error('API response is not in expected format:', response.data);
            this.desserts = [];
          }
        } else {
          console.error('API response status is not OK:', response.status);
        }
      } catch (error) {
        console.error('Error in fetchOrder:', error);
        // 顯示錯誤提示給用戶
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      },
      getStatusColor(review) {
        switch (review) {
          case null: return 'orange'; // 待審核
          case true: return 'green'; // 審核通過
          case false: return 'red'; // 審核失敗
          default: return 'grey'; // 未知狀態
        }
      },
      resetDialog() {
        this.selectedStatus = null; // 重設狀態
        this.dialog = false; // 關閉對話框
      },
    getStatusText(review) {
      switch (review) {
        case null:
          return '待審核';
        case true:
          return '審核通過';
        case false:
          return '審核失敗';
        default:
          return '確認中';
      }
    },

    async updateStatus() {
      try {
        const response = await axios.put(`/house/${this.currentItem.id}`, {
          review: this.selectedStatus
        });

        if (response.status === 200) {
          this.currentItem.review = this.selectedStatus; 
          this.dialog = false; 
        }
      } catch (error) {
        console.error('Error updating status:', error);
        
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

}
</script>

<style scoped>
.title-center {
display: flex;
justify-content: center;
flex-grow: 1;
}
</style>

