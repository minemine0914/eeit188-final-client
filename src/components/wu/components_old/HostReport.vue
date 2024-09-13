<template>
    <h2>房東報表首頁</h2>
    <h4>時間區隔</h4>
    <h3>客戶分析</h3>
    <h3>房源收入</h3>

    <div>
        <Navigationbar></Navigationbar>
    </div>
    <div class="col-4">
        <ProductSelect v-model="max" :total="total" :options="[2, 3, 4, 5, 7, 10]" @max-change="callFind">
        </ProductSelect>
    </div>
    <RouterView></RouterView>







    <!-- <UserAnalysis></UserAnalysis>

    <HouseIncome></HouseIncome> -->

</template>

<script setup>
import UserAnalysis from './UserAnalysis.vue';
import HouseIncome from './HouseIncome.vue';
import Navigationbar from '@/components/wu/components/Navigationbar.vue';

</script>

<style scoped></style>
