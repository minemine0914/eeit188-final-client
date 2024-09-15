<template>


<Bar :data="chartData" :options="chartOptions" />

</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  let name= 'BarChart'
  let components= { Bar }

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
