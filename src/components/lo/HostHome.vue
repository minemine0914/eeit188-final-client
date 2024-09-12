<template>
    <v-app>
        <v-app-bar app color="black" elevate-on-scroll>
            <v-toolbar-title class="ml-3" @click="resetToPropertyManagement">NOMAD'S Host</v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- 其他導航按鈕 -->
            <v-btn text to="/">回首頁</v-btn>
            <v-btn text to="">聯繫我們</v-btn>
        </v-app-bar>
        <!-- 內容區域 -->
        <v-main>
            <v-container>
                <!-- 按鈕區域 -->
                <v-row>
                    <v-btn @click="changeTab('propertyManagement')"
                        :class="{ 'active-tab': currentTab === 'propertyManagement' }">
                        房源管理
                    </v-btn>
                    <v-btn @click="changeTab('reservation')" :class="{ 'active-tab': currentTab === 'reservation' }">
                        預約管理
                    </v-btn>
                    <v-btn @click="changeTab('orderRecord')" :class="{ 'active-tab': currentTab === 'orderRecord' }">
                        歷史訂單
                    </v-btn>
                    <v-btn @click="changeTab('reviews')" :class="{ 'active-tab': currentTab === 'reviews' }">
                        住客評價
                    </v-btn>

                    <v-btn @click="changeTab('report')" :class="{ 'active-tab': currentTab === 'report' }">
                        統計報表
                    </v-btn>
                </v-row>

                <v-row>
                    <component :is="currentTabComponent"></component>
                </v-row>

                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Reservation from './Reservation.vue';
import Reviews from './Reviews.vue';
import PropertyManagement from './PropertyManagement.vue';
import OrderRecord from './OrderRecord.vue';
export default {

    name: 'HostHome',

    data() {
        return {
            currentTab: 'reservation', // 預設選中的 tab
        };
    },
    computed: {
        currentTabComponent() {
            return {
                reservation: Reservation,
                reviews: Reviews,
                propertyManagement: PropertyManagement,
                orderRecord: OrderRecord,
            }[this.currentTab];
        },
    },
    methods: {
        changeTab(tab) {
            this.currentTab = tab;
        },
        resetToPropertyManagement() {
            this.currentTab = 'propertyManagement';
            this.$router.push('/lo');
        },
    },
};
</script>

<style scoped>
.active-tab {
    font-weight: bold;
    background-color: #ddd;
}
</style>