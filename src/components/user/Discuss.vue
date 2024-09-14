<template>
  <div>
    <v-card
      v-for="discuss in discusses"
      :key="discuss.id"
      class="mx-auto mb-5"
      subtitle="您的留言"
      width="400"
    >
      <v-card-text class="bg-surface-light pt-4">
        房源 : {{ discuss.house }}
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
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { user } = userStore;

const discusses = ref([]);

onMounted(() => {
  fetchDiscusses();
});

const fetchDiscusses = async () => {
  try {
    // Fetch user discuss
    const response = await api({
      method: "get",
      url: `/discuss/user/${user.id}`,
    });

    discusses.value = response.data.discusses;
  } catch (error) {
    console.error("Failed to fetch user discusses:", error);
  }
};

const retractDiscuss = async (discussId) => {
  try {
    await api({
      method: "put",
      url: `/discuss/retract/${discussId}`,
    });

    await fetchDiscusses();
  } catch (error) {
    console.error("Failed to retract discuss:", error);
  }
};
</script>

<style scoped></style>
