<template>
  <div class="container">
    <div class="signup-container">
      <Signup />
    </div>
  </div>
</template>

<script setup>
import Signup from "@/components/user/Signup.vue";
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin: 50px;
}

.signup-container {
  width: 30%;
}
</style>
