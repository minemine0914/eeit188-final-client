<template>
    <div>
        <h2>房東報表首頁</h2>
    </div>

    <div>
        <p>選擇房源</p>
        <p>全部/ooo/xxx/...</p>
        <div class="col-4">
            <ProductSelect v-model="max" :total="total" :options="[2, 3, 4, 5, 7, 10]" @max-change="callFind">
            </ProductSelect>
        </div>
    </div>

    <p>顯示模式：文字/圖形</p>
    <select name="" id=""></select>

    <p>時間區段</p>
    <p>年度：</p>
    <p>季度：</p>
    <p>月份：</p>

    <select name="" id=""></select>

    客戶分析 pie
    房源收入 v-sparkline
    入住率
</template>

<script setup>
import ProductSelect from '@/components/ProductSelect.vue';
</script>

<style scoped></style>
