<template>
  <Line :data="data" :options="options" />
</template>

<script setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import { computed, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const store = useHostReportStore()
// Create a computed property for the chart data
const data = computed(() => {
  // Define an array of colors for each data point
  let pointColors = store.records.map((record, index) =>
    index === store.selectedMonth - 1 ? 'blue' : '#f87979' // Change color of the third point to red, others to black
  )

  if (store.selectedPeriod === 'year') {
    store.labels.name = 'YEAR'
    store.labels.values = store.years
    pointColors = store.records.map((record, index) =>
      index === store.selectedYear - store.years[0] ? 'blue' : '#f87979' // Change color of the third point to red, others to black
    )
  } else if (store.selectedPeriod === 'month') {
    store.labels.name = 'MONTH'
    store.labels.values = store.months
    pointColors = store.records.map((record, index) =>
      index === store.selectedMonth - 1 ? 'blue' : '#f87979' // Change color of the third point to red, others to black
    )
  } else if (store.selectedPeriod === 'quarter') {
    store.labels.name = 'QUARTER'
    store.labels.values = store.quarters
    pointColors = store.records.map((record, index) =>
      index === store.selectedQuarter - 1 ? 'blue' : '#f87979' // Change color of the third point to red, others to black
    )
  }

  return {
    labels: store.labels.values, // Convert months to strings for labels
    datasets: [
      {
        label: 'Monthly Data',
        backgroundColor: '#f87979',
        borderColor: '#f87979',
        pointBackgroundColor: pointColors, // Apply point colors here

        data: store.records.map(record => record.cashFlow || 0) // Adjust data mapping as needed
      }
    ]
  }
})

// Chart options
const options = computed(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `Value: ${tooltipItem.raw}`;
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
        display: true,
        text: 'Value'
      },
      beginAtZero: true
    }
  }
}))

</script>
