<template>
  <v-card class="mx-auto" color="brown-lighten-3" id="card" width="400">
    <template v-slot:title>
      <span class="font-weight-black">註銷用戶</span>
    </template>

    <v-card-text class="bg-yellow-darken-3 pt-4">
      注意： 帳號永久刪除之後將無法復原
    </v-card-text>
    <v-btn class="btn" color="red-darken-4" @click="handleClick"
      >刪除帳號</v-btn
    >
  </v-card>
</template>
<script setup>
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const { deleteUser, logout } = userStore;
const router = useRouter();

const handleClick = async () => {
  const confirmLogout1 = window.confirm("請確認是否要刪除帳號");
  let confirmLogout2 = false;

  if (confirmLogout1) {
    confirmLogout2 = window.confirm(
      "再次提醒，帳號永久刪除後將無法復原，請確認是否要刪除帳號"
    );
  }

  if (confirmLogout2) {
    alert("帳號已刪除！");
    await deleteUser();
    logout();
  }
};
</script>

<style scoped>
#card {
  text-align: center;
}

.btn {
  margin: 20px;
}
</style>
