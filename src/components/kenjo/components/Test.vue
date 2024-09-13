<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'date', order: 'desc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>金額管理</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          density="compact"
          label="查詢"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          :style="{ width: '200px' }"
        ></v-text-field>
        <v-dialog v-model="dialog" max-width="500px">
          <!-- <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              新增
            </v-btn>
          </template> -->
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6" v-if="editedIndex !== -1">
                    <v-text-field
                      v-model="editedItem.id"
                      label="編號"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.date"
                      label="日期"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.orderQuantity"
                      label="訂單數量"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.totalAmount"
                      label="總金額"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.discountAmount"
                      label="折扣金額"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.prepaidAmount"
                      label="預收款項"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.pendingAmount"
                      label="待付款"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedItem.processingFee"
                      label="手續費收入"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="close">
                取消
              </v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="save">
                儲存
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">確定要刪除?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">取消</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">刪除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editItem(item)">
        mdi-see
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    search: '',
    dialog: false,
    dialogDelete: false,
    headers: [
      //{ title: '編號', align: 'start', key: 'id' },
      { title: '日期', key: 'date' },
      { title: '訂單數量', key: 'orderQuantity' },
      { title: '總金額', key: 'totalAmount' },
      { title: '折扣金額', key: 'discountAmount' },
      { title: '預收款項', key: 'prepaidAmount' },
      { title: '待付款', key: 'pendingAmount' },
      { title: '手續費收入', key: 'processingFee' },
     // { title: '編輯', key: 'actions', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      date: '',
      orderQuantity: 0,
      totalAmount: 0,
      discountAmount: 0,
      prepaidAmount: 0,
      pendingAmount: 0,
      processingFee: 0
    },
    defaultItem: {
      id: 0,
      date: '',
      orderQuantity: 0,
      totalAmount: 0,
      discountAmount: 0,
      prepaidAmount: 0,
      pendingAmount: 0,
      processingFee: 0
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '新增訂單' : '編輯訂單'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.desserts = [
        { date: '2024-08-13', orderQuantity: 25, totalAmount: 30000, discountAmount: 1000, prepaidAmount: 29000, pendingAmount: 25000, processingFee: 4000 },
        { date: '2024-08-14', orderQuantity: 30, totalAmount: 35000, discountAmount: 1500, prepaidAmount: 30000, pendingAmount: 20000, processingFee: 5000 },
        { date: '2024-03-10', orderQuantity: 18, totalAmount: 22000, discountAmount: 1100, prepaidAmount: 18000, pendingAmount: 16000, processingFee: 2800 },
        { date: '2024-04-05', orderQuantity: 22, totalAmount: 29000, discountAmount: 1600, prepaidAmount: 24000, pendingAmount: 21000, processingFee: 3500 },
        { date: '2024-05-18', orderQuantity: 28, totalAmount: 32000, discountAmount: 1700, prepaidAmount: 27000, pendingAmount: 23000, processingFee: 3800 },
        { date: '2024-06-22', orderQuantity: 26, totalAmount: 31000, discountAmount: 1550, prepaidAmount: 26000, pendingAmount: 22000, processingFee: 3600 },
        { date: '2024-07-14', orderQuantity: 24, totalAmount: 28000, discountAmount: 1450, prepaidAmount: 23000, pendingAmount: 20000, processingFee: 3400 },
        { date: '2024-08-12', orderQuantity: 30, totalAmount: 35000, discountAmount: 1500, prepaidAmount: 30000, pendingAmount: 20000, processingFee: 5000 },
        { date: '2024-09-10', orderQuantity: 27, totalAmount: 30000, discountAmount: 1600, prepaidAmount: 25000, pendingAmount: 22000, processingFee: 3700 },
        { date: '2024-10-25', orderQuantity: 31, totalAmount: 34000, discountAmount: 1700, prepaidAmount: 29000, pendingAmount: 25000, processingFee: 4200 },
        { date: '2024-11-15', orderQuantity: 29, totalAmount: 33000, discountAmount: 1650, prepaidAmount: 28000, pendingAmount: 24000, processingFee: 4100 },
        { date: '2024-12-30', orderQuantity: 32, totalAmount: 36000, discountAmount: 1800, prepaidAmount: 31000, pendingAmount: 26000, processingFee: 4300 }
 
      ]
    },

    editItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = { ...item }
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = { ...item }
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },

    save () {
      if (!this.editedItem.date || this.editedItem.orderQuantity === null || this.editedItem.totalAmount === null) {
        alert('日期、訂單數量和總金額為必填項')
        return
      }
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
