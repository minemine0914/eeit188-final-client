<!-- src/components/Selector.vue -->
<template>
    <div>
        <label for="house-select">Select a House:</label>
        <select id="house-select" v-model="store.selectedHouse" @change="emitSelection">
            <option v-for="house in houses" :key="house.id" :value="house.id">
                {{ house.name }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { useHostReportStore } from '@/stores/hostReportStore';
const props = defineProps({
    houses: Array
});
const store = useHostReportStore()

const emit = defineEmits(['update:selectedHouse']);

// const selectedHouse = ref(store.selectedHouse);
const emitSelection = () => {
    store.selectedYear = 2020
    emit('update:selectedHouse', store.selectedHouse.value);
};

</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>