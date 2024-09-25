<template>
    <v-container>
        <!-- 評價列表 -->
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

        <!-- 分頁導航 -->
        <v-row justify="center">
            <v-pagination v-model="page" :length="totalPages"></v-pagination>
        </v-row>

        <!-- 查看詳情的彈出視窗 -->
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
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagement'

const hostManagementStore = useHostManag
