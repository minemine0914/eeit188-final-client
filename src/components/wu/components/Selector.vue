<!-- src/components/Selector.vue -->
<template>
    <v-card>
        <v-card-title>
            <v-icon icon="mdi-home" />
            房源列表
            <v-icon icon="mdi-home" />
        </v-card-title>

        <v-card-title class="d-flex align-center pe-2">
            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line />
        </v-card-title>

        <v-data-table v-model:search="search" v-model="store.selectedHouseId" :headers="headers" :items="items"
            item-value="id" select-strategy="single" show-select @change="update">

            <template v-slot:item.show="{ item }">
                <v-chip v-if="item.show" color="green" size="small" class="text-uppercase">
                    公開中
                </v-chip>
                <v-chip v-else color="orange" size="small" class="text-uppercase">
                    不公開
                </v-chip>
            </template>

            <template v-slot:item.capacity="{ item }">
                <v-icon icon="mdi-account-supervisor" />{{ item.adult }}大 <v-icon icon="mdi-teddy-bear" />{{ item.child
                }}小
            </template>

            <template v-slot:item.review="{ item }">
                <v-chip :color="getStatusColor(item.review)" size="small" class="text-uppercase">
                    {{ getStatusText(item.review) }}
                </v-chip>
            </template>

            <template v-slot:item.pet="{ item }">
                <v-chip v-if="item.pet" variant="outlined" prepend-icon="mdi-paw" color="green">
                    可攜帶寵物 </v-chip>
                <v-chip v-else variant="outlined" prepend-icon="mdi-paw-off" color="red"> 禁止寵物 </v-chip>
            </template>

            <template v-slot:item.smoke="{ item }">
                <v-chip v-if="item.smoke" variant="outlined" prepend-icon="mdi-smoking" color="green"> 可吸菸
                </v-chip>
                <v-chip v-else variant="outlined" prepend-icon="mdi-smoking-off" color="red"> 禁止吸菸 </v-chip>
            </template>

            <template v-slot:item.kitchen="{ item }">
                <v-chip v-if="item.kitchen" variant="outlined" prepend-icon="mdi-gas-burner" color="green"> 附設廚房
                </v-chip>
                <v-chip v-else variant="outlined" prepend-icon="mdi-gas-burner" color="red"> 無廚房 </v-chip>
            </template>

            <template v-slot:item.balcony="{ item }">
                <v-chip v-if="item.balcony" variant="outlined" prepend-icon="mdi-balcony" color="green"> 附設陽台
                </v-chip>
                <v-chip v-else variant="outlined" prepend-icon="mdi-balcony" color="red"> 無陽台 </v-chip>
            </template>

            <template v-slot:item.fullAddress="{ item }">
                {{ item.country }}{{ item.city }}{{ item.region }}{{ item.address }}
            </template>

            <template v-slot:item.createdAt="{ item }">
                {{ new Date(item.createdAt).getFullYear() }}年{{ String(new Date(item.createdAt).getMonth() +
                    1).padStart(2,
                        '0') }}月{{ String(new Date(item.createdAt).getDate()).padStart(2, '0') }}日 {{ String(new
                    Date(item.createdAt).getHours()).padStart(2, '0') }}:{{ String(new
                    Date(item.createdAt).getMinutes()).padStart(2, '0') }}:{{ String(new
                    Date(item.createdAt).getSeconds()).padStart(2, '0') }}
            </template>

            <template v-slot:item.updatedAt="{ item }">
                <template v-if="item.updatedAt">
                    {{ new Date(item.updatedAt).getFullYear() }}年{{ String(new Date(item.updatedAt).getMonth() +
                        1).padStart(2, '0') }}月{{ String(new Date(item.updatedAt).getDate()).padStart(2, '0') }}日 {{
                        String(new
                            Date(item.updatedAt).getHours()).padStart(2, '0') }}:{{ String(new
                        Date(item.updatedAt).getMinutes()).padStart(2, '0') }}:{{ String(new
                        Date(item.updatedAt).getSeconds()).padStart(2, '0') }}
                </template>
            </template>

            <template v-slot:item.click="{ item }">
                <v-icon icon="mdi-eye" />&nbsp;{{ item.click }}
            </template>

            <template v-slot:item.share="{ item }">
                <v-icon icon="mdi-share" />&nbsp;{{ item.share }}
            </template>

            <template v-slot:item.averageScore="{ item }">
                <v-rating :model-value="item.averageScore" color="orange-darken-2" density="compact" size="small"
                    readonly></v-rating>
            </template>
        </v-data-table>
    </v-card>
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
import { ref, computed } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import { useUserStore } from '../../../stores/userStore';

