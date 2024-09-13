<template>
  <BackgroundImage />
  <div class="content-container">
    <div class="conetnt">
      <UserDetail v-show="selectedBtn === 1" @userDetailChanged="reload" />
      <Coupon v-show="selectedBtn === 2" />
      <UserCollection v-show="selectedBtn === 3" />
      <Discuss v-show="selectedBtn === 4" />
    </div>
    <div class="avatar-container">
      <Avatar :key="avatarKey" @userAvatarChange="reload" />
      <div class="about">
        <About :key="aboutKey" />
      </div>
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
        優惠券
      </v-btn>

      <v-btn
        :color="selectedBtn === 3 ? 'blue-grey-lighten-2' : ''"
        class="btn"
        @click="handleClick(3)"
      >
        房源收藏
      </v-btn>

      <v-btn
        :color="selectedBtn === 4 ? 'blue-grey-lighten-2' : ''"
        class="btn"
        @click="handleClick(4)"
      >
        您的留言
      </v-btn>
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

const selectedBtn = ref(1);
const avatarKey = ref(0);
const aboutKey = ref(0);

function handleClick(index) {
  if (selectedBtn.value !== index) {
    selectedBtn.value = index;
  }
}

function reload() {
  avatarKey.value++;
  aboutKey.value++;
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
</style>
