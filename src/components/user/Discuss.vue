<template>
  <div>
    <v-card
      v-for="(discuss, index) in discusses"
      :key="discuss.id"
      class="mx-auto mb-5"
      subtitle="您的留言"
      width="400"
    >
      <v-card-text v-if="houses[index]" class="bg-surface-light pt-4">
        房源 : {{ houses[index].name }}
      </v-card-text>
      <v-card-text class="bg-surface-light pt-4">
        {{ discuss.discuss }}
      </v-card-text>
      <v-btn @click="retractDiscuss(discuss.id)"> 收回留言 </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserViewStore } from "@/stores/userViewStore";
import api from "@/plugins/axios";

const userViewStore = useUserViewStore();
const { jwtToken, decodeToken } = userViewStore;

const userInfo = ref(null);
const discusses = ref([]);
const houses = ref([]);

const fetchDiscusses = async () => {
  try {
    userInfo.value = decodeToken();

    // Fetch user discuss
    const response = await api({
      method: "get",
      url: "/discuss/user/" + userInfo.value.sub,
    });

    discusses.value = response.data.content;
    houses.value = []; // Clear houses before refetching

    // Fetch house details
    for (const discuss of discusses.value) {
      try {
        const houseResponse = await api({
          method: "get",
          url: "/house/" + discuss.house,
        });
        houses.value.push(houseResponse.data);
      } catch (error) {
        console.error("Failed to fetch house data:", error);
      }
    }
  } catch (error) {
    console.error("Failed to fetch user discusses:", error);
  }
};

const retractDiscuss = async (discussId) => {
  try {
    const response = await api({
      method: "put",
      url: `/discuss/retract/${discussId}`,
    });

    console.log(response);

    await fetchDiscusses();
  } catch (error) {
    console.error("Failed to retract discuss:", error);
  }
};

onMounted(() => {
  fetchDiscusses();
});
</script>

<style scoped></style>
