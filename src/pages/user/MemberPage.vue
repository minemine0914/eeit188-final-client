<template>
  <BackgroundImage />
  <div class="content-container">
    <div class="conetnt">
      <UserDetail v-if="selectedBtn === 1" />
      <ResetPassword class="resetPassword" v-if="selectedBtn === 2" />
      <Coupon class="coupon" v-if="selectedBtn === 4" />
      <UserCollection v-if="selectedBtn === 5" />
      <Discuss v-if="selectedBtn === 6" />
      <DeleteUser v-if="selectedBtn === 7" />

    </div>
    <div class="avatar-container">
      <Avatar />
      <div class="about">
        <About />
      </div>
      <div class="btn-box">
        <v-btn
          :color="selectedBtn === 1 ? 'blue-grey-lighten-2' : ''"
          class="btn"
          @click="handleClick(1)"
        >
          用戶資料及修改
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
          管理房源
        </v-btn>


        <v-btn
          :color="selectedBtn === 4 ? 'blue-grey-lighten-2' : ''"
          class="btn"
          @click="handleClick(4)"
        >
          優惠券
        </v-btn>

        <v-btn
          :color="selectedBtn === 5 ? 'blue-grey-lighten-2' : ''"
          class="btn"
          @click="handleClick(5)"
        >
          房源收藏
        </v-btn>

        <v-btn
          :color="selectedBtn === 6 ? 'blue-grey-lighten-2' : ''"
          class="btn"
          @click="handleClick(6)"
        >
          您的評論
        </v-btn>

        <v-btn
          :color="selectedBtn === 7 ? 'blue-grey-lighten-2' : ''"
          class="btn"
          @click="handleClick(7)"
        >
          註銷帳號
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BackgroundImage from "@/components/user/BackgroundImage.vue";
import Avatar from "@/components/user/Avatar.vue";
import UserDetail from "@/components/user/UserDetail.vue";
import Coupon from "@/components/user/Coupon.vue";
import UserCollection from "@/components/user/UserCollection.vue";
import Discuss from "@/components/user/Discuss.vue";
import About from "@/components/user/About.vue";
import ResetPassword from "@/components/user/ResetPassword.vue";
import DeleteUser from "@/components/user/DeleteUser.vue";

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

.btn-box {
  padding: 10px;
  display: flex;
  flex-direction: column;
  max-height: 250px;
  overflow-y: auto;
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
  margin-top: 20px;
}

.resetPassword {
  width: 300px;
  margin-left: 220px;
}
</style>
