<!-- src/components/Selector.vue -->
<template>
    <v-card-title>
        <v-icon icon="mdi-home" />
        房源列表
        <v-icon icon="mdi-home" />
    </v-card-title>
    <v-data-table v-model="store.selectedHouseId" :headers="headers" :items="store.houses" item-value="id"
        select-strategy="single" show-select @change="update">

        <template v-slot:item.show="{ item }"> <!--狀態欄位-->
            <v-chip v-if="item.show" color="green" size="small" class="text-uppercase">
                公開中
            </v-chip>
            <v-chip v-else color="orange" size="small" class="text-uppercase">
                不公開
            </v-chip>
        </template>

        <template v-slot:item.review="{ item }"> <!--狀態欄位-->
            <v-chip :color="getStatusColor(item.review)" size="small" class="text-uppercase">
                {{ getStatusText(item.review) }}
            </v-chip>
        </template>

        <template v-slot:item.pet="{ item }"> <!--狀態欄位-->
            <v-chip v-if="item.pet" variant="outlined" prepend-icon="mdi-paw" color="green">
                可攜帶寵物 </v-chip>
            <v-chip v-else variant="outlined" prepend-icon="mdi-paw-off" color="red"> 禁止寵物 </v-chip>
        </template>

        <template v-slot:item.smoke="{ item }"> <!--狀態欄位-->
            <v-chip v-if="item.smoke" variant="outlined" prepend-icon="mdi-smoking" color="green"> 可吸菸
            </v-chip>
            <v-chip v-else variant="outlined" prepend-icon="mdi-smoking-off" color="red"> 禁止吸菸 </v-chip>
        </template>

        <template v-slot:item.kitchen="{ item }"> <!--狀態欄位-->
            <v-chip v-if="item.kitchen" variant="outlined" prepend-icon="mdi-gas-burner" color="green"> 附設廚房
            </v-chip>
            <v-chip v-else variant="outlined" prepend-icon="mdi-gas-burner" color="red"> 無廚房 </v-chip>
        </template>

        <template v-slot:item.balcony="{ item }"> <!--狀態欄位-->
            <v-chip v-if="item.balcony" variant="outlined" prepend-icon="mdi-balcony" color="green"> 附設陽台
            </v-chip>
            <v-chip v-else variant="outlined" prepend-icon="mdi-balcony" color="red"> 無陽台 </v-chip>
        </template>

        <template v-slot:item.fullAddress="{ item }"> <!--狀態欄位-->
            {{ item.country }}{{ item.city }}{{ item.region }}{{ item.address }}
        </template>

        <!-- ****************should get individual scores******************* -->
        <template v-slot:item.averageScore="{ item }">
            <v-rating :model-value="item.averageScore" color="orange-darken-2" density="compact" size="small"
                readonly></v-rating>
            {{ item.averageScore }}
        </template>
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
const headers = [
    { title: '', value: 'pics', sortable: false, width: '200px' }, // Disable sorting for pics
    { title: '種類', value: 'category', sortable: true },
    { title: '房源名稱', value: 'name', sortable: true },
    { title: '位置', value: 'fullAddress', sortable: true },
    { title: '每日價格', value: 'pricePerDay', sortable: true },
    { title: '廳數', value: 'livingDiningRoom', sortable: true },
    { title: '臥房數', value: 'bedroom', sortable: true },
    { title: '洗手間數量', value: 'restroom', sortable: true },
    { title: '浴室數量', value: 'bathroom', sortable: true },
    { title: '', value: 'balcony', sortable: true },
    { title: '', value: 'kitchen', sortable: true },
    { title: '', value: 'pet', sortable: true },
    { title: '', value: 'smoke', sortable: true },
    { title: '', value: 'show', sortable: true },
    { title: '', value: 'review', sortable: true },
    { title: '建立時間', value: 'createdAt', sortable: true },
    { title: '最後修改時間', value: 'updatedAt', sortable: true },
    { title: '平均評分', value: 'averageScore', sortable: true },
    { title: '', value: '', sortable: false, width: '100px' }, // 空白欄 調整排版用
];

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