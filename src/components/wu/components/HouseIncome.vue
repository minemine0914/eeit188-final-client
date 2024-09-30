<template>
  <Line :data="data" :options="options" />
  <!-- <p>{{ store.selectedMonth }}月營業額：</p> -->
</template>

<script setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import { ref, watch, computed, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import { useUserStore } from '@/stores/userStore';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useHostReportStore()
const userStore = useUserStore()

let lineData = ref([])
let lineDataPlatform

watch(() => store.selectedPeriod, (newPeriod) => {

  if (store.selectedPeriod === 'year') {
    lineData = store.recordsPrapared.cashflow
  } else {
    console.log("CSCSCSCSC", store.recordsPrapared)
    lineData = store.recordsPrapared.cashflow[store.selectedYear]
    // console.log("S.RP", store.recordsPrapared)
    if (store.allYear === true) {
      // console.log("S.RPSUM", store.sumMonthlyData(store.recordsPrapared))
      lineData = store.sumMonthlyData(store.recordsPrapared.cashflow);

    }
  }
  // Call the relevant transformation function based on newPeriod
});

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

  console.log("LLLLLLLL", lineData)

  let datasets = [{
    label: '金流',
    backgroundColor: '#f87979',
    borderColor: '#f87979',
    pointBackgroundColor, // Apply point colors here
    pointRadius,
    data: lineData // Adjust data mapping as needed
  }]
  if (userStore.user.role === 'admin') {
    datasets.push({
      label: '平台收入',
      backgroundColor: '#f87979',
      borderColor: '#f87979',
      pointBackgroundColor, // Apply point colors here
      pointRadius,
      data: lineDataPlatform // Adjust data mapping as needed
    })
  }

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
          return `金流：${tooltipItem.raw}`;
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

onMounted(async () => {
  if (store.selectedPeriod === 'year') {
    store.recordsPrapared = await store.turnToY(store.records);
    console.log("YYYYYY", store.recordsPrapared)
  } else if (store.selectedPeriod === 'month') {
    store.recordsPrapared = await store.turnToYM(store.records);
    console.log("MMMMM", store.recordsPrapared)
  } else if (store.selectedPeriod === 'quarter') {
    store.recordsPrapared = await store.turnToYQ(store.records);
  }

  if (store.selectedPeriod === 'year') {
    lineData = store.recordsPrapared.cashflow
  } else {
    lineData = store.recordsPrapared.cashflow[store.selectedYear]
    if (store.allYear === true) {
      lineData = store.sumMonthlyData(store.recordsPrapared.cashflow);

    }
  }
})
</script>
