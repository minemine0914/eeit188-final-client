<!-- <template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>訂單詳情</v-card-title>
                    <v-card-subtitle>訂單編號: {{ id }}</v-card-subtitle>
                    <v-card-text>
                        <v-list dense>
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房客名稱: {{ orderRecord.customerName }}</v-list-item-title>
                                    <v-list-item-subtitle>入住日期: {{ orderRecord.stayDate }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>訂單狀態: {{ orderRecord.paymentStatus }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>總金額: {{ orderRecord.totalAmount }} 元</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>房間名稱: {{ orderRecord.roomName }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHostManagementStore } from '@/stores/hostManagementStore'

const orderRecord = ref({
  id: '',
  customerName: '',
  stayDate: '',
  paymentStatus: '',
  totalAmount: 0,
  roomName: '',
})

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const hostManagementStore = useHostManagementStore()

const getOrderDetail = async () => {
  try {
    const data = await hostManagementStore.fetchOrderDetail(props.id) // 從 API 獲取訂單詳細資料
    Object.assign(orderRecord.value, data) // 將獲取的數據綁定到 orderRecord
  } catch (error) {
    console.error('無法獲取訂單詳情', error)
  }
}

onMounted(() => {
  getOrderDetail() // 在組件掛載時獲取訂單詳細資料
})
</script>

<style scoped>
.v-card-title {
    font-weight: bold;
}
</style> -->
