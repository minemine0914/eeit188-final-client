<!-- src/components/Selector.vue -->
<template>
    <div>
        <label for="user-select">Select a User:</label>
        <select id="user-select" v-model="selectedUser" @change="fetchHouses(selectedUser)">
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
const selectedUser = store.loginUser;

const fetchHouses = async (userId) => {
    await store.fetchHouses(userId);
    // console.log('store.houses', store.houses);


    // if (Object.keys(store.houses).length === 0) {
    //     store.houses.house = { id: 0, name: 'NOT FOUND' }
    //     console.log(store.houses)
    // }
};

const findAllUserArray = () => {
    store.findAllUserArray();
};

onMounted(() => {
    findAllUserArray();
    store.selectedUser = store.users[0].id
    console.log('store.selectedUser', store.selectedUser)
    console.log('store.users', store.users)
});
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>