const store = useHostReportStore()
const userStore = useUserStore()
store.isLoading = ref(false)
const search = ref('');
let headers = []
// 平台和房東共用此表格，先判定登入者權限，再決定欄位順序
if (userStore.user.role === 'normal') {
    headers = [
        { title: '', value: 'pics', width: '200px' }, // Disable sorting for pics
        { title: '種類', value: 'category', sortable: true },
        { title: '房源名稱', value: 'name', sortable: true },
        { title: '位置', value: 'fullAddress', sortable: true },
        { title: '', value: 'click', sortable: true, align: "center" },
        { title: '', value: 'share', sortable: true, align: "center" },
        { title: '平均評分', value: 'averageScore', sortable: true, align: "end" },
        { title: '', value: 'show', sortable: true, align: "center" },
        { title: '', value: 'review', sortable: true, align: "center" },
        { title: '每日價格', value: 'pricePerDay', sortable: true, align: "end" },
        { title: '房間容量', value: 'capacity', sortable: true, align: "end" },
        { title: '廳數', value: 'livingDiningRoom', sortable: true, align: "end" },
        { title: '臥房數', value: 'bedroom', sortable: true, align: "end" },
        { title: '洗手間數量', value: 'restroom', sortable: true, align: "end" },
        { title: '浴室數量', value: 'bathroom', sortable: true, align: "end" },
        { title: '', value: 'balcony', sortable: true, align: "center" },
        { title: '', value: 'kitchen', sortable: true, align: "center" },
        { title: '', value: 'pet', sortable: true, align: "center" },
        { title: '', value: 'smoke', sortable: true, align: "center" },
        { title: '建立時間', value: 'createdAt', sortable: true },
        { title: '最後修改時間', value: 'updatedAt', sortable: true },
        { title: '', value: '', width: '100px' }, // 空白欄 調整排版用
    ];
} else if (userStore.user.role == 'admin') {
    headers = [
        { title: '', value: 'pics', width: '200px' }, // Disable sorting for pics
        { title: '種類', value: 'category', sortable: true },
        { title: '房源名稱', value: 'name', sortable: true },
        { title: '位置', value: 'fullAddress', sortable: true },
        { title: '', value: 'show', sortable: true, align: "center" },
        { title: '', value: 'review', sortable: true, align: "center" },
        { title: '平均評分', value: 'averageScore', sortable: true, align: "end" },
        { title: '', value: 'click', sortable: true, align: "end" },
        { title: '', value: 'share', sortable: true, align: "end" },
        { title: '每日價格', value: 'pricePerDay', sortable: true, align: "end" },
        { title: '房間容量', value: 'capacity', sortable: true, align: "end" },
        { title: '廳數', value: 'livingDiningRoom', sortable: true, align: "end" },
        { title: '臥房數', value: 'bedroom', sortable: true, align: "end" },
        { title: '洗手間數量', value: 'restroom', sortable: true, align: "end" },
        { title: '浴室數量', value: 'bathroom', sortable: true, align: "end" },
        { title: '', value: 'balcony', sortable: true, align: "center" },
        { title: '', value: 'kitchen', sortable: true, align: "center" },
        { title: '', value: 'pet', sortable: true, align: "center" },
        { title: '', value: 'smoke', sortable: true, align: "center" },
        { title: '建立時間', value: 'createdAt', sortable: true },
        { title: '最後修改時間', value: 'updatedAt', sortable: true },
        { title: '', value: '', width: '100px' }, // 空白欄 調整排版用
    ];
}

const items = computed(() => {
    // console.log('is', store.itemsSource)
    let filtered = ''
    if (!search.value) { filtered = store.houses; }
    else {
        const searchLower = search.value.toLowerCase();

        filtered = store.houses.filter(item =>
            (item?.category?.toLowerCase().includes(searchLower)) ||
            (item?.id?.toLowerCase().includes(searchLower)) ||
            (item?.name?.toLowerCase().includes(searchLower)) ||
            (item?.country?.toLowerCase().includes(searchLower)) ||
            (item?.city?.toLowerCase().includes(searchLower)) ||
            (item?.region?.toLowerCase().includes(searchLower)) ||
            (item?.address?.toLowerCase().includes(searchLower)) ||
            (item?.show?.toString().includes(searchLower)) ||
            (item?.review?.toString().includes(searchLower)) ||
            (item?.averageScore.toString().includes(searchLower)) ||
            (item?.click?.toString().includes(searchLower)) ||
            (item?.share?.toString().includes(searchLower)) ||
            (item?.pricePerDay?.toString().includes(searchLower)) ||
            (item?.adult?.toString().includes(searchLower)) ||
            (item?.child?.toString().includes(searchLower)) ||
            (item?.livingDiningRoom?.toString().includes(searchLower)) ||
            (item?.bedroom?.toString().includes(searchLower)) ||
            (item?.restroom?.toString().includes(searchLower)) ||
            (item?.bathroom?.toString().includes(searchLower)) ||
            (item?.balcony?.toString().includes(searchLower)) ||
            (item?.kitchen?.toString().includes(searchLower)) ||
            (item?.pet?.toString().includes(searchLower)) ||
            (item?.smoke?.toString().includes(searchLower)) ||
            (item?.createdAt?.includes(searchLower))
        );
    }
    return filtered
});

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
    store.selectedPeriod = 'month'
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