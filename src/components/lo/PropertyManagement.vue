<template>
  <v-container>
    <!-- 統計卡片 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>可用房源</v-card-title>
          <v-card-text>{{ availableProperties }} 間</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>已預訂房源</v-card-title>
          <v-card-text>{{ bookedProperties }} 間</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>總房源數</v-card-title>
          <v-card-text>{{ totalProperties }} 間</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 新增房源按鈕 -->
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="navigateToAddProperty">新增房源</v-btn>
      </v-col>
    </v-row>

    <!-- 房源管理表格 -->
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="properties" item-value="name" class="elevation-1">
          <template v-slot:item.actions="{ item }">
            <v-btn color="primary" @click="navigateToEditProperty(item)">編輯</v-btn>
            <v-btn color="error" @click="deleteItem(item)">刪除</v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      availableProperties: 5,
      bookedProperties: 2,
      totalProperties: 7,
      headers: [
        { text: '名稱', value: 'name' },
        { text: '狀態', value: 'status' },
        { text: '操作', value: 'actions', sortable: false },
      ],
      properties: [
        { name: '豪華套房', status: '可預訂' },
        { name: '經濟房', status: '已預訂' },
      ],
    };
  },
  methods: {
    navigateToAddProperty() {
      this.$router.push({ name: 'AddProperty' });
    },
    navigateToEditProperty(item) {
      this.$router.push({ name: 'EditProperty', params: { id: item.name } });
    },
    deleteItem(item) {
      console.log('刪除房源:', item.name);
    },
  },
};
</script>
