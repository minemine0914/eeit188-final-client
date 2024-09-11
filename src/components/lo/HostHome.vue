<template>
    <v-app>
        <!-- 最上方的 YouTube/Google 類型導航欄 -->
        <v-app-bar app  color="black" elevate-on-scroll>
            <!-- 標題 -->
            <v-toolbar-title class="ml-3">
                房東管理系統
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- 頭像 -->
            <v-menu v-model="isMenuOpen">
                <template v-slot:activator="{ on, attrs }">
                    <!-- 點擊頭像觸發 v-menu -->
                    <v-avatar v-bind="attrs" v-on="on" size="50" style="cursor: pointer;">
                        <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="avatar" />
                    </v-avatar>
                </template>

                <!-- 彈出的菜單 -->
                <v-card>
                    <v-card-text class="text-center">
                        <v-avatar size="80" class="mx-auto">
                            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="avatar" />
                        </v-avatar>
                        <div class="text-center mt-3"><strong>{{ host.name }}</strong></div>
                        <div class="text-center">{{ host.email }}</div>
                        <v-divider class="my-2"></v-divider>
                        <v-btn block color="primary" @click="goToEditProfile">編輯個人資料</v-btn>
                        <v-btn block color="error" @click="logout">登出</v-btn>
                    </v-card-text>
                </v-card>
            </v-menu>
        </v-app-bar>

        <!-- 內容區域 -->
        <v-main>
            <v-container>
                <v-row>
                    <v-btn @click="changeTab('reservation')" :class="{ 'active-tab': currentTab === 'reservation' }">
                        預約管理
                    </v-btn>
                    <v-btn @click="changeTab('reviews')" :class="{ 'active-tab': currentTab === 'reviews' }">
                        住客評價
                    </v-btn>
                    <v-btn @click="changeTab('propertyManagement')"
                        :class="{ 'active-tab': currentTab === 'propertyManagement' }">
                        房源管理
                    </v-btn>
                    <v-btn @click="changeTab('reports')" :class="{ 'active-tab': currentTab === 'reports' }">
                        統計報表
                    </v-btn>

                </v-row>

                <v-row>
                    <component :is="currentTabComponent"></component>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Reservation from './Reservation.vue';
import Reviews from './Reviews.vue';
import PropertyManagement from './PropertyManagement.vue';
// import Reports from './Reports.vue';
export default {
    data() {
        return {
            currentTab: 'reservation',
            isMenuOpen: false, // 控制頭像彈出選單是否打開
            host: {
                name: '房東姓名',
                email: 'host@example.com',
            },
        };
    },
    computed: {
        currentTabComponent() {
            return {
                reservation: Reservation,
                reviews: Reviews,
                propertyManagement: PropertyManagement,
            }[this.currentTab];
        },
    },
    methods: {
        changeTab(tab) {
            this.currentTab = tab;
        },
        goToEditProfile() {
            // 跳轉到編輯個人資料的頁面
            this.$router.push({ name: 'HostProfile' });
        },
        logout() {
            // 登出邏輯
            console.log('登出');
        }
    },
};
</script>

<style scoped>
.active-tab {
    font-weight: bold;
    background-color: #ddd;
}
</style>