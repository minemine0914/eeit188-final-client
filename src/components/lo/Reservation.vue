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
            <v-col v-for="reservation in paginatedReservations" :key="reservation.id" cols="12">
                <v-card>
                    <!-- 縮圖模式（類似購物車） -->
                    <v-row v-if="showThumbnails" no-gutters>
                        <v-col cols="4">
                            <v-img :src="reservation.image" height="100px" width="100px"></v-img>
                        </v-col>
                        <v-col cols="8">
                            <v-card-title>{{ reservation.name }}</v-card-title>
                            <v-card-subtitle>日期: {{ reservation.date }} | 訂單狀態: {{ reservation.paymentStatus
                                }}</v-card-subtitle>
                            <v-card-actions>
                                <v-btn color="primary" @click="viewDetails(reservation.id)">查看詳情</v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>

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

        <!-- 分頁導航 -->
        <v-row justify="center">
            <v-pagination v-model="page" :length="totalPages"></v-pagination>
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

            ],
            sortBy: '最新',
            filterByPaymentStatus: '全部',
            showThumbnails: true, // 控制縮圖顯示的變量
            page: 1, // 當前頁碼
            itemsPerPage: 5, // 每頁顯示筆數
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
        },
        paginatedReservations() {
            // 分頁邏輯
            const start = (this.page - 1) * this.itemsPerPage;
            const end = this.page * this.itemsPerPage;
            return this.sortedAndFilteredReservations.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.sortedAndFilteredReservations.length / this.itemsPerPage);
        }
    },
    methods: {
        toggleThumbnailView() {
            this.showThumbnails = !this.showThumbnails; // 切換顯示與隱藏縮圖
        },

        viewDetails(reservationId) {
            this.$router.push({ name: 'OrderDetail', params: { id: reservationId } });
        },
    },

    sortReservations() {
        // 手動觸發排序
        this.sortedAndFilteredReservations;
    },
    filterReservations() {
        // 手動觸發篩選
        this.sortedAndFilteredReservations;
    }

};
</script>
