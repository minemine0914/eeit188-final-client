<template>
    <v-container>
        <!-- 排序和篩選 -->
        <v-row>
            <v-col cols="12" sm="4">
                <v-select
                    v-model="sortBy"
                    :items="['最新', '最舊']"
                    label="排序方式"
                    dense
                    outlined
                    @change="sortReservations"
                ></v-select>
            </v-col>
        </v-row>

        <!-- 預約列表 -->
        <v-row>
            <v-col v-for="reservation in paginatedReservations" :key="reservation.id" cols="12">
                <v-card>
                    <v-card-title>{{ reservation.name }}</v-card-title>
                    <v-card-subtitle> 日期: {{ reservation.date }} </v-card-subtitle>
                    <v-card-actions>
                        <v-btn color="primary" @click="viewDetails(reservation.id)">查看詳情</v-btn>
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

<script setup>
import { ref, onMounted, computed } from "vue";
import { useHostManagementStore } from "@/stores/hostManagementStore";
import ReservationDetail from "./ReservationDetail.vue";

const hostManagementStore = useHostManagementStore();

const reservations = ref([]);
const sortBy = ref("最新");
const filterByPaymentStatus = ref("全部");
const page = ref(1);
const itemsPerPage = ref(5);
const showDialog = ref(false);
const selectedReservationId = ref(null);

const sortReservations = () => {
    // 排序邏輯處理
};

const viewDetails = id => {
    selectedReservationId.value = id;
    showDialog.value = true;
};

const closeDialog = () => {
    showDialog.value = false;
};

// 計算排序與篩選後的預約
const sortedAndFilteredReservations = computed(() => {
    let filtered =
        filterByPaymentStatus.value === "全部"
            ? reservations.value
            : reservations.value.filter(r => r.paymentStatus === filterByPaymentStatus.value);

    return filtered.sort((a, b) => {
        return sortBy.value === "最新" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    });
});

// 計算分頁的預約列表
const paginatedReservations = computed(() => {
    const start = (page.value - 1) * itemsPerPage.value;
    const end = page.value * itemsPerPage.value;
    return sortedAndFilteredReservations.value.slice(start, end);
});

// 計算總頁數
const totalPages = computed(() => {
    return Math.ceil(sortedAndFilteredReservations.value.length / itemsPerPage.value);
});

// 在組件掛載時獲取預約列表
onMounted(async () => {
    try {
        const data = await hostManagementStore.fetchReservations(); // 從後端 API 獲取預約列表
        reservations.value = data;
    } catch (error) {
        console.error("獲取預約失敗:", error);
    }
});
</script>

<style scoped></style>
-->
