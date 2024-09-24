<template>
    <div v-if="totalUsers">
        <Pie :data="genderData" />
        <div>
            <p>男：{{ maleCount }}人，佔{{ (maleCount / totalUsers * 100).toFixed(2) }}%</p>
            <p>女：{{ femaleCount }}人，佔{{ (femaleCount / totalUsers * 100).toFixed(2) }}%</p>
            <p>其他：{{ otherCount }}人，佔{{ (otherCount / totalUsers * 100).toFixed(2) }}%</p>
        </div>
    </div>
    <div v-else>
        <p>此區間無性別資料</p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useHostReportStore } from '@/stores/hostReportStore';
ChartJS.register(ArcElement, Tooltip, Legend);

const store = useHostReportStore()
const maleCount = computed(() => {
    let count = 0
    store.itemsSource.forEach(item => {
        if (item.userGender === 'male') {
            count++
        }
    })
    return count
});

const femaleCount = computed(() => {
    let count = 0
    store.itemsSource.forEach(item => {
        if (item.userGender === 'female') {
            count++
        }
    })
    return count
});

const otherCount = computed(() => {
    let count = 0
    store.itemsSource.forEach(item => {
        if (item.userGender === 'other') {
            count++
        }
    })
    return count
});

const totalUsers = computed(() => {
    return maleCount.value + femaleCount.value + otherCount.value;
});

const genderData = computed(() => {
    const total = totalUsers.value;
    return {
        labels: ['男', '女', '其他'],
        datasets: [{
            label: '比例(%)',
            backgroundColor: ['#f87979', '#d5cc4a', '#83d6ba'],
            data: [
                total ? (maleCount.value / total) * 100 : 0,
                total ? (femaleCount.value / total) * 100 : 0,
                total ? (otherCount.value / total) * 100 : 0
            ]
        }]
    }
});

</script>

<style scoped></style>
