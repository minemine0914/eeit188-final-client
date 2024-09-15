<!-- src/components/DataTable.vue -->
<template>
    <div>

        <h2>Reports</h2>
        <div style="width:80vw;" v-if="records.length">
            <div>
                <label for="showMethod">顯示方式：</label>
                <select id="showPieChart" v-model="showPieChart">
                    <option :value="false">文字</option>
                    <option :value="true">圖形</option>
                </select>
                <label for="yearRange">年份：</label>
                <select id="yearRange" v-model="store.selectedYear" @change="store.fetchTransactionRecords">
                    <option v-for="year, key in years" :key="key" :value="year">{{ year }}</option>
                </select>
                <input type="radio" name="monthOrQuarter" id="monthOrQuarter_month"><label
                    for="monthOrQuarter_month">M</label>
                <input type="radio" name="monthOrQuarter" id="monthOrQuarter_quarter"><label
                    for="monthOrQuarter_quarter">Q</label>


                <label for="monthRange">月份：</label>
                <select id="monthRange" v-model="store.selectedMonth">
                    <option v-for="month, key in 12" :key="key" :value="month">{{ month }}</option>
                </select>
                <label for="quarterRange">季度：</label>
                <select id="quarterRange" v-model="store.selectedQuarter">
                    <option v-for="quarter, key in 4" :key="key" :value="quarter">{{ quarter }}</option>
                </select>
            </div>
            <div v-if="showPieChart" class="chartContainer">
                <div style="width:300px;">
                    <Pie :data="genderData" />
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

            </div>
            <div v-else>
                <table>
                    <thead>
                        <tr>
                            <!-- <th>DATA</th> -->
                            <th>UserID</th>
                            <th>Gender</th>
                            <th>Birth year</th>
                            <th>cash flow</th>
                            <th>createdAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="record in records" :key="record.id">
                            <!-- <td style="font-size: xx-small;">{{ record }}</td> -->
                            <td>{{ record.user.id }}</td>
                            <td>{{ record.userGender }}</td>
                            <td>{{ record.user.birthday.substring(0, 4) }}</td>
                            <td>{{ record.cashFlow }}/{{ totalCashFlow }}</td>
                            <td>{{ record.createdAt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <p v-else>No transaction records found.</p>

    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import HouseIncome from '@/components/wu/components/HouseIncome.vue';
import { useHostReportStore } from '@/stores/hostReportStore';

ChartJS.register(ArcElement, Tooltip, Legend);

const store = useHostReportStore()
const props = defineProps({
    records: Array,
});

const showPieChart = ref(true);
store.selectedYear = '2020'
store.selectedMonth = '1'
store.selectedQuarter = '1'
const years = ['2020', '2021', '2022', '2023', '2024', '2025']
// '2024-09-13T06:15:24.140+00:00'

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

select {
    padding: 5px 10px;
    border: 1px solid black;
}

.chartContainer {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-direction: row;
}
</style>