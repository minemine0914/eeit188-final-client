<!-- 房東和平台共用此component，故顯示內容需判斷權限 -->
<template>

    <v-card flat>
        <v-card-title class="d-flex align-center pe-2 flex-wrap">
            <!-- *******************admin額外顯示查看的user(房東)資訊********************* -->
            <template v-if="store.loginUser.role === 'admin'">
                <v-icon icon="mdi-account" />
                &nbsp;房東名稱：{{ currentUser?.name }}&nbsp;
            </template>
            <span>
                <v-icon icon="mdi-home" />
                房源名稱：{{ store.itemsSource[0]?.house.name }}
            </span>
            <span>
                <v-icon icon="mdi-map-marker" />
                位置：[{{
                    `${store.itemsSource[0]?.house?.country}${store.itemsSource[0]?.house?.city}${store.itemsSource[0]?.house?.region}${store.itemsSource[0]?.house?.address}`
                }}]
            </span>
        </v-card-title>

        <v-card-title class="d-flex flex-row flex-shrink-0 flex-wrap">
            <v-chip :color="store.itemsSource[0]?.house?.show ? 'green' : 'red'" class="text-h6">
                {{ store.itemsSource[0]?.house?.show ? '公開中' : '不公開' }}
            </v-chip>
            <v-chip :color="store.itemsSource[0]?.house?.review === false ? 'red' : store.itemsSource[0]?.house?.review ? 'green' :
                'orange'" class="text-h6">
                {{ store.itemsSource[0]?.house?.review === false ? '審核失敗' : store.itemsSource[0]?.house?.review ? '審核通過'
                    : '待審核' }}
            </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.bedroom" variant="outlined" prepend-icon="mdi-bed-outline"
                class="text-h6">
                臥房：{{ store.itemsSource[0]?.house?.bedroom }} </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.restroom" variant="outlined" prepend-icon="mdi-toilet"
                class="text-h6">
                洗手間：{{ store.itemsSource[0]?.house?.restroom }} </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.bathroom" variant="outlined" prepend-icon="mdi-shower-head"
                class="text-h6">
                浴室：{{ store.itemsSource[0]?.house?.bathroom }} </v-chip>
            <v-chip variant="outlined" prepend-icon="mdi-balcony"
                :color="store.itemsSource[0]?.house?.balcony ? 'green' : 'red'" class="text-h6">
                {{ store.itemsSource[0]?.house?.balcony ? '附設陽台' : '無陽台' }}
            </v-chip>
            <v-chip variant="outlined" prepend-icon="mdi-gas-burner"
                :color="store.itemsSource[0]?.house?.kitchen ? 'green' : 'red'" class="text-h6">
                {{ store.itemsSource[0]?.house?.kitchen ? '附設廚房' : '無廚房' }}
            </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.pet" variant="outlined" prepend-icon="mdi-paw" color="green"
                class="text-h6">
                可攜帶寵物 </v-chip>
            <v-chip v-else variant="outlined" prepend-icon="mdi-paw-off" color="red" class="text-h6"> 禁止寵物 </v-chip>
            <v-chip v-if="store.itemsSource[0]?.house?.smoke" variant="outlined" prepend-icon="mdi-smoking"
                color="green" class="text-h6"> 可吸菸
            </v-chip>
            <v-chip v-else variant="outlined" prepend-icon="mdi-smoking-off" color="red" class="text-h6"> 禁止吸菸 </v-chip>
        </v-card-title>

        <v-card-subtitle class="text-h6">有{{ click }}人看過這間房源</v-card-subtitle>
        <v-card-subtitle class="text-h6">此區間內訂房數：{{ store.itemsSource.length }}</v-card-subtitle>

        <v-spacer />

        <v-card-title class="d-flex align-center pe-2">
            <v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
                variant="solo-filled" flat hide-details single-line />
        </v-card-title>

        <v-card-subtitle class="d-flex align-center pe-2 text-h6">
            <!-- normal user(房東)顯示訂單紀錄提示文字 -->
            <template v-if="store.loginUser.role === 'normal'">
                <v-icon icon="mdi-note-multiple-outline" />
                &nbsp;近期訂單紀錄&nbsp;
            </template>

        </v-card-subtitle>

        <v-divider />

        <v-data-table class="text-h6" v-model:search="search" :items="items" :headers="headers"
            :items-per-page="itemsPerPage" :items-per-page-options="itemsPerPageOptions">
            <template v-slot:item.createdAt="{ item }">
                {{ item.formattedCreatedAt }} <!-- Display formatted date -->
                <v-chip v-if="item.startedAt > new Date()" color="red" class="text-h6">
                    未入住
                </v-chip>
                <v-chip v-else-if="item.endedAt < new Date()" color="orange" class="text-h6">
                    已退房
                </v-chip>
                <v-chip v-else color="green" class="text-h6">
                    入住中
                </v-chip>
            </template>

            <template v-slot:item.startedAt="{ item }">
                <template v-if="item.startedAt">
                    {{ store.formatDate(item.startedAt) }}
                </template>
                <template v-else>--</template>
            </template>

            <template v-slot:item.endedAt="{ item }">
                <template v-if="item.endedAt">
                    {{ store.formatDate(item.endedAt) }}
                </template>
                <template v-else>--</template>
            </template>

            <template v-slot:item.score="{ item }">
                <template v-if="item.score">
                    <v-rating :model-value="item.score" color="orange-darken-2" density="compact" size="medium"
                        readonly></v-rating>
                </template>
                <template v-else>
                    該用戶尚未評分
                </template>
            </template>

            <template v-slot:item.platformIncome="{ item }">
                ${{ item.platformIncome }}
            </template>

            <template v-slot:item.cashFlow="{ item }">
                ${{ item.cashFlow }}
            </template>

        </v-data-table>
    </v-card>
