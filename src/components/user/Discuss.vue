<template>
  <div>
    <v-card
      v-for="(d, index) in discuss.discusses"
      :key="d?.id"
      class="mx-auto mb-5"
      :subtitle="d?.house"
      width="400"
    >
      <v-rating
        v-model="score.scores[index]"
        class="ma-2"
        density="default"
      ></v-rating>
      <v-textarea v-model="d.discuss" label="評論"></v-textarea>
      <v-btn @click="updateDiscuss(d?.id, d?.discuss, d?.houseId, d?.score)">
        修改評論
      </v-btn>
      <v-btn @click="retractDiscuss(d?.id)"> 收回評論 </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useUserStore } from "../../stores/userStore";
import api from "@/plugins/axios";

const userStore = useUserStore();
const { user } = userStore;

const score = reactive({
  scores: [],
});

const discuss = reactive({
  discusses: [],
});

onMounted(async () => {
  await fetchDiscusses();
  await fetchScore();
});

const fetchDiscusses = async () => {
  try {
    const response = await api({
      method: "get",
      url: `/discuss/user/${user.id}`,
    });

    discuss.discusses = response.data.discusses;
  } catch (error) {
    console.error("Failed to fetch user discusses:", error);
  }
};

const fetchScore = async () => {
  for (let d of discuss.discusses) {
    console.log(discuss.discusses);
    try {
      const response = await api({
        method: "get",
        url: `/house/mongo/find/${user.id}/${d.houseId}`,
      });
      score.scores.push(response.data.score);
    } catch (error) {
      console.error("Failed to fetch user discusses:", error);
    }
  }
};

const updateDiscuss = async (discussId, discuss, houseId, score) => {
  try {
    await api({
      method: "put",
      url: `/discuss/update/${discussId}`,
      data: { discuss: discuss },
    });

    await api({
      method: "post",
      url: `/house/mongo/rate`,
      data: {
        userId: user.id,
        houseId: houseId,
        score: score,
      },
    });

    await fetchDiscusses();
    await fetchScore();
  } catch (error) {
    console.error(error);
  }
};

const retractDiscuss = async (discussId) => {
  try {
    await api({
      method: "put",
      url: `/discuss/retract/${discussId}`,
    });

    await fetchDiscusses();
    await fetchScore();
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped></style>
