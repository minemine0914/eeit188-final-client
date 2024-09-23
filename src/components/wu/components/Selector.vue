<!-- src/components/Selector.vue -->
<template>
    <div>
        <label for="house-select">請選擇房源：</label>
        <select id="house-select" v-model="store.selectedHouse" @change="update">
            <option v-for="house in store.houses" :key="house.id" :value="house.id">
                [{{ house.name }}][{{ house.country }}{{ house.city }}{{ house.region }}]
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()
store.isLoading = ref(false)

const update = async () => {
    store.isLoading = true;
    try {
        store.fetchTransactionRecordsStartingValue()
        store.fetchTransactionRecords()
    } finally {
        // Ensure loading state is set to false after fetching

        setTimeout(() => {
            store.isLoading = false;
        }, 500);// setTimeout for test
    }
}
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>