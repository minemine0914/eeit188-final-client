<template>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <template v-if="store.loginUser.role === 'normal'">
                <v-icon icon="mdi-home"></v-icon>
                &nbsp;近期訂單紀錄&nbsp;
            </template>
            <!-- *******************role to be fixed********************* -->
            <template v-if="store.loginUser.role === 'admin'">
                <v-icon icon="mdi-account"></v-icon>
                &nbsp;房東名稱：{{ currentUser.name }}&nbsp;
            </template>
            <v-icon icon="mdi-home"></v-icon>
            房源名稱：{{ store.itemsSource[0]?.house.name }}[{{
                `${store.itemsSource[0]?.house?.country}${store.itemsSource[0]?.house?.city}${store.itemsSource[0]?.house?.region}`
            }}]
            <v-chip v-if="store.itemsSource[0]?.house?.balcony" variant="outlined"> 陽台 </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.bathroom" variant="outlined"> 衛浴 </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.bedroom" variant="outlined"> 臥房 </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.kitchen" variant="outlined"> 廚房 </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.pet" variant="outlined"> 可攜帶寵物 </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.smoke" variant="outlined"> 可吸菸 </v-chip>
            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table v-model:search="search" :items="items" :headers="headers" :items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions">
            <!-- <template v-slot:header.stock>
                <div class="text-end">Stock</div>
            </template> -->

            <template v-slot:item.pics="{ item }">
                <div style="display:grid ;grid-template-columns: 1fr 1fr;">
                    <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                        <v-img :src="item.pics.doge.src" height="64" :title="item.pics.doge.title" cover></v-img>
                    </v-card>
                    <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                        <v-img :src="item.pics.cat.src" height="64" :title="item.pics.cat.title" cover></v-img>
                    </v-card>
                    <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                        <v-img :src="item.pics.smoker.src" height="64" :title="item.pics.smoker.title" cover></v-img>
                    </v-card>
                    <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                        <v-img :src="item.pics.toys.src" height="64" :title="item.pics.toys.title" cover></v-img>
                    </v-card>
                    <v-card v-if="Math.floor(Math.random() * 10) % 2" class="my-2" elevation="2" rounded>
                        <v-img :src="item.pics.good.src" height="64" :title="item.pics.good.title" cover></v-img>
                    </v-card>
                </div>
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
    // { title: '訂房者ID', value: 'bookerId', sortable: true },
    { title: '付款時間', value: 'createdAt', sortable: true },
    { title: '訂房者名稱', value: 'bookerName', sortable: true },
    { title: '性別', value: 'bookerGender', sortable: true },
    { title: '金額', value: 'cashFlow', sortable: true },
    { title: '圖片', value: 'pics', sortable: false, width: '200px' }, // Disable sorting for pics
    { title: '設施', value: 'postulate', sortable: false }, // Disable sorting for pics
];
const itemsPerPage = 3 // Default items per page
const itemsPerPageOptions = [3, 5, 10, 25, 50, 100, -1] // Options for per-page selector

const currentUser = computed(() => {
    console.log('Fetching current user...');
    const user = store.getUserBySelectedUserId(store.selectedUserId);
    console.log('Current user:', user);
    return user;
});

const items = computed(() => {
    console.log('is', store.itemsSource)
    let filtered = ''
    if (!search.value) { filtered = store.itemsSource; }
    else {
        const searchLower = search.value.toLowerCase();
        filtered = store.itemsSource.filter(item =>
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
        'pics': store.pics,
        'postulate': '',
    }))
});

</script>