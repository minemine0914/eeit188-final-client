<template>

    <v-container>
        <!-- 視圖模式切換按鈕 -->
        <v-row justify="end">
            <v-btn @click="toggleViewMode" color="primary">
                {{ isThumbnailView ? '清單顯示' : '縮圖顯示' }}
            </v-btn>
        </v-row>

        <!-- 根據視圖模式顯示不同的列表 -->
        <v-row v-if="isThumbnailView">
            <!-- 縮圖顯示 -->
            <v-col v-for="reservation in reservations" :key="reservation.id" cols="12" md="4">
                <v-card>
                    <v-img :src="reservation.image" height="200px"></v-img>
                    <v-card-title>{{ reservation.name }}</v-card-title>
                    <v-card-text>
                        日期: {{ reservation.date }}<br />
                        房客: {{ reservation.guest }}
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="blue" @click="viewDetails(reservation.id)">詳情</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-else>
            <!-- 清單顯示 -->
            <v-col cols="12">
                <v-simple-table>
                    <thead>
                        <tr>
                            <th>預約名稱</th>
                            <th>日期</th>
                            <th>房客</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="reservation in reservations" :key="reservation.id">
                            <td>{{ reservation.name }}</td>
                            <td>{{ reservation.date }}</td>
                            <td>{{ reservation.guest }}</td>
                            <td>
                                <v-btn color="blue" @click="viewDetails(reservation.id)">詳情</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            isThumbnailView: true, // 預設為縮圖顯示
            reservations: [
                // 模擬的預約資料，可以從後端 API 獲取實際資料
                {
                    id: 1,
                    name: '豪華別墅預約',
                    date: '2024-09-15',
                    guest: '張三',
                    image: 'https://example.com/villa.jpg'
                },
                {
                    id: 2,
                    name: '舒適公寓預約',
                    date: '2024-10-01',
                    guest: '李四',
                    image: 'https://example.com/apartment.jpg'
                }
            ]
        };
    },
    methods: {
        toggleViewMode() {
            // 切換視圖模式
            this.isThumbnailView = !this.isThumbnailView;
        },
        viewDetails(id) {
            // 查看預約詳情
            console.log('查看預約詳情', id);
            // 可以將此處跳轉到詳情頁面或打開詳細資料的對話框
        }
    }
};
</script>

<style scoped>
/* 根據需求自定義樣式 */
</style>