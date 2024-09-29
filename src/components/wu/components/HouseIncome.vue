<template>
  <Line :data="data" :options="options" />
  <!-- <p>{{ store.selectedMonth }}月營業額：</p> -->
</template>

<script setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import { useUserStore } from '@/stores/userStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useHostReportStore()
const userStore = useUserStore()
// Create a computed property for the chart data
const data = computed(() => {
  // Define an array of colors for each data point
  let pointBackgroundColor = Array(store.records.length).fill('#f87979');
  let pointRadius = Array(store.records.length).fill(3);

  if (store.selectedPeriod === 'year') {
    store.labels.name = '年度'
    store.labels.values = store.years
    if (!store.allYear) {
      pointBackgroundColor[store.selectedYear - store.years[0]] = 'blue';
      pointRadius[store.selectedYear - store.years[0]] = 8;
    }

  } else if (store.selectedPeriod === 'month') {
    store.labels.name = '月份'
    store.labels.values = store.months
    if (!store.allMonth) {
      pointBackgroundColor[store.selectedMonth - 1] = 'blue';
      pointRadius[store.selectedMonth - 1] = 8;
    }
  } else if (store.selectedPeriod === 'quarter') {
    store.labels.name = '季'
    store.labels.values = store.quarters
    if (!store.allQuarter) {
      pointBackgroundColor[store.selectedQuarter - 1] = 'blue';
      pointRadius[store.selectedQuarter - 1] = 8;
    }
  }

  let lineData
  if (store.selectedPeriod === 'year') {
    lineData = store.recordsPrapared
  } else {
    lineData = store.recordsPrapared[store.selectedYear]
    // console.log("S.RP", store.recordsPrapared)
    if (store.allYear === true) {
      // console.log("S.RPSUM", store.sumMonthlyData(store.recordsPrapared))
      lineData = store.sumMonthlyData(store.recordsPrapared);

    }
  }

  let datasets = [{
    label: '營業額',
    backgroundColor: '#f87979',
    borderColor: '#f87979',
    pointBackgroundColor, // Apply point colors here
    pointRadius,
    data: lineData // Adjust data mapping as needed
  }]
  // if (userStore.user.role === 'admin') {
  //   datasets.push({
  //     label: '平台收入',
  //     backgroundColor: '#f87979',
  //     borderColor: '#f87979',
  //     pointBackgroundColor, // Apply point colors here
  //     pointRadius,
  //     data: lineData // Adjust data mapping as needed
  //   })
  // }

  // console.log(store.records.map(record => record.cashFlow || 0))

  return {
    labels: store.labels.values, // Convert months to strings for labels
    datasets
  }
})

// Chart options
const options = computed(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: '',
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `營業額：${tooltipItem.raw}`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: store.labels.name
      }
    },
    y: {
      title: {
        display: false,
        text: '營業額'
      },
      beginAtZero: true
    }
  }
}))

onMounted(() => {
  if (store.selectedPeriod === 'year') {
    store.recordsPrapared = store.turnToY(store.records);
  } else if (store.selectedPeriod === 'month') {
    store.recordsPrapared = store.turnToYM(store.records);
  } else if (store.selectedPeriod === 'quarter') {
    store.recordsPrapared = store.turnToYQ(store.records);
  }
})
</script>
