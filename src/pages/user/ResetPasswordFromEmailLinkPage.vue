<template>
  <div class="container">
    <div class="login-container">
      <ResetPasswordFromEmailLink />
    </div>
  </div>
</template>

<script setup>
import ResetPasswordFromEmailLink from "@/components/user/ResetPasswordFromEmailLink.vue";
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
