<!-- src/views/HostReport.vue -->
<template>
    <div>
        <h1>Host Report</h1>
        <div>
            <textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
                v-model="usersResult"></textarea>
            <button @click="findAllUser">findAllUser</button>
            <textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
                v-model="housesResult"></textarea>
            <button @click="findAllHouse">findAllHouse</button>
            <button @click="crossInsertTransactionRecord">CREATE!!!</button>
        </div>
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
const usersResult = ref('')
const housesResult = ref('')

// Function to transform simple values into objects
function searchUserAgainByRecordId(contentArray) {

    // Initialize an empty array to collect the transformed items
    const transformedArray = [];

    // Iterate through the array
    contentArray.forEach(element => {
        if (typeof element === 'object' && !Array.isArray(element)) {
            // If the element is an object, keep it as is
            transformedArray.push(element);
        } else if (typeof element === 'string') {
            // If the element is a string, convert it into an object

            // console.log(`/transcation_record/${element}`)
            api.get(`/transcation_record/${element}`)
                .then(response => {
                    // console.log('string to record=')
                    // console.log(response.data)
                    transformedArray.push(response.data)
                })
                .catch(error => {
                    console.error('Error fetching houses:', error);

                })



        }
    });
    return transformedArray


}



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
            "limit": 100
        });
        // Apply the transformation
        // console.log(response.data.content)


        // console.log(JSON.stringify(response.data, null, 2));
        // console.log('data=')
        // console.log(response.data)
        houses.value = response.data.content;
        // console.log('housevalue=')
        // console.log(houses.value)
    } catch (error) {
        console.error('Error fetching houses:', error);
    }
};

const fetchUsers = async (houseId) => {
    try {
        if (houseId) {
            const response = await api.post(`/transcation_record/search`, { "houseId": houseId, "limit": 1000 });
            records.value = searchUserAgainByRecordId(response.data.content);

            console.log('records=')
            console.log(records.value)

        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const findAllUser = async () => {
    try {
        const response = await api.get(`/user/`);
        usersResult.value = response.data.users.map(user => user.id || 0)
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const findAllHouse = async () => {
    try {
        const response = await api.get(`/house/all`);
        console.log(response.data.content)
        housesResult.value = response.data.content.map(house => house.id || 0)
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const crossInsertTransactionRecord = async () => {
    const dataAmount = 10
    for (let i = 0; i < dataAmount; i++) {
        try {

            const houseId = housesResult.value[Math.floor(Math.random() * housesResult.value.length)];
            const userId = usersResult.value[Math.floor(Math.random() * usersResult.value.length)];

            const response = await api.post(`/transcation_record/`, {
                "houseId": houseId,
                "userId": userId,
                "cashFlow": Math.pow(10, i),
                "deal": "haha",
                "platformIncome": Math.pow(10, i)
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
};



onMounted(() => {
    fetchHouses();
});
</script>