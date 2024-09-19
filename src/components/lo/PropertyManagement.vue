<template>
  <v-container>
    <!-- 統計卡片 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>可用房源</v-card-title>
          <v-card-text>{{ propertyStore.availableProperties }} 間</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>已預訂房源</v-card-title>
          <v-card-text>{{ propertyStore.bookedProperties }} 間</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>總房源數</v-card-title>
          <v-card-text>{{ propertyStore.totalProperties }} 間</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 房源管理表格 -->
    <v-row>
      <v-col cols="12">
        <v-data-table :items="propertyStore.properties" :headers="headers">
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" @click="editProperty(item)">編輯</v-btn>
            <v-btn color="error" @click="deleteItem(item)">刪除</v-btn>
          </template>
        </v-data-table>
      </v-col>

      <!-- 編輯表單，根據 selectedProperty 顯示 -->
      <v-col cols="12" v-if="showEditForm">
        <EditProperty :id="selectedProperty.id" @close="showEditForm = false" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { usePropertyStore } from '@/stores/propertyStore';
import EditProperty from '@/components/lo/EditProperty.vue';

export default {
  components: {
    EditProperty,
  },
  data() {
    return {
      headers: [
        { text: '房源名稱', value: 'name' },
        { text: '狀態', value: 'status' },
        { text: '操作', value: 'actions', sortable: false },
      ],
      selectedProperty: null,
      showEditForm: false,
    };
  },
  computed: {
    propertyStore() {
      return usePropertyStore(); // 使用 Pinia 的 store
    },
  },
  mounted() {
    this.propertyStore.fetchProperties(); // 當組件加載時獲取房源數據
  },
  methods: {
    editProperty(item) {
      this.selectedProperty = item;
      this.showEditForm = true;
    },
    deleteItem(item) {
      this.propertyStore.deleteProperty(item.id); // 調用 Pinia 的 action 進行刪除
    },
  },
};
</script>
