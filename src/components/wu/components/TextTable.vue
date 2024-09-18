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

            <template v-slot:item.pics="{ item }">
                <v-card class="my-2" elevation="2" rounded>
                    <v-img
                        :src="`https://cdn.cosmicjs.com/5e8bcd30-e4e8-11ee-b074-b5c8fe3ef189-vuetify-logo-circle.svg`"
                        height="64" cover></v-img><v-img
                        :src="`https://github.githubassets.com/assets/copilot-extensions-head-eeca4b3ed60b.webp`"
                        height="64" cover></v-img><v-img
                        :src="`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEf0lEQVR4Ae1XA3gjaxS9a9u2nX9mvZsM1kymz7Zt27b9XjJrK22fbdvMpA7q9n/3z/etp4M0WpzvO3Wbc+49994p7A84iLypU9vkidyioMTdERS5rQGB/IgsQVYHBL4mKPHhoMD/EhRJjiby92oiySqePr0DpBP0OmgYEy3ya1FcOYqkdhiQSFVQIFs0mfPQQw5pBKkEVvqwgMh/x4Qkgqxj2LnDky9cnjQEK/dG3GJNiEV5PSBxAyEZwOwej1GJJkCoWbRCbEYSl3WABmzwEizUnCJ/ckLEY1ufSbV4Nl+ak+9e/9gI3D37rHjcNCfGK0IT+IqAxH+PH7+Dc/OWJpFvghIpS5n4PIEbZndg2fBhbh8JypyTHjKy6V5xdDobo6kpmsTfh++LkiY+lnuJe9PGDq/WJO7uIue49mARhTJpxxYDu9IJFb/9SNnI67/aLDIN4gQWSsYD9h4Tn7DHg+jjnb7R5o+vMTUgkF//FSb0g0xCVXbTJVU5TWjF2ha08LiRBnnnizTnhMGQaajMbryeGYhxW1Nacll/XQOYeQUyDbWboW2Fv0klE78row92oXlzya7V3wSZiKqcpkuZYD1WqG1o/iFjYwbyZJ7LTAPZTe5iYuti5eZmtPiiAd9CpgLj42dCDU3kNL4SbEK8JUITy9BH+h3wN/rZ1EBu45npNuC6JVJQVwfCZgZqt0HXdBtgnPtAbTM9A7VmBtihywQDzutCnfdpA/Id0Z77dIRYB+IbYn9jZyYYOOQ62nTvDmQ32WZhjV6VdgM3RQpBDyjwTiPxRdktaq5Zw38ANiHcEr7eKsVbws/Efwdymy6uS/z32zrRpSvmUk5VqMOrTIIkwXVz6EwzA2j0OdBD7dvQpiKnSfme4jdsGkCnq0tj4mP0KVshSRBuibxlauDm6KlQFzDja7cLL81pRm9dS5jovenzHAYJBkZjhpUZmHVT2QCDB7pGC5n4v/1t6HGrRH3xjF53MXnFMxwSBOd1tDkO51cW8v+Z6b+U/o19f5aXL9wu1sjEHw7f0kFQT1x3HW2I0VGZQAv5vwDMQNSsQ5hAi9SIT3HFX3mtteuW8GqL6zMk317YDqyAU92vWTfhriGq52HyyhGdwQawg4v55y/80XXHHxZvQPhGsIpJr3iGoLCIdRNIrxLF9087fMrssS8e3UonKw15rzLKoXouwiXw5fbf4185js68931j8TeH/pp1V20rsAN8kWPMhevT4XVXI3/Fm/EhGnsPP/4eWVrXz/NqFp326CusyvrZvzUyH+IB7vw7TMQmlFOevYkKtwf32PvhOyBuUGiAnXg8lSYmvnwGdd397XYDK9mWAkT9TKie21NpwuE9tHr6g9nLyBO0CSQKmNOjTAY7YSSqcicbekg02OFiKzZpwr3uv3Elz4dkAyOlOFT31wmLjOouwarfMHL5Ia0hZcDZ4L3uubj3V+qsSKu34xNcEueR5Ye0g3SCHS5cufOIT7kV329Ccd+xBz68A1XsUuP7ELsLLH6xq61mHTvxJXdv2A9wEP8Dfp0Z4ksPIgkAAAAASUVORK5CYII=`"
                        height="64" cover></v-img><v-img
                        :src="`https://cdn.vuetifyjs.com/docs/images/graphics/gpus/2.png`" height="64" cover></v-img>
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
        '房源ID': item.house?.id || item.house, // Handle case where house might be an object or string
        '房源名稱': item.house?.name, // Handle case where house might be an object or string
        '房原位置': `${item.house?.country}${item.house?.city}${item.house?.region}`,
        '訂房者ID': item.user?.id, // Handle nested user property
        '訂房者名稱': item.user?.name, // Handle nested user property
        '性別': item?.userGender,
        '交易金額': `$${item?.cashFlow}`,
        '交易時間': new Date(item?.createdAt),
        'pics': '',
    }))
});

</script>
