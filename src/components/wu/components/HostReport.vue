<!-- src/views/HostReport.vue -->
<template>
    <div>
        <h1>Host Report</h1>
        <SelectorUser />
        <h2>Hello, {{ store.loginUser }}</h2>
        <Selector />

        <!-- Loading Spinner -->
        <div v-if="store.isLoading"
            style="position: fixed;left:80vw;top:30vh;transform: translate(-50%, -50%);z-index: 100;">
            <v-progress-circular indeterminate color="primary" class="ma-5" :size="400"
                :width="50"></v-progress-circular>
        </div>
        <!-- Data Table -->
        <DataTable />

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import Selector from '@/components/wu/components/Selector.vue';
import DataTable from '@/components/wu/components/DataTable.vue';
import SelectorUser from './SelectorUser.vue';

const store = useHostReportStore();
store.isLoading = ref(false)

onMounted(async () => {
    // Set loading state to true
    store.isLoading = true;

    // 標準步驟：
    // 1.用host(user)找house
    // 2.列出找到的house，找出有資料的頭尾年分
    // 3.找出所有交易紀錄(和交易過的user)
    try {
        await store.fetchHouses();
        store.fetchTransactionRecordsStartingValue()
        await store.fetchTransactionRecords()
    } finally {
        // Ensure loading state is set to false after fetching

        setTimeout(() => {
            store.isLoading = false;
        }, 0);// setTimeout for test
    }
});
</script>