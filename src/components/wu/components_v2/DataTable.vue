<!-- src/components/DataTable.vue -->
<template>
    <div>
        <p>{{ records.length }}</p>

        <h2>Users in Selected House</h2>
        <div style="width:80vw;" v-if="records.length">
            <label for="showMethod">顯示方式：</label>
            <select id="showPieChart" v-model="showPieChart">
                <option :value="false">文字</option>
                <option :value="true">圖形</option>
            </select>
            <div style="width:300px;">
                <Pie v-if="showPieChart" :data="genderData" />
                <div>
                    <p>男：{{ maleCount }}人，佔{{ (maleCount / totalUsers * 100).toFixed(2)
                        }}%</p>
                    <p>女：{{ femaleCount }}人，佔{{
                        (femaleCount / totalUsers * 100).toFixed(2) }}%</p>
                    <p>其他：{{ otherCount }}人，佔{{
                        (otherCount / totalUsers * 100).toFixed(2) }}%</p>
                </div>
            </div>
            <div>
                <HouseIncome :incomeRecords="incomeRecords"></HouseIncome>
            </div>
            <p>{{ records.length }}</p>
            <table>
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>UserID</th>
                        <th>Gender</th>
                        <th>Birth year</th>
                        <th>cash flow</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="record in records" :key="record.id">
                        <td style="font-size: xx-small;">{{ record }}</td>
                        <td>{{ record.user.id }}</td>
                        <td>{{ record.userGender }}</td>
                        <td>{{ record.user.birthday.substring(0, 4) }}</td>
                        <td>{{ record.cashFlow }}/{{ totalCashFlow }}</td>
                    </tr>
                </tbody>
            </table>
            <p>{{ records }}</p>

        </div>

        <p v-else>No users found.</p>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import HouseIncome from '@/components/wu/components/HouseIncome.vue';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
    records: Array,
});
const showPieChart = ref(true);

// const incomeRecords = ref([100, 200, 300]);
const incomeRecords = computed(() => {
    // console.log('props.records=')
    // console.log(props.records)
    // Transform props.records into an array of cash flow values
    return props.records.map(record => record.cashFlow || 0);
});


const maleCount = computed(() => {
    let count = 0
    props.records.forEach(item => {
        if (item.userGender === 'male') {
            count++
        }
    })

    return count
});

const femaleCount = computed(() => {
    let count = 0
    props.records.forEach(item => {
        if (item.userGender === 'female') {
            count++
        }
    })
    return count
});

const otherCount = computed(() => {
    let count = 0
    props.records.forEach(item => {
        if (item.userGender === 'other') {
            count++
        }
    })
    return count
});

const totalUsers = computed(() => {
    return maleCount.value + femaleCount.value + otherCount.value;
});

// const maleCount = computed(() => props.records.filter(record => record.user.gender === 'male').length);
// const femaleCount = computed(() => props.records.filter(record => record.user.gender === 'female').length);
// const otherCount = computed(() => props.records.filter(record => record.user.gender === 'other').length);
// const totalUsers = computed(() => maleCount.value + femaleCount.value + otherCount.value);

const totalCashFlow = computed(() => {
    return props.records.reduce((total, record) => total + (record.cashFlow || 0), 0);
});

const genderData = computed(() => {
    const total = totalUsers.value;
    return {
        labels: ['Male', 'Female', 'Other'],
        datasets: [
            {
                label: 'Gender Distribution',
                backgroundColor: ['#f87979', '#d5cc4a', '#83d6ba'],
                data: [
                    total ? (maleCount.value / total) * 100 : 0,
                    total ? (femaleCount.value / total) * 100 : 0,
                    total ? (otherCount.value / total) * 100 : 0
                ]
            }
        ]
    }
});
</script>

<style lang="css" scoped>
table,
th,
td {
    border: 1px solid black;
}
</style>