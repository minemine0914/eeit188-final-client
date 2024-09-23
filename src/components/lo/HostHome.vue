<template>
    <v-app>
        <div class="top-right-buttons">
            <v-btn text @click="goHome">回首頁</v-btn>
            <v-btn text @click="goBack">回上頁</v-btn>
        </div>
        <!-- 導航欄 -->
        <v-navigation-drawer app permanent>
            <v-list>
                <v-list-item>
                    <v-list-item-title class="text-h5">NOMAD's Host</v-list-item-title>
                </v-list-item>

                <v-list-item>
                    <v-btn text @click="navigateTo('propertyManagement')">房源管理</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn text @click="navigateTo('reservationManagement')">預約管理</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn text @click="navigateTo('orderRecords')">訂單管理</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn text @click="navigateTo('reviews')">住客評價</v-btn>
                </v-list-item>
                <v-list-item>
                    <v-btn text @click="navigateTo('host-report')">統計報表</v-btn>
                </v-list-item>
            </v-list>

        </v-navigation-drawer>

        <!-- 主要內容區域 -->
        <v-main>
            <v-container>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    methods: {
        navigateTo(page) {
            this.$router.push({ name: page });
        },
        goHome() {
            this.$router.push({ path: '/' }); // 設定首頁路徑
        },
        goBack() {
            this.$router.go(-1); // 回到上個頁面
        },
    },
};
</script>

<style scoped>
.v-navigation-drawer {
    background-color: rgb(135, 133, 144);
}

.text-h5 {
    font-weight: bold;
    color: ivory;
}

.top-right-buttons {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 1000;
    /* 保證按鈕在所有內容之上 */
    display: flex;
    gap: 8px;
    /* 控制按鈕之間的間距 */
}
</style>