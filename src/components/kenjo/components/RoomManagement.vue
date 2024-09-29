<!--房間管理	RoomManagement
	房間類型管理:管理不同類型的房間，包括設施、價格、描述等。
	房間設施:管理房間內的各種設施和設備，如Wi-Fi、空調等。

  房屋類型按照實際狀況調整
-->
<template>
  <v-toolbar flat>
        <v-toolbar-title>房間管理</v-toolbar-title>
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
    show-expand
  >
    <template v-slot:item.show="{ item }">    <!--狀態欄位-->
    <v-chip 
      :color="getStatusColor(item.show)"
      size="small"
      class="text-uppercase">
      {{ getStatusText(item.show) }}
    </v-chip>
  </template>
  <!-- <template v-slot:item.category="{ category }">    類型欄位 -->
    <!-- <v-chip 
      :color="getCategoryColor(item.category)"
      size="small"
      class="text-uppercase">
      {{ getCategoryText(item.category) }}
    </v-chip> -->
  <!-- </template> -->

    <template v-slot:expanded-row="{ columns, item }" >
      <tr>
        <td :colspan="columns.length">           
         所在國家： {{ item.country }},<br>
         基本設施：
         客廳: {{ item.livingDiningRoom }}間、         
         房間: {{ item.bedroom }}間、
         衛生間: {{ item.restroom }}間、
         淋浴間: {{ item.bathroom }}間、
          {{ getkitchenText(item.kitchen) }}、
          {{ getbalconyText(item.balcony) }}<br>
         公共設施：<div v-for="postulate in item.postulates" :key="postulate.id">
          {{ postulate.name }} </div>
        </td>
      </tr>
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
                <v-radio label="上架" :value="true"></v-radio>
                <v-radio label="下架" :value="false"></v-radio>
                <!-- <v-radio label="審核中" :value="null"></v-radio> -->
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
import axios from 'axios';

export default {
  data () {
    return {
      search:"",
      expanded: [],
      dialog: false,
      selectedStatus: null,
      currentItem: null,
      desserts: [],
      dessertHeaders: [
          //標題
        {
          title: '房屋名稱',align: 'start',sortable: false,key: 'name',
        },
        { title: '房東', key: 'userName' },
        { title: '地址 ', key: 'address' },
        { title: '房屋類型 ', key: 'category' },
        { title: '狀態 ', key: 'show' },
        { title: '編輯', value: 'actions', sortable: false }
      ],
      
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





    getStatusColor(show) {
      switch (show) {
        case true:
          return 'green';
        case false:
          return 'orange';
        case null:
          return 'blue';  
        default:
          return 'red';
      }
    },
    getStatusText(show) {
      switch (show) {
        case true:
          return '刊登中';
        case null:
          return '審核中';
        case false:
          return '下架中';  
        default:
          return '確認中';
      }
    },

    // getCategoryColor(category) {
    //   switch (category) {
    //     case "villa":
    //       return 'green'; 
    //     case "guesthouse":
    //       return 'orange'; 
    //     case "hotel":
    //       return 'blue'; 
    //     case "inn":
    //       return 'yellow'; 
    //     case "apartment":
    //       return 'gray'; 
    //     case "campground":
    //       return 'magenta'; 
    //     default:
    //         return 'red'; 
    //   }
    // },
    // getCategoryText(category) {
    //     switch (category) {
    //       case "villa":
    //         return '獨棟別墅'; 
    //       case "guesthouse":
    //         return '民宿'; 
    //       case "hotel":
    //         return '飯店'; 
    //       case "inn":
    //         return '旅館'; 
    //       case "apartment":
    //         return '公寓'; 
    //       case "campground":
    //         return '露營地'; 
    //       default:
    //         return '確認中'; 
    //     }
    //   },

    
    getkitchenText(kitchen) {
      switch (kitchen) {
        case true:
          return '有廚房';
        case false:
          return '無廚房';
        default:
          return '有無廚房待確認';
      }
    },
    getbalconyText(balcony) {
      switch (balcony) {
        case true:
          return '有陽台';
        case false:
          return '無陽台';
        default:
          return '有無陽台待確認';
      }
    },
    async updateStatus() {
      try {
        const response = await axios.put(`http://localhost:8080/house/${this.currentItem.id}`, {
          show: this.selectedStatus
        });

        if (response.status === 200) {
          this.currentItem.show = this.selectedStatus; 
          this.dialog = false; 
        }
      } catch (error) {
        console.error('Error updating status:', error);
        
      }
    },

    openDialog(item) {
      this.currentItem = item; 
      this.selectedStatus = item.show; 
      this.dialog = true; 
    },
    resetDialog() {
        this.selectedStatus = null; 
        this.selectedStatus = false; 
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

