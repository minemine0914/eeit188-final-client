<!-- src/components/DataTable.vue -->
<template>
    <div>
        <h2>查詢結果</h2>
        <div>
            <!-- Radio Buttons for selecting Month or Quarter -->
            <div>
                <input type="radio" id="monthOrQuarter_year" value="year" v-model="store.selectedPeriod"
                    @change="store.allMonth = true">
                <label for="monthOrQuarter_year">以年顯示</label>

                <input type="radio" id="monthOrQuarter_month" value="month" v-model="store.selectedPeriod">
                <label for="monthOrQuarter_month">以月顯示</label>

                <input type="radio" id="monthOrQuarter_quarter" value="quarter" v-model="store.selectedPeriod">
                <label for="monthOrQuarter_quarter">以季顯示</label>
            </div>

            <!-- Conditionally render content based on selected period -->
            <div>
                <input id="allYear" type="checkbox" v-model="store.allYear"><label for="allYear">顯示所有年度的資料</label>
                &nbsp;
                <label for="yearRange">選擇年份：</label>
                <select id="yearRange" v-model="store.selectedYear" :disabled="store.allYear">
                    <!-- <select id="yearRange" v-model="store.selectedYear" @change="updateRecordView('year')"> -->
                    <option v-for="year, key in store.years" :key="key" :value="year">{{ year }}</option>
                </select>
                <div v-if="store.selectedPeriod === 'year'">
                    <!-- Content for Year -->
                </div>
                <div v-if="store.selectedPeriod === 'month'">
                    <!-- Content for Month -->
                    <input id="allMonth" type="checkbox" v-model="store.allMonth"><label
                        for="allMonth">顯示所有月份的資料</label>
                    &nbsp;
                    <label for="monthRange">選擇月份：</label>
                    <select id="monthRange" v-model="store.selectedMonth" :disabled="store.allMonth">
                        <option v-for="month, key in 12" :key="key" :value="month">{{ month }}</option>
                    </select>
                </div>
                <div v-if="store.selectedPeriod === 'quarter'">
                    <!-- Content for Quarter -->
                    <input id="allQuarter" type="checkbox" v-model="store.allQuarter"><label
                        for="allQuarter">顯示所有季度的資料</label>
                    &nbsp;
                    <label for="quarterRange">選擇季度：</label>
                    <select id="quarterRange" v-model="store.selectedQuarter" :disabled="store.allQuarter">
                        <option v-for="quarter, key in 4" :key="key" :value="quarter">{{ quarter }}</option>
                    </select>

                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { watch } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()

watch(() => store.selectedPeriod, (newPeriod) => {
    if (newPeriod === 'year') {
        store.recordsPrapared = store.turnToY(store.records);
        console.log('SRP', store.recordsPrapared)
    } else if (newPeriod === 'month') {
        store.recordsPrapared = store.turnToYM(store.records);
    } else if (newPeriod === 'quarter') {
        store.recordsPrapared = store.turnToYQ(store.records);
    }
});

</script>

<style lang="css" scoped>
table,
th,
td {
    border: 1px solid black;
}

select {
    padding: 5px 10px;
    border: 1px solid black;
}

.chartContainer {
    display: flex;
    justify-content: left;
    align-items: center;
    flex-direction: row;
}
</style>