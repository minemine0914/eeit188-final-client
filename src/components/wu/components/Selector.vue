<!-- src/components/Selector.vue -->
<template>
    <div>
        <label for="house-select">Select a House:</label>
        <select id="house-select" v-model="store.selectedHouse" @change="fetchTransactionRecords">
            <option v-for="house in store.houses" :key="house.id" :value="house.id">
                [{{ house.name }}][{{ house.id }}]
            </option>
        </select>
    </div>
</template>

<script setup>
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()

const fetchTransactionRecords = () => {
    store.fetchTransactionRecords(store.selectedHouse.value);
};

</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>