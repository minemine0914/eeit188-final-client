<template>
    <!-- <v-container>
        <v-row>
            <v-col v-for="review in paginatedReviews" :key="review.id" cols="12">
                <v-card>
                    <v-card-title>{{ review.guestName }}</v-card-title>
                    <v-card-subtitle>日期: {{ review.date }} | 評價: {{ review.rating }} 星</v-card-subtitle>
                    <v-card-text>
                        {{ review.comment }}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="viewReviewDetails(review.id)">查看詳情</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-pagination v-model="page" :length="totalPages"></v-pagination>
        </v-row>

        <v-dialog v-model="showDialog" max-width="600px">
            <v-card>
                <v-card-title>評價詳情</v-card-title>
                <v-card-text>
                    <div>
                        <strong>房客名稱: </strong>{{ selectedReview.guestName }}
                    </div>
                    <div>
                        <strong>評價分數: </strong>{{ selectedReview.rating }} 星
                    </div>
                    <div>
                        <strong>留言: </strong>{{ selectedReview.comment }}
                    </div>
                    <div>
                        <strong>日期: </strong>{{ selectedReview.date }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" @click="closeDialog">關閉</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container> -->
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useHostManagementStore } from "@/stores/hostManagementStore";

const hostManagementStore = useHostManagementStore();

const reviews = ref([]);
const page = ref(1);
const itemsPerPage = ref(5);
const showDialog = ref(false);
const selectedReview = ref({});

// 計算分頁的評價
const paginatedReviews = computed(() => {
    const start = (page.value - 1) * itemsPerPage.value;
    const end = page.value * itemsPerPage.value;
    return reviews.value.slice(start, end);
});

// 計算總頁數
const totalPages = computed(() => {
    return Math.ceil(reviews.value.length / itemsPerPage.value);
});

// 獲取評價資料
const fetchReviews = async () => {
    try {
        const data = await hostManagementStore.fetchReviews(); // 從後端 API 獲取評價資料
        reviews.value = data;
    } catch (error) {
        console.error("獲取評價失敗:", error);
    }
};

// 查看評價詳情
const viewReviewDetails = id => {
    const review = reviews.value.find(r => r.id === id);
    selectedReview.value = review || {};
    showDialog.value = true;
};

// 關閉詳情彈窗
const closeDialog = () => {
    showDialog.value = false;
};

// 在組件掛載時獲取評價資料
onMounted(() => {
    fetchReviews();
});
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style>
