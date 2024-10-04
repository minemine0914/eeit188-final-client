<template>
  <v-card class="mx-auto" color="grey-lighten-3" id="card" width="400">
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
import Swal from "@/plugins/sweetalert2";

const userStore = useUserStore();
const { deleteUser, logout } = userStore;

const handleClick = async () => {
  Swal.fire({
    title: "請確認是否要刪除帳號？",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "再次提醒，帳號永久刪除後將無法復原，請確認是否要刪除帳號？",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          try {
            deleteUser();
            Swal.fire({
              title: "帳號已刪除！",
              icon: "success",
            });
            logout();
          } catch (error) {
            Swal.fire({
              title: "帳號刪除失敗，請重新操作一次",
              icon: "error",
            });
            console.error(error);
          }
        }
      });
    }
  });
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
