<template>
  <div class="container">
    <div class="login-container">
      <Order />
    </div>
  </div>
</template>

<script setup>
import Order from "@/components/user/Order.vue";
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.login-container {
  text-align: center;
  width: 40%;
}
</style>
