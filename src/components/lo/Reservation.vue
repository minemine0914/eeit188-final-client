<template>
    <v-container>
        <!-- 排序和篩選 -->
        <v-row>
            <v-col cols="12" sm="4">
                <v-select v-model="sortBy" :items="['最新', '最舊']" label="排序方式" dense outlined
                    @change="sortReservations"></v-select>
            </v-col>
            <v-col cols="12" sm="4">
                <v-select v-model="filterByPaymentStatus" :items="['全部', '已付款', '未付款']" label="訂單狀態" dense outlined
                    @change="filterReservations"></v-select>
            </v-col>
        </v-row>

        <!-- 縮圖切換按鈕 -->
        <v-row>
            <v-btn @click="toggleThumbnailView">{{ showThumbnails ? '顯示清單' : '顯示縮圖' }}</v-btn>
        </v-row>

        <!-- 預約列表 -->
        <v-row>
            <v-col v-for="reservation in sortedAndFilteredReservations" :key="reservation.id" cols="12" md="6">
                <v-card>
                    <!-- 縮圖模式 -->
                    <v-img v-if="showThumbnails" :src="reservation.image" height="200px"></v-img>

                    <!-- 清單模式 -->
                    <v-list-item v-else>
                        <v-list-item-content>
                            <v-list-item-title>{{ reservation.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ reservation.date }} - 訂單狀態: {{ reservation.paymentStatus
                                }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn color="primary" @click="viewDetails(reservation.id)">查看詳情</v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            reservations: [
                { id: 1, name: '預約 1', date: '2024-09-11', paymentStatus: '已付款', image: 'image1.jpg' },
                { id: 2, name: '預約 2', date: '2024-09-12', paymentStatus: '未付款', image: 'image2.jpg' },
                { id: 3, name: '預約 3', date: '2024-09-13', paymentStatus: '已付款', image: 'image3.jpg' },
                { id: 4, name: '預約 4', date: '2024-09-14', paymentStatus: '未付款', image: 'image4.jpg' },
                { id: 5, name: '預約 5', date: '2024-09-15', paymentStatus: '已付款', image: 'image5.jpg' },
                { id: 6, name: '預約 6', date: '2024-09-16', paymentStatus: '已付款', image: 'image6.jpg' },
                { id: 7, name: '預約 7', date: '2024-09-17', paymentStatus: '未付款', image: 'image7.jpg' },
                { id: 8, name: '預約 8', date: '2024-09-18', paymentStatus: '已付款', image: 'image8.jpg' },
                { id: 9, name: '預約 9', date: '2024-09-19', paymentStatus: '未付款', image: 'image9.jpg' },
                { id: 10, name: '預約 10', date: '2024-09-20', paymentStatus: '已付款', image: 'image10.jpg' },
                { id: 11, name: '預約 11', date: '2024-09-21', paymentStatus: '未付款', image: 'image11.jpg' },
                { id: 12, name: '預約 12', date: '2024-09-22', paymentStatus: '已付款', image: 'image12.jpg' },
                { id: 13, name: '預約 13', date: '2024-09-23', paymentStatus: '未付款', image: 'image13.jpg' },
                { id: 14, name: '預約 14', date: '2024-09-24', paymentStatus: '已付款', image: 'image14.jpg' },
                { id: 15, name: '預約 15', date: '2024-09-25', paymentStatus: '未付款', image: 'image15.jpg' },
                { id: 16, name: '預約 16', date: '2024-09-26', paymentStatus: '已付款', image: 'image16.jpg' },
                { id: 17, name: '預約 17', date: '2024-09-27', paymentStatus: '未付款', image: 'image17.jpg' },
                { id: 18, name: '預約 18', date: '2024-09-28', paymentStatus: '已付款', image: 'image18.jpg' },
                { id: 19, name: '預約 19', date: '2024-09-29', paymentStatus: '未付款', image: 'image19.jpg' },
                { id: 20, name: '預約 20', date: '2024-09-30', paymentStatus: '已付款', image: 'image20.jpg' },
                { id: 21, name: '預約 21', date: '2024-10-01', paymentStatus: '未付款', image: 'image21.jpg' },
                { id: 22, name: '預約 22', date: '2024-10-02', paymentStatus: '已付款', image: 'image22.jpg' },
                { id: 23, name: '預約 23', date: '2024-10-03', paymentStatus: '已付款', image: 'image23.jpg' },
                { id: 24, name: '預約 24', date: '2024-10-04', paymentStatus: '未付款', image: 'image24.jpg' },
                { id: 25, name: '預約 25', date: '2024-10-05', paymentStatus: '已付款', image: 'image25.jpg' },
            ],
            sortBy: '最新',
            filterByPaymentStatus: '全部',
            showThumbnails: true, // 控制縮圖顯示的變量
        };
    },
    computed: {
        sortedAndFilteredReservations() {
            // 根據訂單狀態篩選
            let reservations = this.filterByPaymentStatus === '全部'
                ? this.reservations
                : this.reservations.filter(reservation => reservation.paymentStatus === this.filterByPaymentStatus);

            // 根據時間排序
            return reservations.sort((a, b) => {
                return this.sortBy === '最新'
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date);
            });
        }
    },
    methods: {
        toggleThumbnailView() {
            this.showThumbnails = !this.showThumbnails; // 切換顯示與隱藏縮圖
        },
        viewDetails(id) {
            // 跳轉到訂單詳情頁面
            this.$router.push({ name: 'OrderDetails', params: { id } });
        },
    },
};
</script>