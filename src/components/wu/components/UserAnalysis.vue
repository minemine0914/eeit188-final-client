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



<div id="chart">
        <apexchart type="pie" width="380" :options="chartOptions" :series="series">
        </apexchart>
</div>
    


</template>

<script setup>
//  new Vue({
//         el: '#app',
//         components: {
//           apexchart: VueApexCharts,
//         },
//         data: {
          
//           series: [44, 55, 13, 43, 22],
//           chartOptions: {
//             chart: {
//               width: 380,
//               type: 'pie',
//             },
//             labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
//             responsive: [{
//               breakpoint: 480,
//               options: {
//                 chart: {
//                   width: 200
//                 },
//                 legend: {
//                   position: 'bottom'
//                 }
//               }
//             }]
//           },
          
          
//         },
        
//       })
          
          
        

</script>

<style scoped>
</style>
