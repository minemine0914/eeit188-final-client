<template>
    <v-card>
        <v-tabs v-model="tab" align-tabs="center" bg-color="primary">
            <v-tab value="one">圖表</v-tab>
            <v-tab value="two">表格</v-tab>
        </v-tabs>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                    <div class="chartContainer">
                        <div>
                            <HouseIncome></HouseIncome>
                        </div>
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

                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                    <TextTable />
                </v-tabs-window-item>

            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import HouseIncome from '@/components/wu/components/HouseIncome.vue';
import TextTable from './TextTable.vue';
import { useHostReportStore } from '@/stores/hostReportStore';
ChartJS.register(ArcElement, Tooltip, Legend);

const store = useHostReportStore()
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
        labels: ['男', '女', '其他'],
        datasets: [
            {
                label: '性別分布',
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

const tab = ref(null)
</script>

<style scoped>
.chartContainer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.chartContainer div {
    display: inline-block;
    width: 500px;
}
</style>