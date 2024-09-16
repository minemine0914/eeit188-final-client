<template>
  <div class="container">
    <div class="login-container">
      <Login />
    </div>
  </div>
</template>

<script setup>
import Login from "@/components/user/AdminLogin.vue";
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
