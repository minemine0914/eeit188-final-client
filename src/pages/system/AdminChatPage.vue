<template>
  <div class="container">
    <div class="login-container">
      <Chat />
    </div>
  </div>
</template>

<script setup>
import Chat from "@/components/user/Chat.vue";
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
