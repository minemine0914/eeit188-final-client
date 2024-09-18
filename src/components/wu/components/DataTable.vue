<!-- src/components/DataTable.vue -->
<template>
    <div>

        <h2>Reports</h2>
        <div style="width:80vw;" v-if="store.records.length">
            <div>

                <div>
                    <!-- Radio Buttons for selecting Month or Quarter -->
                    <div>
                        <input type="radio" id="monthOrQuarter_year" value="year" v-model="store.selectedPeriod">
                        <label for="monthOrQuarter_year">Y</label>

                        <input type="radio" id="monthOrQuarter_month" value="month" v-model="store.selectedPeriod">
                        <label for="monthOrQuarter_month">M</label>

                        <input type="radio" id="monthOrQuarter_quarter" value="quarter" v-model="store.selectedPeriod">
                        <label for="monthOrQuarter_quarter">Q</label>
                    </div>

                    <!-- Display the selected period -->
                    <div>
                        <p>Selected Period: {{ store.selectedPeriod }}</p>
                    </div>

                    <!-- Conditionally render content based on selected period -->
                    <div>
                        <label for="yearRange">年份：</label>
                        <select id="yearRange" v-model="store.selectedYear">
                            <!-- <select id="yearRange" v-model="store.selectedYear" @change="updateRecordView('year')"> -->
                            <option v-for="year, key in store.years" :key="key" :value="year">{{ year }}</option>
                        </select>
                        <div v-if="store.selectedPeriod === 'year'">
                            <!-- Content for Month -->
                            <p>Year data goes here.</p>
                        </div>
                        <div v-if="store.selectedPeriod === 'month'">
                            <!-- Content for Month -->
                            <p>Month data goes here.</p>

                            <label for="monthRange">月份：</label>
                            <select id="monthRange" v-model="store.selectedMonth">
                                <option v-for="month, key in 12" :key="key" :value="month">{{ month }}</option>
                            </select>
                        </div>
                        <div v-if="store.selectedPeriod === 'quarter'">
                            <!-- Content for Quarter -->
                            <p>Quarter data goes here.</p>

                            <label for="quarterRange">季度：</label>
                            <select id="quarterRange" v-model="store.selectedQuarter">
                                <option v-for="quarter, key in 4" :key="key" :value="quarter">{{ quarter }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <DataTab />

        </div>

        <p v-else>No transaction records found.</p>

    </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import DataTab from './DataTab.vue';

const store = useHostReportStore()

store.selectedMonth = '1'
store.selectedQuarter = '1'

watch(
    () => store.selectedPeriod,
    (newVal) => {
        // if (newVal === 'year') { store.turnToY() }
        // else if (newVal === 'month') { store.turnToYM() }
        // else if (newVal === 'quarter') { store.turnToYQ() }

        //使用測試DATA**************************************************************************
        if (newVal === 'year') { store.useTestYMDC('Y') }
        else if (newVal === 'month') { store.useTestYMDC('YM') }
        else if (newVal === 'quarter') { store.useTestYMDC('YQ') }
    }
);

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