<!-- src/components/Selector.vue -->
<template>
    <v-card>
        <v-card-title>
            <v-icon icon="mdi-account" />
            請選擇房東：
            <v-icon icon="mdi-account" />
        </v-card-title>
        <v-data-table v-model="store.selectedUserId" :headers="headers" :items="store.users" item-value="id"
            select-strategy="single" show-select @change="fetchHouses(store.selectedUserId[0])">

            <template v-slot:item.mobilePhone="{ item }">
                {{ item?.mobilePhone?.toString().substring(0, 4) }}-{{ item?.mobilePhone?.toString().substring(4, 7)
                }}-***
            </template>

            <!-- 
            <template v-slot:item.email="{ item }">
                {{ item?.email.split('@')[0] }}@***
            </template> -->

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

        </v-data-table>
    </v-card>
    <!-- <div>
        <v-icon icon="mdi-account" />
        <label for="user-select">請選擇房東：</label>
        <select id="user-select" v-model="store.selectedUserId" @change="fetchHouses(store.selectedUserId)">
            <option v-for="user in store.users" :key="user.id" :value="user.id">
                [{{ user.name }}][{{ user.id }}]
            </option>
        </select>
    </div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';

const store = useHostReportStore()

let headers = [
    { title: '', value: 'pics', width: '200px' }, // Disable sorting for pics
    { title: '名稱', value: 'name', sortable: true },
    { title: '性別', value: 'gender', sortable: true },
    { title: '手機', value: 'mobilePhone', sortable: true, align: "start" },
    { title: 'email', value: 'email', sortable: true },
    { title: '註冊時間', value: 'createdAt', sortable: true },
    { title: '最後修改時間', value: 'updatedAt', sortable: true },
    { title: '', value: '', width: '100px' }, // 空白欄 調整排版用
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



const fetchHouses = async (userId) => {
    await store.fetchHouses(userId);
    store.fetchTransactionRecordsStartingValue()
    store.fetchTransactionRecords()

};

onMounted(async () => {
    await store.findAllHost();
    store.selectedUserId = store.users[0].id
    fetchHouses(store.selectedUserId)
    //log************
    // console.log('store.selectedUser', store.selectedUser)
    // console.log('store.users', store.users)
    //log************
});
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}
</style>