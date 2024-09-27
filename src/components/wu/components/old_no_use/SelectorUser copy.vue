<!-- src/components/Selector.vue -->
<template>
    <div>
        <v-icon icon="mdi-account" />
        <label for="user-select">請選擇房東：</label>
        <select id="user-select" v-model="store.selectedUserId" @change="fetchHouses(store.selectedUserId)">
            <option v-for="user in store.users" :key="user.id" :value="user.id">
                [{{ user.name }}][{{ user.id }}]
            </option>
        </select>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()

const fetchHouses = async (userId) => {
    await store.fetchHouses(userId);
    store.fetchTransactionRecordsStartingValue()
    store.fetchTransactionRecords()

};

onMounted(async () => {
    await store.findAllHost();
    store.selectedUserId = store.users[0].id
    fetchHouses(store.selectedUserId)
    //log************
    // console.log('store.selectedUser', store.selectedUser)
    // console.log('store.users', store.users)
    //log************
});
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>