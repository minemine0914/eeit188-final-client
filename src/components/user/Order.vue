<template></template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";

const userStore = useUserStore();
const { user } = userStore;

const order = reactive({
  orders: [],
});
const page = ref(0);
const limit = ref(5);
const isFetching = ref(false);
const hasMore = ref(true);

onMounted(async () => {
  const request = {
    userId: user.id,
    page: page.value,
    limit: limit.value,
  };
});

function fetchOrders() {
  order.orders = response;
}

function handleScroll(event) {
  const container = event.target;

  // Check if scrolled to bottom
  if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    loadNextPage();
  }
}

async function loadNextPage() {
  if (isFetching.value || !hasMore.value) return;

  page.value++; // Increment the page
  const request = {
    userId: user.id,
    page: page.value,
    limit: limit.value,
  };

  await getUserCollectionHouse(request);
}
</script>

<style scoped>
.loader {
  margin-left: auto;
  margin-right: auto;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.bottom-text {
  margin-left: 50%;
}
</style>
