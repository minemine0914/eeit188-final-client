<template>
    <h3>客戶分析</h3>
    <label for="showMethod">顯示方式：</label>
    <select id="showMethod" v-model="showMethod">
        <option value="1">文字</option>
        <option value="0">圖形</option>
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
        <div>
            <input type="text" v-model.number="maleCount" size="5" hidden>
            <p>男：{{ maleCount }}人，佔{{ maleCount / (maleCount + femaleCount +
                otherCount) * 100
                }}%</p>
            <input type="text" v-model.number="femaleCount" size="5" hidden>
            <p>女：{{ femaleCount }}人，佔{{
                femaleCount / (maleCount + femaleCount + otherCount) * 100 }}%</p>
            <input type="text" v-model.number="otherCount" size="5" hidden>
            <p>其他：{{ otherCount }}人，佔{{
                otherCount / (maleCount + femaleCount + otherCount) * 100 }}%</p>
        </div>
        <Pie v-if="showMethod == 0" :data="genderData" />
    </div>
    <!-- <div style="width:300px;">
        <Pie :data="birthdayData" />

    </div> -->
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import axiosapi from '@/plugins/axios'
// import { Bar } from 'vue-chartjs'
// import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
// ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

const showMethod = ref(0)


let current = ref(1)
let start = ref(0)

let users = ref([])

let maleCount = ref(0)
let femaleCount = ref(0)
let otherCount = ref(0)

// Reactive chart data

const genderData = computed(() => {
    const total = maleCount.value + femaleCount.value + otherCount.value
    return {
        labels: ['男', '女', '未知'],
        datasets: [
            {
                label: '比例',
                backgroundColor: ['#f87979', '#d5cc4a', '#83d6ba'],
                data: [
                    total ? (maleCount.value / total) * 100 : 0,
                    total ? (femaleCount.value / total) * 100 : 0,
                    total ? (otherCount.value / total) * 100 : 0
                ]
            }
        ]
    }
})


const birthdayData = computed(() => {
    // const total = maleCount.value + femaleCount.value + otherCount.value
    return {
        labels: ['男', '女', '未知'],
        datasets: [
            {
                label: '比例',
                backgroundColor: ['#f87979', '#d5cc4a', '#83d6ba'],
                data: [
                    0
                ]
            }
        ]
    }
})


function callFind(page) {
    console.log("callFind", page);

    // if(page) {
    //     current.value = page;
    //     start.value = (page - 1) * max.value;
    // } else {
    current.value = 1;
    start.value = 0;
    // }

    // if(findName.value==="") {
    //     findName.value = null;
    // }

    // let body = {
    //     "start": start.value,
    //     "max": max.value,
    //     "dir": false,
    //     "order": "id",
    //     "name": findName.value
    // };
    let body = {
        "start": 0,
        "max": 10,
        "dir": false,
        "order": "id",
    };

    axiosapi.get("/user/", body).then(function (response) {
        console.log("callFind response", response);
        users.value = response.data.users;
        checkGender(users.value)
        checkBirthdayInRange(users.value)
        // total.value = response.data.count;
        // pages.value = Math.ceil(total.value / max.value);
        // lastPageRows.value = total.value % max.value;

        // setTimeout(function() {
        //     Swal.close();
        // }, 500);
    }).catch(function (error) {
        console.log("callFind error", error);
        // Swal.fire({
        //     text: "錯誤："+error.message,
        //     icon: "error",
        // });
    });
}

function checkGender(userList) {
    maleCount.value = userList.filter(user => user.gender === 'male').length
    femaleCount.value = userList.filter(user => user.gender === 'female').length
    otherCount.value = userList.filter(user => user.gender === 'other').length
}

const countInRange = ref(0)

function checkBirthdayInRange(userList, start, end) {
    // Ensure startYear and endYear are strings for comparison
    start = start || 1990
    end = end || 2000

    // Count users whose birth year is within the specified range
    countInRange.value = userList.filter(user => {
        const year = user.birthday.substring(0, 4)
        return year >= start && year <= end
    }).length
}





onMounted(function () {
    callFind();
})

</script>

<style scoped></style>
