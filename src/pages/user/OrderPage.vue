<template>
  <div class="container">
    <div class="order-list">
      <h1>未結帳</h1>
      <Order />
    </div>
    <div class="record-list">
      <h1>已結帳（歷史訂單）</h1>
      <TransectionRecord />
    </div>
  </div>
</template>

<script setup>
import Order from "@/components/user/Order.vue";
import TransectionRecord from "@/components/user/TransectionRecord.vue";
import Ticket from "@/components/user/Ticket.vue";
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.order-list {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.record-list {
  display: flex;
  flex-direction: column;
  text-align: center;
}

.record-list {
  margin-left: 100px;
}

h1 {
  margin-bottom: 30px;
}
</style>
