<!-- src/components/DataTable.vue -->
<template>
    <div>

        <h2>Reports</h2>
        <div style="width:80vw;" v-if="store.records.length">
            <div>
                <label for="showPieChart">顯示方式：</label>
                <select id="showPieChart" v-model="showPieChart">
                    <option :value="false">文字</option>
                    <option :value="true">圖形</option>
                </select>

                <div>
                    <!-- Radio Buttons for selecting Month or Quarter -->
                    <div>
                        <input type="radio" id="monthOrQuarter_year" value="year" v-model="store.selectedPeriod">
                        <label for="monthOrQuarter_year">Y</label>

                        <input type="radio" id="monthOrQuarter_month" value="month" v-model="store.selectedPeriod">
                        <label for="monthOrQuarter_month">M</label>

                        <input type="radio" id="monthOrQuarter_quarter" value="quarter" v-model="store.selectedPeriod">
                        <label for="monthOrQuarter_quarter">Q</label>
                    </div>

                    <!-- Display the selected period -->
                    <div>
                        <p>Selected Period: {{ store.selectedPeriod }}</p>
                    </div>

                    <!-- Conditionally render content based on selected period -->
                    <div>
                        <label for="yearRange">年份：</label>
                        <select id="yearRange" v-model="store.selectedYear">
                            <!-- <select id="yearRange" v-model="store.selectedYear" @change="updateRecordView('year')"> -->
                            <option v-for="year, key in store.years" :key="key" :value="year">{{ year }}</option>
                        </select>
                        <div v-if="store.selectedPeriod === 'year'">
                            <!-- Content for Month -->
                            <p>Year data goes here.</p>
                        </div>
                        <div v-if="store.selectedPeriod === 'month'">
                            <!-- Content for Month -->
                            <p>Month data goes here.</p>


                            <label for="monthRange">月份：</label>
                            <select id="monthRange" v-model="store.selectedMonth">
                                <option v-for="month, key in 12" :key="key" :value="month">{{ month }}</option>
                            </select>
                        </div>
                        <div v-if="store.selectedPeriod === 'quarter'">
                            <!-- Content for Quarter -->
                            <p>Quarter data goes here.</p>

                            <label for="quarterRange">季度：</label>
                            <select id="quarterRange" v-model="store.selectedQuarter">
                                <option v-for="quarter, key in 4" :key="key" :value="quarter">{{ quarter }}</option>
                            </select>
                        </div>
                    </div>
                </div>





            </div>
            <div v-if="showPieChart" class="chartContainer">
                <div>
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
                    <HouseIncome></HouseIncome>
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
                        <tr v-for="record in store.records" :key="record.id">
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
import { computed, ref, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import HouseIncome from '@/components/wu/components/HouseIncome.vue';
import { useHostReportStore } from '@/stores/hostReportStore';

ChartJS.register(ArcElement, Tooltip, Legend);

const store = useHostReportStore()


const showPieChart = ref(true);
// const years = computed(() => store.years);
store.selectedYear
store.selectedMonth = '1'
store.selectedQuarter = '1'

watch(
    () => store.selectedPeriod,
    (newVal) => {
        // if (newVal === 'year') { store.turnToY() }
        // else if (newVal === 'month') { store.turnToYM() }
        // else if (newVal === 'quarter') { store.turnToYQ() }

        //使用測試DATA**************************************************************************
        if (newVal === 'year') { store.useTestYMDC('Y') }
        else if (newVal === 'month') { store.useTestYMDC('YM') }
        else if (newVal === 'quarter') { store.useTestYMDC('YQ') }
    }
);

// const updateRecordView = async (source) => {
//     if (source === 'year') {
//         store.fetchTransactionRecords(store.selectedYear)
//     }
// }

// Ensure that `years` is populated before rendering
const isDataReady = computed(() => {
    return store.years.length > 0 && store.records.length > 0;
});
// '2024-09-13T06:15:24.140+00:00'

const maleCount = computed(() => {
    let count = 0
    store.records.forEach(item => {
        if (item.userGender === 'male') {
            count++
        }
    })

    return count
});

const femaleCount = computed(() => {
    let count = 0
    store.records.forEach(item => {
        if (item.userGender === 'female') {
            count++
        }
    })
    return count
});

const otherCount = computed(() => {
    let count = 0
    store.records.forEach(item => {
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
    return store.records.reduce((total, record) => total + (record.cashFlow || 0), 0);
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

.chartContainer div {
    width: 500px;
}
</style>