<template>
  <div class="container">
    <div class="login-container">
      <AdminResetPasswordFromEmailLink />
    </div>
  </div>
</template>

<script setup>
import AdminResetPasswordFromEmailLink from "@/components/user/AdminResetPasswordFromEmailLink.vue";
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
