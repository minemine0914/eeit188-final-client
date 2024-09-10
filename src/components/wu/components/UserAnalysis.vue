<template>
<h3>客戶分析</h3>
<label for="showMethod">顯示方式：</label>
<select id="showMethod">
    <option value="text">文字</option>
    <option value="image">圖形</option>
</select>

<table>
    <thead>
    <tr>
        <th>人數</th>
        <th>比例</th>
        <th>性別</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
    <tr>
        <th>入住人數</th>
        <th>訂單數</th>
        <th>比例</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
    <tr>
        <th>年齡層????</th>
        <th>人數</th>
        <th>比例</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
    <tr>
        <th>訂房者年齡層</th>
        <th>人數</th>
        <th>比例</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>

<table>
    <thead>
    <tr>
        <th>訂房者居住地?????</th>
        <th>人數</th>
        <th>比例</th>
    </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
        </tr>
    </tbody>
</table>




<div style="width:300px;">
    <!-- <Bar :data="chartData" /> -->
    <Pie :data="chartData" />
    <input type="text" v-model.number="chartData.datasets[0].data[0]">
    <input type="text" v-model.number="chartData.datasets[0].data[1]">
    <input type="text" v-model.number="chartData.datasets[0].data[2]">
  </div>

</template>

<script setup>
import { reactive } from 'vue'
// import { Bar } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)


let n1=10
let n2=20
let n3=30


// Reactive chart data
const chartData = reactive({
  labels: ['男', '女', '未知'],
  datasets: [
    {
      label: '',
      backgroundColor: ['#f87979','#d5cc4a','#83d6ba'],
      data: [n1/(n1+n2+n3)*100, n2/(n1+n2+n3)*100, n3/(n1+n2+n3)*100]
    }
  ]
})

</script>

<style scoped>
</style>
