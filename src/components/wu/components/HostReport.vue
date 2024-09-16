<!-- src/views/HostReport.vue -->
<template>
    <div>
        <h1>Host Report</h1>
        <SelectorUser />
        <h2>Hello, {{ store.loginUser }}</h2>
        <Selector />
        <DataTable />

    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import Selector from '@/components/wu/components/Selector.vue';
import DataTable from '@/components/wu/components/DataTable.vue';
import SelectorUser from './SelectorUser.vue';

const store = useHostReportStore();

onMounted(async () => {
    // 標準步驟：
    // 1.用host(user)找house
    // 2.列出找到的house，找出有資料的頭尾年分
    // 3.找出所有交易紀錄(和交易過的user)

    await store.fetchHouses();
    await store.fetchTransactionRecordsStartingValue()
    await store.fetchTransactionRecords()

});
</script>