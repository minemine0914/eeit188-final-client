<template>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-home"></v-icon>&nbsp;近期訂單紀錄&nbsp;<v-icon icon="mdi-home"></v-icon>
            房源名稱：{{ store.records[0].house.name }}[{{ items[0].houseLocation }}]
            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table v-model:search="search" :items="items" :headers="headers">
            <!-- <template v-slot:header.stock>
                <div class="text-end">Stock</div>
            </template> -->

            <template v-slot:item.pics="{ item }">
                <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                    <v-img :src="`https://m.media-amazon.com/images/I/41Bk064aTrL._AC_UF894,1000_QL80_.jpg`" height="64"
                        title="doge" cover></v-img>
                </v-card>
                <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                    <v-img
                        :src="`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8XvMeMgm-z6_XRI9StUPdeyQLrmVQ8Xmd1w&s`"
                        height="64" title="smoker" cover></v-img>
                </v-card>
                <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                    <v-img
                        :src="`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdGzzG5LzcHNGjCKOg2gACv_8tT0ZN2lbcbw&s`"
                        height="64" title="toys" cover></v-img>
                </v-card>
                <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                    <v-img :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/2.png`" height="64" cover></v-img>
                </v-card>
            </template>

            <template v-slot:item.rating="{ item }">
                <v-rating :model-value="item.rating" color="orange-darken-2" density="compact" size="small"
                    readonly></v-rating>
            </template>

            <template v-slot:item.house="{ item }">
                <div class="text-end">
                    <v-chip :color="item.stock ? 'green' : 'red'" :text="item.stock ? 'In stock' : 'Out of stock'"
                        class="text-uppercase" size="small" label></v-chip>
                </div>
            </template>



        </v-data-table>
    </v-card>
</template>
<script setup>
import { useHostReportStore } from '@/stores/hostReportStore';
import { computed, ref } from 'vue';

const store = useHostReportStore();
const search = ref(''); // Using ref for reactivity in Vue 3 setup function

// Define the headers for the data table
const headers = [
    // { title: '房源ID', value: 'houseId', sortable: true },
    // { title: '房源名稱', value: 'houseName', sortable: true },
    // { title: '房源位置', value: 'houseLocation', sortable: true },
    { title: '訂房者ID', value: 'bookerId', sortable: true },
    { title: '訂房者名稱', value: 'bookerName', sortable: true },
    { title: '性別', value: 'bookerGender', sortable: true },
    { title: '金額', value: 'cashFlow', sortable: true },
    { title: '付款時間', value: 'createdAt', sortable: true },
    { title: '圖片', value: 'pics', sortable: false, width: '200px' }, // Disable sorting for pics
];

// Extract and map only required properties from store.records
const itemsSource = computed(() =>
    store.records
    // .map(item => ({
    //     // Extract only the required properties
    //     'houseId': item.house?.id || item.house, // Handle case where house might be an object or string
    //     'houseName': item.house?.name, // Handle case where house might be an object or string
    //     'bookerId': item.user?.id, // Handle nested user property
    //     'bookerName': item.user?.name, // Handle nested user property
    //     'bookerGender': item?.userGender,
    // }))
);

const items = computed(() => {
    console.log('is', itemsSource.value)
    let filtered = ''
    if (!search.value) { filtered = itemsSource.value; }
    else {
        const searchLower = search.value.toLowerCase();
        filtered = itemsSource.value.filter(item =>
            (item.house?.id ? item.house.id.toLowerCase().includes(searchLower) : item.house.toLowerCase().includes(searchLower)) ||
            (item.house?.name.toLowerCase().includes(searchLower)) ||
            (item.house?.country.toLowerCase().includes(searchLower)) ||
            (item.house?.city.toLowerCase().includes(searchLower)) ||
            (item.house?.region.toLowerCase().includes(searchLower)) ||
            (item.user?.id && item.user.id.toLowerCase().includes(searchLower)) ||
            (item.createdAt.includes(searchLower)) ||
            (item.userGender && item.userGender.toLowerCase().includes(searchLower)) // Add other fields as needed
        );
    }
    return filtered.map(item => ({
        // Extract only the required properties
        'houseId': item.house?.id || item.house, // Handle case where house might be an object or string
        'houseName': item.house?.name, // Handle case where house might be an object or string
        'houseLocation': `${item.house?.country}${item.house?.city}${item.house?.region}`,
        'bookerId': item.user?.id, // Handle nested user property
        'bookerName': item.user?.name, // Handle nested user property
        'bookerGender': item?.userGender,
        'cashFlow': `$${item?.cashFlow}`,
        'createdAt': new Date(item?.createdAt),
        'pics': '',
    }))
});

</script>