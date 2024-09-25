<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>預約詳情</v-card-title>
                    <v-card-subtitle>預約編號: {{ id }}</v-card-subtitle>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房客名稱: {{ reservationRecord.customerName }}</v-list-item-title>
                                    <v-list-item-subtitle>入住日期: {{ reservationRecord.stayDate }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>付款狀態: {{ reservationRecord.paymentStatus }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>總金額: {{ reservationRecord.totalAmount }} 元</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房間名稱: {{ reservationRecord.roomName }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagement'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const reservationRecord = ref({
    id: '',
    customerName: '',
    stayDate: '',
    paymentStatus: '',
    totalAmount: '',
    roomName: '',
})

const hostManagementStore = useHostManagementStore()

const getReservationDetail = async () => {
    try {
        const data = await hostManagementStore.fetchReservationDetail(props.id) // 從後端 API 獲取預約詳細資料
        Object.assign(reservationRecord.value, data) // 將數據綁定到 reservationRecord
    } catch (error) {
        console.error('獲取預約詳情失敗:', error)
    }
}

onMounted(() => {
    getReservationDetail() // 組件掛載時獲取預約詳細資料
})
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>
