<template>
  <v-container>
    <h2>上架第一間房源</h2>
    <p>房東: {{ host.name }} - {{ host.email }}</p>

    <v-form ref="form" v-model="valid">
      <v-text-field
        label="房源名稱"
        v-model="property.name"
        :rules="[v => !!v || '房源名稱為必填']"
        required
      ></v-text-field>

      <v-text-field
        label="地址"
        v-model="property.address"
        :rules="[v => !!v || '地址為必填']"
        required
      ></v-text-field>

      <v-text-field
        label="價格"
        v-model="property.price"
        :rules="[v => !!v || '價格為必填']"
        required
        type="number"
      ></v-text-field>

      <v-btn @click="submit" :disabled="!valid">提交</v-btn>
    </v-form>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      property: {
        name: '',
        address: '',
        price: '',
      },
      host: {
        name: '',
        email: '',
        phone: '',
      },
    };
  },
  mounted() {
    this.host = this.$route.params.hostInfo; // 獲取來自上一頁的房東資料
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        console.log('房東資料:', this.host);
        console.log('房源資料:', this.property);
        // 提交房東及房源資料的邏輯
      }
    },
  },
};
</script>
