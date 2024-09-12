<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>訂單詳情</v-card-title>
                    <v-card-subtitle>訂單編號: {{ id }}</v-card-subtitle>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房客名稱: {{ orderRecord.customerName }}</v-list-item-title>
                                    <v-list-item-subtitle>入住日期: {{ orderRecord.stayDate }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>訂單狀態: {{ orderRecord.paymentStatus }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>總金額: {{ orderRecord.totalAmount }} 元</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房間名稱: {{ orderRecord.roomName }}</v-list-item-title>
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
            orderRecord: {
                id: '',
                customerName: '李四',
                stayDate: '2024-09-22',
                paymentStatus: '已付款',
                totalAmount: '2000',
                roomName: '標準房型',
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
        getOrderDetail() {
            // 模擬連接資料庫來獲取詳細資訊
            console.log("Fetching order details for ID:", this.id);
            // 實際上可以在此處調用 API 獲取數據，並更新 orderRecord
        },
    },
    mounted() {
        this.getOrderDetail();
    },
};
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>