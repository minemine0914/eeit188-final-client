<!--房間管理	RoomManagement
	房間類型管理:管理不同類型的房間，包括設施、價格、描述等。
	房間設施:管理房間內的各種設施和設備，如Wi-Fi、空調等。
-->
<template>
    <v-data-table
      v-model:expanded="expanded"
      :headers="dessertHeaders"
      :items="desserts"
      item-value="name"
      show-expand
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>房間管理</v-toolbar-title>
        </v-toolbar>
      </template>
      <template v-slot:item.show="{ item }">
      <v-chip 
        :color="getStatusColor(item.show)"
        size="small"
        class="text-uppercase">
        {{ getStatusText(item.show) }}
      </v-chip>
    </template>

      <template v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length">           
           所在國家： {{ item.country }},<br>
           基本設施：
           客廳: {{ item.livingDiningRoom }}間、         
           房間: {{ item.bedroom }}間、
           衛生間: {{ item.restroom }}間、
           淋浴間: {{ item.bathroom }}間、
           廚房: {{ item.kitchen }}間、
           陽台: {{ item.balcony }}間<br>
           公共設施：
            {{ item.HousePostulateId1 }}
            {{ item.HousePostulateId2 }}
            {{ item.HousePostulateId3 }}
            {{ item.HousePostulateId4 }}
            {{ item.HousePostulateId5 }}
            {{ item.HousePostulateId6 }}


            
            
          </td>
        </tr>
      </template>
    </v-data-table>
  </template>

<script>
  export default {
    data () {
      return {
        expanded: [],
        dessertHeaders: [
            //標題
          {
            title: '房屋名稱',
            align: 'start',
            sortable: false,
            key: 'name',
          },
          { title: '房東', key: 'UserId' },
          { title: '地址 ', key: 'address' },
          { title: '房屋類型 ', key: 'category' },
          { title: '狀態 ', key: 'show' },
        
        ],
        desserts: [
          {
            name: 'xxx',
            UserId:"༼ つ ◕_◕ ༽つ",
            address:"台北市xxx",
            category: "公寓",
            show:0,             //狀態
            country:"Taiwan",         // 國家
            price: 999 ,        // 初始價格
            livingDiningRoom:1, // 客廳
            bedroom:  2,        // 房間
            restroom:2,         // 衛生間 (馬桶)
            bathroom:3,         // 淋浴間
            kitchen:0,          //廚房
            balcony:1,          //陽台
            //----------//
            
            //公共設施
            HousePostulateId1:"健身房",
            HousePostulateId2:"游泳池",
            HousePostulateId3:"蒸氣室",

          },
           {
            name: 'mmm',
            UserId:"༼ つ ◕_◕ ༽つ",
            address:"台北市xxx",
            category: "公寓",
            show:1,             //狀態
            country:"Taiwan",         // 國家
            price: 999 ,        // 初始價格
            livingDiningRoom:1, // 客廳
            bedroom:  2,        // 房間
            restroom:2,         // 衛生間 (馬桶)
            bathroom:3,         // 淋浴間
            kitchen:0,          //廚房
            balcony:1,          //陽台
            //----------//
            
            //公共設施
            HousePostulateId1:"健身房",
            HousePostulateId2:"游泳池",
            HousePostulateId3:"蒸氣室",
            HousePostulateId4:"洗衣機",

          },
          {
            name: 'nnn',
            UserId:"(╯°□°）╯︵ ┻━┻",
            address:"台北市xxx",
            category: "民寓",
            show:6,             //狀態
            country:"Taiwan",         // 國家
            price: 999 ,        // 初始價格
            livingDiningRoom:1, // 客廳
            bedroom:  2,        // 房間
            restroom:2,         // 衛生間 (馬桶)
            bathroom:3,         // 淋浴間
            kitchen:0,          //廚房
            balcony:1,          //陽台
            //----------//
            
            //公共設施
            HousePostulateId1:"健身房",
            HousePostulateId2:"游泳池",
            HousePostulateId3:"",

          },
        ],
      }
    },
    methods: {
    getStatusColor(show) {
      switch (show) {
        case 1:
          return 'green';
        case null:
          return 'orange';
        case 0:
          return 'orange';
        default:
          return 'red';
      }
    },
    getStatusText(show) {
      switch (show) {
        case 1:
          return '刊登中';
        case 0:
          return '進行中';
        default:
          return '確認中';
      }
    }
  },
  }
</script>

<style scoped>
</style>


<!--房間管理	RoomManagement
	房間類型管理:管理不同類型的房間，包括設施、價格、描述等。
	房間設施:管理房間內的各種設施和設備，如Wi-Fi、空調等。
-->