</template>
<script setup>
import { useHostReportStore } from '@/stores/hostReportStore';
import { computed, ref, watch, onMounted } from 'vue';

const store = useHostReportStore();
const search = ref(''); // Using ref for reactivity in Vue 3 setup function
// Function to fetch click count
const click = ref(null)
const fetchClickCount = async () => {
    if (store.selectedHouseId) {
        click.value = await store.getselectedHouseClick();
    }
};

// Fetch click count on component mount
onMounted(fetchClickCount);

// Watch for changes in selectedHouseId
watch(() => store.selectedHouseId, fetchClickCount);


// Define the headers for the data table
let headers = []
// 平台和房東共用此表格，先判定登入者權限，再決定顯示那些欄位
if (store.loginUser.role === 'normal') {
    headers = [
        { title: '訂單成立時間', value: 'createdAt', sortable: true },
        { title: '金額', value: 'cashFlow', sortable: true, align: "end", width: "150px" },
        { title: '預計入住時間', value: 'startedAt', sortable: true },
        { title: '預計退房時間', value: 'endedAt', sortable: true },
        { title: '　評分', value: 'score', sortable: true, align: "center" },
        { title: '訂房者名稱', value: 'bookerName', sortable: true },
        { title: '性別', value: 'bookerGender', sortable: true },
        // { title: '', value: '', sortable: false, width: '100px' }, // 空白欄 調整排版用
    ];
} else if (store.loginUser.role === 'admin') {
    headers = [
        { title: '訂單成立時間', value: 'createdAt', sortable: true, width: '150px' },
        { title: '平台收入', value: 'platformIncome', sortable: true, width: '120px', align: "end" },
        { title: '交易金額', value: 'cashFlow', sortable: true, width: '120px', align: "end" },
        { title: '預計入住時間', value: 'startedAt', sortable: true, width: '150px' },
        { title: '預計退房時間', value: 'endedAt', sortable: true, width: '150px' },
        { title: '　評分', value: 'score', sortable: true, width: '100px', align: "center" },
        { title: '訂房者ID', value: 'bookerId', sortable: true, width: '80px' },
        { title: '訂房者名稱', value: 'bookerName', sortable: true, width: '150px' },
        { title: '性別', value: 'bookerGender', sortable: true, width: '100px' },
        // { title: '', value: 'postulate', sortable: false, width: '100px' }, // 空白欄 調整排版用
    ];
}
const itemsPerPage = 10 // Default items per page
const itemsPerPageOptions = [3, 5, 10, 25, 50, 100, -1] // Options for per-page selector

const currentUser = computed(() => {
    // console.log('Fetching current user...');

    console.log("選擇的user ID", store.selectedUserId)
    const user = store.getUserBySelectedUserId(store.selectedUserId);

    console.log('Current user:', user);
    return user;
});

const items = computed(() => {
    // console.log('is', store.itemsSource)
    let filtered = ''
    if (!search.value) { filtered = store.itemsSource; }
    else {
        const searchLower = search.value.toLowerCase();

        filtered = store.itemsSource.filter(item =>
            (item.house?.id ? item.house.id.toLowerCase().includes(searchLower) : item.house.toLowerCase().includes(searchLower)) ||
            (item.house?.name.toLowerCase().includes(searchLower)) ||
            (item.house?.country.toLowerCase().includes(searchLower)) ||
            (item.house?.city.toLowerCase().includes(searchLower)) ||
            (item.house?.region.toLowerCase().includes(searchLower)) ||
            (item.user?.id && item.user.id.toLowerCase().includes(searchLower)) ||
            (item.cashFlow.toString().includes(searchLower)) ||
            (item.createdAt.includes(searchLower)) ||
            (item?.ticket.startedAt.includes(searchLower)) ||
            (item?.ticket.endedAt.includes(searchLower)) ||
            (item.userGender && item.userGender.includes(searchLower)) // Add other fields as needed
        );
    }

    return filtered.map(item => {
        // Function to format booker gender
        const formatBookerGender = (gender) => {
            switch (gender) {
                case 'male':
                    return '男';
                case 'female':
                    return '女';
                case 'other':
                    return '其他';
                default:
                    return '其他';
            }
        };
        return {
            'houseId': item.house?.id || item.house,
            'houseName': item.house?.name,
            'houseLocation': `${item.house?.country || ''} ${item.house?.city || ''} ${item.house?.region || ''}`.trim(),
            'bookerId': item.user?.id,
            'bookerName': item.user?.name,
            'bookerGender': item.userGender,
            'formattedBookerGender': formatBookerGender(item.userGender),
            'cashFlow': item?.cashFlow,
            'platformIncome': item.platformIncome,
            'createdAt': new Date(item?.createdAt),
            'startedAt': new Date(item?.ticket?.startedAt),
            'endedAt': new Date(item?.ticket?.endedAt),
            'formattedCreatedAt': `${new Date(item.createdAt).getFullYear()}年${String(new Date(item.createdAt).getMonth() + 1).padStart(2,
                '0')}月${String(new Date(item.createdAt).getDate()).padStart(2, '0')}日 ${String(new
                    Date(item.createdAt).getHours()).padStart(2, '0')}:${String(new
                        Date(item.createdAt).getMinutes()).padStart(2, '0')}:${String(new
                            Date(item.createdAt).getSeconds()).padStart(2, '0')}`,
            'score': item?.houseScore,
            'pics': store.pics,
            'postulate': '',
        };
    })
});

</script>