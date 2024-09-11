<template>


    <v-container>
      <!-- 新增房源按鈕 -->
      <v-row justify="end">
        <v-btn color="primary" @click="openDialog('add')">新增房源</v-btn>
      </v-row>
  
      <!-- 房源卡片展示區 -->
      <v-row>
        <v-col v-for="property in properties" :key="property.id" cols="12" md="4">
          <v-card>
            <v-img :src="property.image" height="200px"></v-img>
            <v-card-title>{{ property.name }}</v-card-title>
            <v-card-subtitle>價格: {{ property.price }} 元/晚</v-card-subtitle>
            <v-card-text>
              類型: {{ property.type }}<br />
              地址: {{ property.location }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="blue" @click="openDialog('edit', property)">編輯</v-btn>
              <v-btn color="red" @click="deleteProperty(property.id)">刪除</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 編輯/新增 房源的對話框 -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>{{ dialogMode === 'add' ? '新增' : '編輯' }}房源</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field v-model="editedProperty.name" label="房源名稱"></v-text-field>
              <v-text-field v-model="editedProperty.price" label="價格"></v-text-field>
              <v-text-field v-model="editedProperty.type" label="類型"></v-text-field>
              <v-text-field v-model="editedProperty.location" label="地址"></v-text-field>
              <v-text-field v-model="editedProperty.image" label="圖片連結"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue" @click="saveProperty">保存</v-btn>
            <v-btn @click="closeDialog">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: false,
        dialogMode: 'add', // 追蹤是否是編輯或新增模式
        properties: [], // 房源資料
        editedProperty: {
          id: null,
          name: '',
          price: '',
          type: '',
          location: '',
          image: ''
        }
      };
    },
    methods: {
      openDialog(mode, property = null) {
        this.dialogMode = mode;
        if (mode === 'edit' && property) {
          this.editedProperty = { ...property };
        } else {
          this.editedProperty = { id: null, name: '', price: '', type: '', location: '', image: '' };
        }
        this.dialog = true;
      },
      closeDialog() {
        this.dialog = false;
      },
      saveProperty() {
        if (this.dialogMode === 'add') {
          // 新增房源
          this.properties.push({ ...this.editedProperty, id: Date.now() });
        } else {
          // 更新現有房源
          const index = this.properties.findIndex(p => p.id === this.editedProperty.id);
          if (index !== -1) {
            this.properties[index] = { ...this.editedProperty };
          }
        }
        this.closeDialog();
      },
      deleteProperty(id) {
        this.properties = this.properties.filter(p => p.id !== id);
      }
    },
    mounted() {
      // 模擬從 API 加載資料
      this.properties = [
        { id: 1, name: '豪華別墅', price: 5000, type: '別墅', location: '台北', image: 'https://example.com/villa.jpg' },
        { id: 2, name: '舒適公寓', price: 2000, type: '公寓', location: '高雄', image: 'https://example.com/apartment.jpg' },
        { id: 3, name: '浪漫民宿', price: 3000, type: '民宿', location: '台中', image: 'https://example.com/guesthouse.jpg' },
        { id: 4, name: '浪漫民宿', price: 3000, type: '民宿', location: '台中', image: 'https://example.com/guesthouse.jpg' },
        { id: 5, name: '浪漫民宿', price: 3000, type: '民宿', location: '台中', image: 'https://example.com/guesthouse.jpg' }
      ];
    }
  };
  </script>
  
  <style scoped>
  /* 你可以在這裡自定義樣式 */
  </style>
  