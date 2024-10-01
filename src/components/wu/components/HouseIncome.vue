<template>
  <Line :data="data" :options="options" />
  <!-- <p>{{ store.selectedMonth }}月營業額：</p> -->
</template>

<script setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import { nextTick, computed, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import { useUserStore } from '@/stores/userStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useHostReportStore()
const userStore = useUserStore()
// Create a computed property for the chart data
const data = computed(() => {
  // Define an array of colors for each data point
  const cashFlowColor = '#f87979'
  const platformIncomeColor = '#d5cc4a'

  let pointBackgroundColor = Array(store.records.length).fill(cashFlowColor);
  let pointBackgroundColorPlatform = Array(store.records.length).fill(platformIncomeColor);
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
    console.log("S.RP", store.recordsPrapared)
    if (store.allYear === true) {
      // console.log("S.RPSUM", store.sumMonthlyData(store.recordsPrapared))
      lineData = store.sumMonthlyData(store.recordsPrapared);

    }
  }

  // let lineDataPlatform
  // if (store.selectedPeriod === 'year') {
  //   lineDataPlatform = store.recordsPraparedPlatform
  // } else {
  //   lineDataPlatform = store.recordsPraparedPlatform[store.selectedYear]
  //   // console.log("S.RP", store.recordsPrapared)
  //   if (store.allYear === true) {
  //     // console.log("S.RPSUM", store.sumMonthlyData(store.recordsPrapared))
  //     lineDataPlatform = store.sumMonthlyData(store.recordsPraparedPlatform);

  //   }
  // }

  let datasets = []
  // if (userStore.user.role === 'normal') {
  datasets = [{
    label: '金流',
    backgroundColor: cashFlowColor,
    borderColor: cashFlowColor,
    pointBackgroundColor, // Apply point colors here
    pointRadius,
    data: lineData // Adjust data mapping as needed
  }]
  // }
  // if (userStore.user.role === 'admin') {
  //   datasets = [{
  //     label: '平台收入',
  //     backgroundColor: platformIncomeColor,
  //     borderColor: platformIncomeColor,
  //     pointBackgroundColorPlatform, // Apply point colors here
  //     pointRadius,
  //     data: lineDataPlatform // Adjust data mapping as needed
  //   }]
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
          console.log(tooltipItem)
          return `${tooltipItem.dataset.label}：${tooltipItem.raw}`;
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
        text: '金流'
      },
      beginAtZero: true
    }
  }
}))

onMounted(() => {
  if (store.selectedPeriod === 'year') {
    store.recordsPrapared = store.turnToY(store.records);
    store.recordsPraparedPlatform = store.turnToYPlatform(store.records);
  } else if (store.selectedPeriod === 'month') {
    store.recordsPrapared = store.turnToYM(store.records);
    store.recordsPraparedPlatform = store.turnToYMPlatform(store.records);
  } else if (store.selectedPeriod === 'quarter') {
    store.recordsPrapared = store.turnToYQ(store.records);
    store.recordsPraparedPlatform = store.turnToYQPlatform(store.records);
  }
})
</script>
