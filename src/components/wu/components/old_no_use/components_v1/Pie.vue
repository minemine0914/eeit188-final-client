<template>


<Pie :data="chartData" :options="chartOptions" />

</template>

<script setup>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  let name= 'PieChart'
  let components= { Pie }

  const chartData= {
        labels: [ 'January', 'February', 'March'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20, 12]
          }
        ]
      }
const chartOptions= {
        responsive: true
      }

</script>

<style scoped>
</style>
