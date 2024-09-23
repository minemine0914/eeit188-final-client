<template>
    <v-infinite-scroll :height="300" :items="items" :onLoad="load">
        <template v-for="(item, index) in items" :key="item">
            <div :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
                Item number #{{ item }}
            </div>
        </template>
    </v-infinite-scroll>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { useHouseDetailStore } from '../../stores/houseDetailStore';


const houseDetailStore = useHouseDetailStore();
const  { discussList } = storeToRefs(houseDetailStore);

</script>
<style scoped></style>
