<!-- src/views/HostReport.vue -->
<template>
    <div>
        <h1>Host Report</h1>
        <h2>Hello, {{ loginUser }}</h2>
        <Selector :houses="store.houses" @update:selectedHouse="fetchTransactionRecords" />
        <DataTable :records="store.records" />
        <CreateTransactionRecord></CreateTransactionRecord>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import api from '@/plugins/axios';
import Selector from '@/components/wu/components/Selector.vue';
import DataTable from '@/components/wu/components/DataTable.vue';
import CreateTransactionRecord from './createTransactionRecord.vue';

const store = useHostReportStore();
const loginUser = store.loginUser
const fetchHouses = () => {
    store.fetchHouses();
};

const fetchTransactionRecords = () => {
    store.fetchTransactionRecords(store.selectedHouse);
};

onMounted(() => {
    fetchHouses();
});
</script>