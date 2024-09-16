<!-- src/views/HostReport.vue -->
<template>
    <div>
        <h1>Host Report</h1>
        <SelectorUser />
        <h2>Hello, {{ store.loginUser }}</h2>
        <Selector />
        <DataTable :records="store.records" />
        <div style="border:1px solid black; margin:50px;">
            <CreateTransactionRecord />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import Selector from '@/components/wu/components/Selector.vue';
import DataTable from '@/components/wu/components/DataTable.vue';
import CreateTransactionRecord from './createTransactionRecord.vue';
import SelectorUser from './SelectorUser.vue';

const store = useHostReportStore();

onMounted(async () => {
    store.fetchHouses();
    if (!store.years.length) {
        await store.fetchTransactionRecordsStartingValue();
    }
});
</script>