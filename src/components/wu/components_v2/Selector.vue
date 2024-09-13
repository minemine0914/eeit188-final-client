<template>
    <div>
        <label for="house-select">Select a House:</label>
        <select id="house-select" v-model="selectedHouse" @change="emitSelection">
            <option v-for="house in houses" :key="house.id" :value="house.id">
                {{ house.name }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    houses: Array
});

const emit = defineEmits(['update:selectedHouse']);
const selectedHouse = ref('');

function emitSelection() {
    emit('update:selectedHouse', selectedHouse.value);
}
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>
