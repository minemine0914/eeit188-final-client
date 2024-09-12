<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-subtitle>訂單編號: {{ id }}</v-card-subtitle>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>預約名稱: {{ reservation.name }}</v-list-item-title>
                                    <v-list-item-subtitle>日期: {{ reservation.date }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>訂單狀態: {{ reservation.paymentStatus }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>總金額: {{ reservation.totalAmount }} 元</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房客名稱: {{ reservation.customerName }}</v-list-item-title>
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
            reservation: {
                id: '',
                name: '測試預約',
                date: '2024-09-15',
                paymentStatus: '已付款',
                totalAmount: '1500',
                customerName: '張三',
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
            // 連接資料庫來取得訂單的詳細資訊
            // 現在只是使用測試資料
            console.log("Reservation ID: ", this.reservationId);
        },
    },
    mounted() {
        // 將來這裡會連接資料庫來取得訂單的詳細資訊
        // 現在只是使用測試資料
        console.log("Reservation ID: ", this.reservationId);
    },
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>