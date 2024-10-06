<!-- src/components/Selector.vue -->
<template>
    <v-card>
        <v-card-title>
            <v-icon icon="mdi-account" />
            請選擇房東：
            <v-icon icon="mdi-account" />
        </v-card-title>

        <v-card-title class="d-flex align-center pe-2">
            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line />
        </v-card-title>

        <v-data-table v-model:search="search" v-model="store.selectedUserId" :headers="headers" :items="items"
            item-value="id" select-strategy="single" show-select @change="fetchHouses(store.selectedUserId[0])"
            class="text-h6">

            <template v-slot:item.name="{ item }">
                <v-img :src="item.avatarBase64 ? item.avatarBase64 : emptyUserAvavtarImage" width="1rem"
                    class="avatar" />{{ item.name }}
                <v-icon icon="mdi-crown" color="orange" v-if="item.houseCount == maxHouseCount" />
            </template>

            <template v-slot:item.mobilePhone="{ item }">
                {{ item?.mobilePhone?.toString().substring(0, 4) }}-{{ item?.mobilePhone?.toString().substring(4, 7)
                }}-***
            </template>

            <!-- <template v-slot:item.houseCount="{ item }">
                <v-icon icon="mdi-crown" color="orange" v-if="item.houseCount == maxHouseCount" />
                {{ item.houseCount }}
            </template> -->

            <template v-slot:item.email="{ item }">
                {{ item?.email?.split('@')[0] }}@***
            </template>

            <template v-slot:item.createdAt="{ item }">
                <template v-if="item.createdAt">
                    {{ store.formatDate(item.createdAt) }}
                </template>
                <template v-else>--</template>
            </template>

            <template v-slot:item.updatedAt="{ item }">
                <template v-if="item.updatedAt">
                    {{ store.formatDate(item.updatedAt) }}
                </template>
                <template v-else>--</template>
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
import { ref, onMounted, computed } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import emptyUserAvavtarImage from "@/assets/user.png";

const store = useHostReportStore()
const search = ref('');
const maxHouseCount = ref(0)


let headers = [
    { title: '', value: 'pics', width: '20px' }, // Disable sorting for pics
    { title: '名稱', value: 'name', sortable: true },
    { title: '擁有房源數', value: 'houseCount', sortable: true, align: "end" },
    { title: '性別', value: 'gender', sortable: true },
    { title: '手機', value: 'mobilePhone', sortable: true, align: "start" },
    { title: 'email', value: 'email', sortable: true },
    { title: '註冊時間', value: 'createdAt', sortable: true },
    { title: '最後修改時間', value: 'updatedAt', sortable: true },
    { title: '', value: '', width: '100px' }, // 空白欄 調整排版用
];

const items = computed(() => {
    // console.log('is', store.itemsSource)
    let filtered = ''
    if (!search.value) { filtered = store.users; }
    else {
        const searchLower = search.value.toLowerCase();

        filtered = store.users.filter(item =>
            (item?.name?.toLowerCase().includes(searchLower)) ||
            (item?.gender?.toLowerCase().includes(searchLower)) ||
            (item?.mobilePhone?.toLowerCase().includes(searchLower)) ||
            (item?.email?.toLowerCase().includes(searchLower)) ||
            (item?.createdAt?.toLowerCase().includes(searchLower)) ||
            (item?.updatedAt?.toLowerCase().includes(searchLower)) ||
            (item?.id?.toLowerCase().includes(searchLower))
        );
    }
    maxHouseCount.value = filtered.reduce((max, item) => {
        return item?.houseCount > max ? item?.houseCount : max;
    }, 0);
    return filtered
    // return filtered.map(item => {
    //     return {
    //         ...item,
    //         'houseCount': item?.houses?.length,
    //     }
    // })
});

const fetchHouses = async (userId) => {
    await store.fetchHouses(userId);
    store.fetchTransactionRecordsStartingValue()
    store.fetchTransactionRecords()

};

onMounted(async () => {
    await store.findAllHost();
    store.selectedUserId = store.users[0].id
    fetchHouses(store.selectedUserId)
});
</script>

<style scoped>
select {
    border: 1px solid black;
    background-color: #aff;
}

.avatar {
    display: inline-block;
    margin-right: 0.5rem;
}
</style>