<!--/*房源審核	
	待審核房源:顯示所有待審核的房源申請。
	房源審核:處理房源審核請求，批准或拒絕房源發布。
  //check 判斷欄位 >>需要新增
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
    <template v-slot:item.check="{ item }">    <!--狀態欄位-->
    <v-chip 
      :color="getStatusColor(item.check)"
      size="small"
      class="text-uppercase">
      {{ getStatusText(item.check) }}
    </v-chip>
  </template>
  </v-data-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      search:"",
      expanded: [],
      dessertHeaders: [
          //標題
        {
          title: '房屋名稱',align: 'start',sortable: false,key: 'name',
        },
        { title: '房東', key: 'userName' },
        { title: '地址 ', key: 'address' },
        { title: '房屋類型 ', key: 'category' },
        { title: '提交時間 ', key: 'createdAt' },
        { title: '狀態 ', key: 'check' },
      
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


  methods: {
    
    
    async fetchOrder() {
      try {
        const response = await axios.get('http://localhost:8080/house/all', {
          params: {
            pageNo: 0,
            pageSize: 1000
          }
        });

        console.log('API response:', response); // 詳細輸出整個響應

        if (response.status === 200) {
          if (response.data && Array.isArray(response.data.content)) {
            this.desserts = response.data.content; 
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

    getStatusColor(check) {
      switch (check) {
        case 1:
          return 'green';
        case 0:
          return 'orange';
        case 0:
          return 'orange';
        default:
          return 'red';
      }
    },
    getStatusText(check) {
      switch (check) {
        case 1:
          return '刊登中';
        case 0:
          return '審核中';
        default:
          return '確認中';
      }
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

