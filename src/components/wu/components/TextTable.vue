<template>
    <v-card flat>
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-video-input-component"></v-icon> &nbsp; Find a Graphics
            Card

            <v-spacer></v-spacer>

            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line></v-text-field>
        </v-card-title>

        <v-divider></v-divider>
        <v-data-table v-model:search="search" :items="items">
            <template v-slot:header.stock>
                <div class="text-end">Stock</div>
            </template>

            <template v-slot:item.image="{ item }">
                <v-card class="my-2" elevation="2" rounded>
                    <v-img :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/${item.image}`" height="64"
                        cover></v-img>
                </v-card>
            </template>

            <template v-slot:item.rating="{ item }">
                <v-rating :model-value="item.rating" color="orange-darken-2" density="compact" size="small"
                    readonly></v-rating>
            </template>

            <template v-slot:item.stock="{ item }">
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

// Extract and map only required properties from store.records
const itemsSource = computed(() =>
    store.records
    // .map(item => ({
    //     // Extract only the required properties
    //     '房源ID': item.house?.id || item.house, // Handle case where house might be an object or string
    //     '房源名稱': item.house?.name, // Handle case where house might be an object or string
    //     '訂房者ID': item.user?.id, // Handle nested user property
    //     '訂房者名稱': item.user?.name, // Handle nested user property
    //     '性別': item?.userGender,
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
            (item.house?.name ? item.house.name.toLowerCase().includes(searchLower) : item.house.toLowerCase().includes(searchLower)) ||
            (item.user?.id && item.user.id.toLowerCase().includes(searchLower)) ||
            (item.userGender && item.userGender.toLowerCase().includes(searchLower)) // Add other fields as needed
        );
    }
    return filtered.map(item => ({
        // Extract only the required properties
        '房源ID': item.house?.id || item.house, // Handle case where house might be an object or string
        '房源名稱': item.house?.name, // Handle case where house might be an object or string
        '訂房者ID': item.user?.id, // Handle nested user property
        '訂房者名稱': item.user?.name, // Handle nested user property
        '性別': item?.userGender,
        '交易金額': `$${item?.cashFlow}`,
        '交易時間': new Date(item?.createdAt),
    }))
});

</script>
