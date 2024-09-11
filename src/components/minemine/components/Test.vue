<template>
    <v-card width="500" height="500">
        <v-text-field @update:modelValue="updateField"></v-text-field>
        <v-list>
            <v-list-item v-for="(city, index) in result" :key="index" :title="city.item.CityName"></v-list-item>
        </v-list>
    </v-card>
</template>

<script setup>
import Fuse from "fuse.js";
import { ref } from "vue";
import taiwanCityData from "@/assets/CityCountyData.json";
const fuse = new Fuse(taiwanCityData, {
    keys: ["CityName", "CityEngName"],
});

const result = ref(null);


function updateField(value) {
    result.value = fuse.search(value);
    console.log(result.value);
}
</script>

<style scoped></style>
