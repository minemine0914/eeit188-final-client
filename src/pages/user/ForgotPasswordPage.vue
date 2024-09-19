<template>
  <div class="container">
    <div class="login-container">
      <ForgotPassword />
    </div>
  </div>
</template>

<script setup>
import ForgotPassword from "@/components/user/ForgotPassword.vue";
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.login-container {
  text-align: center;
  width: 20%;
}
</style>
