<template>


    <v-container>
        <!-- 評價標題和篩選功能 -->
        <v-row justify="space-between" align="center">
            <v-col cols="6">
                <v-text-field v-model="search" label="搜尋評價" prepend-icon="mdi-magnify" clearable></v-text-field>
            </v-col>

            <v-col cols="3">
                <v-select v-model="sortBy" :items="['時間 (最新)', '時間 (最舊)', '評分 (最高)', '評分 (最低)']" label="排序"></v-select>
            </v-col>
        </v-row>

        <!-- 評價列表 -->
        <v-row>
            <v-col v-for="review in filteredReviews" :key="review.id" cols="12" md="6">
                <v-card>
                    <v-card-title>
                        <v-avatar class="mr-3">
                            <img :src="review.avatar" alt="avatar" />
                        </v-avatar>
                        <div>
                            <strong>{{ review.guestName }}</strong>
                            <v-rating :value="review.rating" color="yellow" readonly dense></v-rating>
                            <small>{{ review.date }}</small>
                        </div>
                    </v-card-title>

                    <v-card-text>
                        <em>{{ review.propertyName }}</em>
                        <p>{{ review.comment }}</p>
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
            search: '',
            sortBy: '時間 (最新)',
            reviews: [
                {
                    id: 1,
                    guestName: '張三',
                    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                    propertyName: '豪華別墅',
                    rating: 5,
                    comment: '這是一次非常棒的住宿經驗，房間很乾淨，房東非常熱情！',
                    date: '2024-09-01'
                },
                {
                    id: 2,
                    guestName: '李四',
                    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                    propertyName: '舒適公寓',
                    rating: 4,
                    comment: '不錯的住宿體驗，但有一點吵，整體還是很滿意。',
                    date: '2024-08-20'
                }
            ]
        };
    },
    computed: {
        filteredReviews() {
            // 篩選搜尋結果
            let filtered = this.reviews.filter(review =>
                review.comment.toLowerCase().includes(this.search.toLowerCase()) ||
                review.guestName.toLowerCase().includes(this.search.toLowerCase())
            );

            // 根據排序條件排序
            if (this.sortBy === '時間 (最新)') {
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (this.sortBy === '時間 (最舊)') {
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (this.sortBy === '評分 (最高)') {
                filtered.sort((a, b) => b.rating - a.rating);
            } else if (this.sortBy === '評分 (最低)') {
                filtered.sort((a, b) => a.rating - b.rating);
            }

            return filtered;
        }
    }
};
</script>

<style scoped>
/* 自定義樣式 */
</style>