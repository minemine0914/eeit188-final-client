<template>
    <!-- <div v-if="totalUsers"> -->
    <Pie :data="genderData" :options="chartOptions" />
    <v-checkbox-btn v-model="showText" inline class="pe-2" color="brown-darken-3">
        <template v-slot:label>
            <span class="text-black text-h5 font-weight-bold">顯示文字資料</span>
        </template>
    </v-checkbox-btn>
    <div v-if="totalUsers && showText">
        <p style="font-size: 30px;">男：{{ maleCount }}人，佔{{ (maleCount / totalUsers * 100).toFixed(2) }}%</p>
        <p style="font-size: 30px;">女：{{ femaleCount }}人，佔{{ (femaleCount / totalUsers * 100).toFixed(2) }}%</p>
        <p style="font-size: 30px;">其他：{{ otherCount }}人，佔{{ (otherCount / totalUsers * 100).toFixed(2) }}%</p>
    </div>
    <!-- </div>
    <div v-else>
        <p>此區間無性別資料</p>
    </div> -->
</template>

<script setup>
import { ref, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useHostReportStore } from '@/stores/hostReportStore';
ChartJS.register(ArcElement, Tooltip, Legend);

const store = useHostReportStore()
const showText = ref(true)

const maleCount = computed(() => {
    let count = 0
    store.itemsSource.forEach(item => {
        if (item.userGender === 'male' || item.userGender === '男性') {
            count++
        }
    })
    return count
});

const femaleCount = computed(() => {
    let count = 0
    store.itemsSource.forEach(item => {
        if (item.userGender === 'female' || item.userGender === '女性') {
            count++
        }
    })
    return count
});

const otherCount = computed(() => {
    let count = 0
    store.itemsSource.forEach(item => {
        if (item.userGender === 'other' || item.userGender === '其他') {
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
    if (!total) {
        return {
            labels: ['此區間無性別資料'],
            datasets: [{
                label: '',
                backgroundColor: ['#dddddd'],
                data: [100]
            }]
        }
    }
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

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            labels: {
                font: {
                    size: 30, // Adjust this value for legend font size
                },
            },
        },
        tooltip: {
            titleFont: {
                size: 20, // Font size for tooltip title
            },
            bodyFont: {
                size: 20, // Font size for tooltip body
            },
        },
    },
};
</script>

<style scoped></style>
