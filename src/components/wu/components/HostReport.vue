<!-- src/views/HostReport.vue -->
<template>
    <div>
        <h1>Host Report</h1>
        <Selector :houses="houses" @update:selectedHouse="fetchUsers" />
        <DataTable :records="records" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Selector from '@/components/wu/components/Selector.vue';
import DataTable from '@/components/wu/components/DataTable.vue';

const houses = ref([]);
const records = ref([]);
const selectedHouse = ref(null);

const fetchHouses = async () => {
    try {
        const response = await api.post('/house/search', {
            // "name": "G",
            // "category": "飯店",
            // "show": false,
            // "minPrice": 200,
            // "maxPrice": 4000,
            // "postulateIds": ["9c3fffbc-84f4-4f8b-be85-2c1a649d321b", "ea779ec8-e192-46b2-bf62-c4f166caa0fd"],
            // "matchAllPostulates": true,
            "userId": "e61abdb4-d054-4188-9e41-c2691792cf73",
            "page": 0,
            "limit": 10
        });
        console.log(response.data)
        houses.value = response.data.content;
        console.log(houses.value)
    } catch (error) {
        console.error('Error fetching houses:', error);
    }
};

const fetchUsers = async (houseId) => {
    try {
        if (houseId) {
            const response = await api.post(`/transcation_record/search`, { "houseId": houseId });
            records.value = response.data.content;
            console.log(records.value)

        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

onMounted(() => {
    fetchHouses();
});
</script>