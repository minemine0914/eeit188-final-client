<template>
    <v-container>
        <!-- 排序和篩選 -->
        <v-row>
            <v-col cols="12" sm="4">
                <v-select v-model="sortBy" :items="['最新', '最舊']" label="排序方式" dense outlined
                    @change="sortReservations"></v-select>
            </v-col>
            <v-col cols="12" sm="4">
                <v-select v-model="filterByPaymentStatus" :items="['全部', '已付款', '未付款']" label="付款狀態" dense outlined
                    @change="filterReservations"></v-select>
            </v-col>
        </v-row>

        <!-- 預約列表 -->
        <v-row>
            <v-col v-for="reservation in paginatedReservations" :key="reservation.id" cols="12">
                <v-card>
                    <v-card-title>{{ reservation.name }}</v-card-title>
                    <v-card-subtitle>
                        日期: {{ reservation.date }} | 付款狀態: {{ reservation.paymentStatus }}
                    </v-card-subtitle>
                    <v-card-actions>
                        <v-btn color="primary" @click="viewDetails(reservation.id)">查看詳情</v-btn>
                        <v-btn color="error" @click="deleteReservation(reservation.id)">刪除</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- 分頁導航 -->
        <v-row justify="center">
            <v-pagination v-model="page" :length="totalPages"></v-pagination>
        </v-row>

        <!-- 查看詳情的彈出視窗 -->
        <v-dialog v-model="showDialog" max-width="600px">
            <v-card>
                <v-card-text>
                    <ReservationDetail :id="selectedReservationId" />
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="closeDialog">關閉</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import ReservationDetail from './ReservationDetail.vue';

export default {
    data() {
        return {
            reservations: [
                { id: 1, name: '預約 1', date: '2024-09-11', paymentStatus: '已付款' },
                { id: 2, name: '預約 2', date: '2024-09-12', paymentStatus: '未付款' },
            ],
            sortBy: '最新',
            filterByPaymentStatus: '全部',
            page: 1,
            itemsPerPage: 5,
            showDialog: false,
            selectedReservationId: null,
        };
    },
    computed: {
        sortedAndFilteredReservations() {
            let filtered = this.filterByPaymentStatus === '全部'
                ? this.reservations
                : this.reservations.filter(r => r.paymentStatus === this.filterByPaymentStatus);

            return filtered.sort((a, b) => {
                return this.sortBy === '最新'
                    ? new Date(b.date) - new Date(a.date)
                    : new Date(a.date) - new Date(b.date);
            });
        },
        paginatedReservations() {
            const start = (this.page - 1) * this.itemsPerPage;
            const end = this.page * this.itemsPerPage;
            return this.sortedAndFilteredReservations.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.sortedAndFilteredReservations.length / this.itemsPerPage);
        },
    },
    methods: {
        sortReservations() {
            // 已經處理過排序邏輯
        },
        filterReservations() {
            // 已經處理過篩選邏輯
        },
        viewDetails(id) {
            this.selectedReservationId = id;
            this.showDialog = true;
        },
        closeDialog() {
            this.showDialog = false;
        },
        editReservation(id) {
            // 編輯預約邏輯
            console.log('編輯預約:', id);
        },
        deleteReservation(id) {
            // 刪除預約邏輯
            console.log('刪除預約:', id);
        },
    },
    components: {
        ReservationDetail,
    },
};
</script>
