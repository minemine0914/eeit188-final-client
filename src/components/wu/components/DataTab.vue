<template>
    <v-card>
        <v-tabs v-model="tab" align-tabs="left" bg-color="primary" grow>
            <v-tab value="one">圖表</v-tab>
            <v-tab value="two">表格</v-tab>
        </v-tabs>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one">
                    <div class="chartContainer">
                        <div class="chartContent">
                            <HouseIncome />
                        </div>
                        <div class="chartContent">
                            <GenderPie />
                        </div>

                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item value="two">
                    <TextTable />
                </v-tabs-window-item>

            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';
import HouseIncome from '@/components/wu/components/HouseIncome.vue';
import TextTable from '@/components/wu/components/TextTable.vue';
import GenderPie from '@/components/wu/components/genderPie.vue';

const tab = ref(null)

</script>

<style scoped>
.chartContainer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.chartContent {
    width: 40%;
}
</style>