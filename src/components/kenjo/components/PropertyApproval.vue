
<!--/*房源審核	
	待審核房源:顯示所有待審核的房源申請。
	房源審核:處理房源審核請求，批准或拒絕房源發布。
  //check 判斷欄位 >>需要新增



*/ -->
<template>
    <br>
    <v-toolbar flat>
          <v-toolbar-title>審核頁面</v-toolbar-title>
    </v-toolbar>
    <div class="text-center">
    <v-card flat>
      <v-card-title class="d-flex align-center pe-2">
        <v-spacer></v-spacer>
  
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
      </v-card-title>
  
      <v-divider></v-divider>
      <v-data-table 
      v-model:search="search" 
      :items="items"
      :items-per-page="itemsPerPage"
      :items-per-page-options="[2 , 4, 6, 8]"
      >
        <template v-slot:header.check>
          <div class="text-center">狀態</div>
        </template>
        <template v-slot:header.name>
          <div class="text-center">房屋名稱</div>
        </template>
        <template v-slot:header.category>
          <div class="text-center">類型</div>
        </template>
        <template v-slot:header.price>
          <div class="text-center">價格</div>
        </template>
        <template v-slot:header.image>
          <div class="text-center">圖片</div>
        </template>
        <template v-slot:header.UserId>
          <div class="text-center">擁有者</div>
        </template>
        <template v-slot:header.createdAt>
          <div class="text-center">提交時間</div>
        </template>
        <template v-slot:header.address>
          <div class="text-center">地址</div>
        </template>
        
        <!--圖片
        <template v-slot:item.image="{ item }">
            <div class="text-center">
          <v-card class="my-2" elevation="2" rounded>
            <v-img
              :src="`@/assets/${item.image}`"
              height="64"
              cover
            ></v-img>
          </v-card>
          </div>
        </template>
        -->
        <!--類型-->
        <template v-slot:item.category="{ item }">
            <div class="text-center">
            <v-chip
              color="orange-darken-3"
              text-color="white"
              size="small"
            >
              {{ item.category }}
            </v-chip>
          </div>
        </template>
        <!--狀態-->
        <template v-slot:item.check="{ item }">
          <div class="text-center">
            <v-chip
              :color="getStatusColor(item.check)"
              :text="getStatusText(item.check)"
              class="text-uppercase"
              size="small"
              label
            ></v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    
</div>

  </template>


<script>
import { getDatasetAtEvent } from 'vue-chartjs';



  export default {
    data () {
      return {
        search: '',
        items: [
          {
            name: 'xxx',
            UserId:"༼ つ ◕_◕ ༽つ",
            address:"台北市xxx",
            // image: "123",
            // price: 699.99,
            category: "公寓",
            createdAt:"2024-09-10",
            check: 1,
          },
          {
            name: 'xxx',
            UserId:"(❁´◡`❁)",
            address:"新北市xxx",
            // image: 'banner01.webp',
            // price: 799.99,
            category: "民宿",
            createdAt:"2024-09-07",
            check: 1,
          },
          {
            name: 'xxxx',
            UserId:"（￣︶￣）↗　",
            address:"台東市xxx",
            // image: 'banner01.webp',
            // price: 649.99,
            category: "飯店",
            createdAt:"2024-09-08",
            id:234,
            check: 1,
          },
          {
            name: 'xx',
            UserId:"(￣y▽￣)╭ Ohoh..",
            address:"台中市xxx",
            // image: 'banner01.webp',
            // price: 1499.99,
            category: "公寓",
            createdAt:"2024-09-09",
            check: 0,
          },
          {
            name: 'xxx',
            UserId:"(╯°□°）╯︵ ┻━┻",
            address:"台南市nnn",
            // image: 'banner01.webp',
            // price: 299.99,
            category: "露營地",
            createdAt:"2024-09-11",
            check: null,
          },
        ],
      };
    },
    methods: {
    getStatusColor(check) {
      switch (check) {
        case 1:
          return 'green';
        case null:
          return 'orange';
        case 0:
          return 'red';
        default:
          return 'gray';
      }
    },
    getStatusText(check) {
      switch (check) {
        case 1:
          return '審核完成';//show = 1
        case null:
          return '待審核';//show = null
        case 0:
          return '審核拒絕';//show = 0
        default:
          return '未知狀態';
      }
    }
  },
};
  


  
</script>

<style scoped>
</style>
