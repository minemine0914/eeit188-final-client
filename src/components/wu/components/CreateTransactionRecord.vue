<template>
    <div>
        <textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
            v-model="store.usersResult"></textarea>
        <button @click="findAllUserString">findAllUser</button>
        <textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
            v-model="store.housesResult"></textarea>
        <button @click="findAllHouse">findAllHouse</button>
        <button @click="crossInsertTransactionRecord">CREATE!!!</button>
    </div>
</template>

<script setup>
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore();

const findAllUserString = () => {
    store.findAllUserString();
};

const findAllHouse = () => {
    store.findAllHouse();
};

const crossInsertTransactionRecord = () => {
    store.crossInsertTransactionRecord();
};


</script>

<style scoped>
button {
    border: 1px solid black;
}
</style>
