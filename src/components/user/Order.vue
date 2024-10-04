<template>
  <div class="order-container">
    <v-card
      v-if="order?.orders.length === 0"
      class="mx-auto mb-5"
      subtitle="您目前沒有任何未結帳的訂單"
      width="450"
      height="50"
    ></v-card>
    <v-card
      v-for="o in order?.orders"
      :key="o?.id"
      class="mx-auto mb-5"
      color="grey-lighten-3"
      width="450"
      min-height="350"
    >
      <div class="content">
        <v-card-subtitle class="custom-subtitle">{{ o?.name }}</v-card-subtitle>
        <v-img
          class="main-img"
          width="300"
          :src="fetchImage(o)"
          @click="handleClick(o)"
        ></v-img>
      </div>
      <v-btn class="btn-1" color="error" @click="removeOrder(o)"
        >移除訂單</v-btn
      >
      <v-btn class="btn-2" :to="`/booking/${o?.id}`">前往結帳</v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useUserStore } from "../../stores/userStore";
import notFoundImg from "@/assets/ImageNotAvailable02.webp";
import Swal from "@/plugins/sweetalert2";

const userStore = useUserStore();
const { user } = userStore;

const order = reactive({
  orders: [],
});

onMounted(() => {
  fetchOrders();
});

function fetchOrders() {
  if (
    localStorage.getItem("HouseDetail") !== null &&
    JSON.parse(localStorage.getItem("HouseDetail")).bookingList.length > 0
  ) {
    const bookingList = JSON.parse(
      localStorage.getItem("HouseDetail")
    ).bookingList;

    let orderList;

    for (let b in bookingList) {
      orderList = bookingList[b].list;
    }

    order.orders.push(...orderList);
    order.orders.reverse();
  }
}

const fetchImage = (o) => {
  if (o.resources.length <= 0) {
    return notFoundImg;
  } else {
    return (
      import.meta.env.VITE_API_URL +
      `/house-external-resource/image/${o.resources[0].id}`
    );
  }
};

const handleClick = (o) => {
  const url = `/house/${o.id}`;
  window.open(url, "_blank");
};

const removeOrder = (o) => {
  Swal.fire({
    title: "是否確定要移除訂單？",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      try {
        order.orders = order.orders.filter((order) => order.id !== o.id);

        let houseDetail = JSON.parse(localStorage.getItem("HouseDetail"));
        houseDetail.bookingList = houseDetail.bookingList.map((b) => {
          if (b.userId === user.id) {
            return {
              ...b,
              list: b.list.filter((order) => order.id !== o.id),
            };
          }
          return b;
        });
        localStorage.setItem("HouseDetail", JSON.stringify(houseDetail));

        fetchOrders();

        Swal.fire({
          title: "您的訂單已移除！",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "移除失敗，請重新操作一次",
          icon: "error",
        });
        console.error(error);
      }
    }
  });
};
</script>

<style scoped>
.order-container {
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 700px;
  max-height: 700px;
  overflow-y: auto;
}

.content {
  position: absolute;
  left: 20px;
  top: 10px;
}

.custom-subtitle {
  font-size: 20px;
  font-weight: bold;
}

.main-img {
  cursor: pointer;
}

.btn-1 {
  position: absolute;
  right: 10px;
  bottom: 60px;
}

.btn-2 {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>
