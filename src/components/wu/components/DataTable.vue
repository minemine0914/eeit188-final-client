<!-- src/components/DataTable.vue -->
<template>
    <div>
        <h2>查詢結果</h2>
        <div>
            <!-- Radio Buttons for selecting Month or Quarter -->
            <v-radio-group v-model="store.selectedPeriod" inline color="brown-darken-3">
                <v-radio value="year" base-color="brown-darken-3">
                    <template v-slot:label>
                        <span class="text-black text-h5 font-weight-bold">以年顯示</span>
                    </template>
                </v-radio>
                <v-radio value="month" base-color="brown-darken-3">
                    <template v-slot:label>
                        <span class="text-black text-h5 font-weight-bold">以月顯示</span>
                    </template>
                </v-radio>
                <v-radio value="quarter" base-color="brown-darken-3">
                    <template v-slot:label>
                        <span class="text-black text-h5 font-weight-bold">以季顯示</span>
                    </template>
                </v-radio>
            </v-radio-group>
            <!-- <div>
                <input type="radio" id="monthOrQuarter_year" value="year" v-model="store.selectedPeriod"
                    @change="store.allMonth = true">
                <label for="monthOrQuarter_year">以年顯示</label>

                <input type="radio" id="monthOrQuarter_month" value="month" v-model="store.selectedPeriod">
                <label for="monthOrQuarter_month">以月顯示</label>

                <input type="radio" id="monthOrQuarter_quarter" value="quarter" v-model="store.selectedPeriod">
                <label for="monthOrQuarter_quarter">以季顯示</label>
            </div> -->

            <!-- Conditionally render content based on selected period -->
            <div>
                <div class="flexBox">
                    <v-checkbox-btn v-model="store.allYear" inline class="pe-2" color="brown-darken-3">
                        <template v-slot:label>
                            <span class="text-black text-h5 font-weight-bold">顯示所有年度的資料</span>
                        </template>
                    </v-checkbox-btn>
                    <v-select :items="store.years" v-model="store.selectedYear" :disabled="store.allYear" inline
                        label="選擇年分" class="text-black font-weight-bold"></v-select>
                </div>

                <div v-if="store.selectedPeriod === 'year'">
                    <!-- Content for Year -->
                </div>
                <div v-if="store.selectedPeriod === 'month'" class="flexBox">
                    <!-- Content for Month -->
                    <v-checkbox-btn v-model="store.allMonth" inline class="pe-2" color="brown-darken-3">
                        <template v-slot:label>
                            <span class="text-black text-h5 font-weight-bold">顯示所有月份的資料</span>
                        </template>
                    </v-checkbox-btn>
                    <v-select :items="months" v-model="store.selectedMonth" :disabled="store.allMonth" inline
                        label="選擇月份：" class="text-black font-weight-bold"></v-select>
                </div>
                <div v-if="store.selectedPeriod === 'quarter'" class="flexBox">
                    <!-- Content for Quarter -->
                    <v-checkbox-btn v-model="store.allQuarter" inline class="pe-2" color="brown-darken-3">
                        <template v-slot:label>
                            <span class="text-black text-h5 font-weight-bold">顯示所有季度的資料</span>
                        </template>
                    </v-checkbox-btn>
                    <v-select :items="quarters" v-model="store.selectedQuarter" :disabled="store.allQuarter" inline
                        label="選擇季度：" class="text-black font-weight-bold"></v-select>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watch } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()

const months = Array.from({ length: 12 }, (_, i) => i + 1)
const quarters = Array.from({ length: 4 }, (_, i) => i + 1)

watch(
    () => store.selectedPeriod,
    (newValue) => {
        if (newValue) {
            store.allMonth = true;
            store.allQuarter = true;
        }
    }
);
</script>

<style scoped>
select {
    padding: 5px 10px;
    border: 1px solid black;
}

.flexBox {
    display: flex;
}

.v-select {
    margin-left: 20px;
    max-width: 150px;
}
</style>