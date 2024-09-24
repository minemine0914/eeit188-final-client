<template>
  <BackgroundImage />
  <div class="content-container">
    <div class="conetnt">
      <UserDetail v-if="selectedBtn === 1" />
      <ResetPassword class="resetPassword" v-if="selectedBtn === 2" />
      <DeleteAdmin v-if="selectedBtn === 3" />
    </div>
    <div class="avatar-container">
      <Avatar />
      <div class="about">
        <About />
      </div>
      <v-btn
        :color="selectedBtn === 1 ? 'blue-grey-lighten-2' : ''"
        class="btn"
        @click="handleClick(1)"
      >
        管理者資料及修改
      </v-btn>
      <v-btn
        :color="selectedBtn === 2 ? 'blue-grey-lighten-2' : ''"
        class="btn"
        @click="handleClick(2)"
      >
        修改密碼
      </v-btn>
      <v-btn
        :color="selectedBtn === 3 ? 'blue-grey-lighten-2' : ''"
        class="btn"
        @click="handleClick(3)"
      >
        註銷帳號
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BackgroundImage from "@/components/user/BackgroundImage.vue";
import Avatar from "@/components/user/Avatar.vue";
import UserDetail from "@/components/user/UserDetail.vue";
import About from "@/components/user/About.vue";
import ResetPassword from "@/components/user/ResetPassword.vue";
import DeleteAdmin from "@/components/user/DeleteAdmin.vue";

const selectedBtn = ref(1);

function handleClick(index) {
  if (selectedBtn.value !== index) {
    selectedBtn.value = index;
  }
}
</script>

<style scoped>
.content-container {
  display: flex;
  justify-content: center;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 30px;
  margin-top: -80px;
  width: 250px;
}

.conetnt {
  width: 40%;
  margin: 50px;
}

.about {
  margin-top: 10px;
  margin-bottom: 30px;
}

.btn {
  margin-top: 10px;
}

.resetPassword {
  width: 300px;
  margin-left: 220px;
}
</style>
