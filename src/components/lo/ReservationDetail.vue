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

<script>
export default {
    data() {
        return {
            reservationRecord: {
                id: '',
                customerName: '張三',
                stayDate: '2024-09-20',
                paymentStatus: '已付款',
                totalAmount: '1500',
                roomName: '豪華房型',
            },
        };
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    methods: {
        getReservationDetail() {
            // 模擬連接資料庫來獲取詳細資訊
            console.log("Fetching reservation details for ID:", this.id);
            // 實際上可以在此處調用 API 獲取數據，並更新 reservationRecord
        },
    },
    mounted() {
        this.getReservationDetail();
    },
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>