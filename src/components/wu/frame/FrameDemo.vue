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
    <table>資料</table>


    <p>時間區段</p>
    <p>年度：</p>20XX(今年)/20XX/20XX
    <p>季度：</p>Q1/Q1/Q3(本季)/Q4
    <p>月份：</p>1/2/3/.../9(本月)/...12
    <p>週次???</p>1~52
    <select name="" id=""></select>

    客戶分析 pie
    房源收入(財務報表??) v-sparkline
    入住率
</template>

<script setup>
import ProductSelect from '@/components/ProductSelect.vue';
</script>

<style scoped></style>
