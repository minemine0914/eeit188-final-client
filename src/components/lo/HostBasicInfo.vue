<template>
    <v-container>
      <v-form ref="form" v-model="valid">
        <v-text-field
          label="姓名"
          v-model="host.name"
          :rules="[v => !!v || '姓名為必填']"
          required
        ></v-text-field>
  
        <v-text-field
          label="電子郵件"
          v-model="host.email"
          :rules="[v => !!v || '電子郵件為必填', v => /.+@.+\..+/.test(v) || '請輸入有效的電子郵件']"
          required
        ></v-text-field>
  
        <v-text-field
          label="電話號碼"
          v-model="host.phone"
          :rules="[v => !!v || '電話號碼為必填']"
          required
        ></v-text-field>
  
        <v-btn @click="nextStep" :disabled="!valid">下一步</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        valid: false,
        host: {
          name: '',
          email: '',
          phone: '',
        },
      };
    },
    methods: {
      nextStep() {
        if (this.$refs.form.validate()) {
          this.$router.push({
            name: 'HostProperty', // 進入房源信息頁面
            params: { hostInfo: this.host },
          });
        }
      },
    },
  };
  </script>

