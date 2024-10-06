<!-- src/views/HostReport.vue -->
<template>
    <v-overlay :model-value="store.isLoading" class="d-flex align-center justify-center fullscreen-overlay"
        :scrim="false">
        <v-progress-circular color="brown" size="100" width="12" indeterminate></v-progress-circular>
    </v-overlay>
    <v-container>
        <!-- Loading Spinner -->
        <!-- <div v-if="store.isLoading"
            style="position: fixed;right:5vw;top:20vh;transform: translate(-50%, -50%);z-index: 100;">
            <v-progress-circular indeterminate color="primary" class="ma-5" :size="100"
                :width="18"></v-progress-circular>
        </div> -->
        <!-- main content -->
        <span class="font-weight-black text-brown-darken-1 text-h5" style="font-family: 'Tenor Sans'">
            NOMAD
        </span>
        <h2 style="display:inline"> 分析報表</h2>
        <v-spacer></v-spacer>
        <v-card class="subBox">

            <v-card-title class="text-h5">您好，{{ store.loginUser.name }}，歡迎使用本系統
                <template v-if="store.houses[0]?.id !== '' && store.houses[0]?.name !== 'NO HOUSES'">
                    <Selector />
                </template>
                <template v-else>
                    <p>您沒有房源，馬上<router-link class="link" :to="{ name: 'HostAddProperty' }">新增房源</router-link>成為房東吧！</p>
                </template>
            </v-card-title>

            <!-- Data Table -->
            <template v-if="store.houses[0]?.id !== '' && store.houses[0]?.name !== 'NO HOUSES'">
                <v-card-title>
                    <DataTable />
                </v-card-title>

                <v-card-text>
                    <template v-if="store.records.length">
                        <DataTab />
                    </template>

                    <p v-else class="font-weight-black text-h5">
                        <v-icon icon="mdi-alert-circle-outline" />查無資料
                    </p>
                </v-card-text>
            </template>
        </v-card>

    </v-container>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useHostReportStore } from '@/stores/hostReportStore';
import { useUserStore } from '@/stores/userStore';
import Selector from '@/components/wu/components/Selector.vue';
import DataTable from '@/components/wu/components/DataTable.vue';
import DataTab from '@/components/wu/components/DataTab.vue';

const store = useHostReportStore();
const userStore = useUserStore();
store.isLoading = ref(false)

onMounted(async () => {
    if (userStore.user) {
        store.loginUser = userStore.user
    }
    // Set loading state to true
    store.isLoading = true;

    // 標準步驟：
    // 1.用host(user)找house
    // 2.列出找到的house，找出有資料的頭尾年分
    // 3.找出所有交易紀錄(和交易過的user)
    try {
        await store.fetchHouses();
        store.fetchTransactionRecordsStartingValue()
        await store.fetchTransactionRecords()
    } finally {
        // Ensure loading state is set to false after fetching
        setTimeout(() => {
            store.isLoading = false;
        }, 0);// setTimeout for test
    }
});
</script>

<style scoped>
.fullscreen-overlay {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.mainBox {
    /* width: 80vw;
    position: relative;
    left: 0; */
}

.subBox {
    /* width: 70vw; */
    background-color: rgba(211, 211, 211, 0.5)
}

.link {
    color: brown;
    text-decoration: none;
}
</style>