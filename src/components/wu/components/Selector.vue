<!-- src/components/Selector.vue -->
<template>
    <v-data-table v-model="store.selectedHouseId" :headers="headers" :items="store.houses" item-value="id"
        select-strategy="single" show-select @change="update">
        <template v-slot:item.review="{ item }"> <!--狀態欄位-->
            <v-chip :color="getStatusColor(item.review)" size="small" class="text-uppercase">
                {{ getStatusText(item.review) }}
            </v-chip></template>
    </v-data-table>

    <!-- 
    <div>
        <label for="house-select">請選擇房源：</label>
        <select id="house-select" v-model="store.selectedHouseId" @change="update">
            <option v-for="house in store.houses" :key="house.id" :value="house.id">
                [{{ house.name }}][{{ house.country }}{{ house.city }}{{ house.region }}]
            </option>
        </select>
    </div> -->
</template>

<script setup>
import { ref } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()
store.isLoading = ref(false)

// const headers = [
// { title: '付款時間', value: 'createdAt', sortable: true },
// { title: '訂房者名稱', value: 'bookerName', sortable: true },
// { title: '性別', value: 'formattedBookerGender', sortable: true },
// { title: '金額', value: 'cashFlow', sortable: true },
// { title: '評分', value: 'score', sortable: true },
// { title: '圖片', value: 'pics', sortable: false, width: '200px' }, // Disable sorting for pics
// { title: '', value: '', sortable: false, width: '100px' }, // 空白欄 調整排版用
// ];

const getStatusColor = (review) => {
    switch (review) {
        case null: return 'orange'; // 待審核
        case true: return 'green'; // 審核通過
        case false: return 'red'; // 審核失敗
        default: return 'grey'; // 未知狀態
    }
}

const getStatusText = (review) => {
    switch (review) {
        case null:
            return '待審核';
        case true:
            return '審核通過';
        case false:
            return '審核失敗';
        default:
            return '確認中';
    }
}

const update = async () => {
    store.selectedHouseId = store.selectedHouseId[0]
    store.isLoading = true;
    try {
        store.fetchTransactionRecordsStartingValue()
        store.fetchTransactionRecords()
    } finally {
        // Ensure loading state is set to false after fetching

        setTimeout(() => {
            store.isLoading = false;
        }, 500);// setTimeout for test
    }
}
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>