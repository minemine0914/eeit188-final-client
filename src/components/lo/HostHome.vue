<template>
  <v-app>
    <v-navigation-drawer app permanent>
      <v-list>
        <v-list-item v-for="item in menuItems" :key="item.path">
          <v-btn text @click="navigateTo(item.path)">
            {{ item.title }}
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const menuItems = ref([
  { title: "管理房源", path: "/lo/property-management" },
  { title: "新增房源", path: "/lo/add-property" },
  { title: "訂單管理", path: "/lo/order-records" },
  { title: "預約管理", path: "/lo/reservation-management" },
  { title: "住客評價", path: "/lo/reviews" },
  { title: "分析報表", path: "/lo/reports" },
]);

const router = useRouter();
const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.text-h5 {
  font-weight: bold;
}
</style>
