<!--/*使用者管理	UserManagement
	用戶列表:顯示所有系統用戶的列表，包括管理員、房東和普通用戶。
	用戶詳細信息:查看和編輯用戶的詳細信息，包括聯繫方式、賬號狀態等。
	---用戶角色和權限:管理用戶的角色和權限，設置不同層級的管理功能---。
//id欄位無法新增、修改
*/ -->

<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'calories', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>使用者管理</v-toolbar-title>
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
          <template v-slot:activator="{ props }">
            <v-btn class="mb-2" color="primary" dark v-bind="props">
              新增
            </v-btn>
          </template>
          <v-card>
            
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="4" sm="6" v-if="editedIndex !== -1">
                    <v-text-field
                      v-model="editedUser.id"
                      label="編號"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.name"
                      label="名字"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.gender"
                      label="性別"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.mobilePhone"
                      label="手機電話"
                    ></v-text-field>
                  </v-col>
                  
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.birthday"
                      label="生日"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.role"
                      label="身分"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="8" sm="2">
                    <v-text-field
                      v-model="editedUser.email"
                      label="信箱"
                    ></v-text-field>
                  </v-col>
                 
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.createdAt"
                      label="建立時間"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="6">
                    <v-text-field
                      v-model="editedUser.address"
                      label="地址"
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
              <v-btn color="blue-darken-1" variant="text" @click="deleteUserConfirm">刪除</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    
    <template v-slot:item.actions="{ item }">
      <v-icon class="me-2" size="small" @click="editUser(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteUser(item)">
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
      { title: '姓名', align: 'start', sortable: false, key: 'name' },//Dessert (100g serving)
      { title: '性別 ', key: 'gender' },//Fat
      { title: '手機號碼 ', key: 'mobilePhone' },//Fat
      { title: '信箱', key: 'email' },//Calories
      { title: '生日 ', key: 'birthday' },//Fat
      { title: '地址 ', key: 'address' },//Fat
      { title: '創建時間', key: 'createdAt' },//Carbs
      { title: '權限', key: 'role' },//Protein
      { title: '編輯', key: 'actions', sortable: false },//Actions
    ],
    
    /*id; → 編號
      name; → 姓名
      role; → 角色
      gender; → 性別
      birthday; → 出生日期
      phone; → 固定電話
      mobilePhone; → 手機號碼
      address; → 地址
      email; → 電子郵件
      password; → 密碼
      about; → 關於
      createdAt; → 創建時間
      updatedAt; → 更新時間
      avatarBase64; → 頭像（Base64 編碼）
      backgroundImageBlob; → 背景圖片（Blob 形式） */

    // name
    // gender
    // mobilePhone
    // email
    // birthday
    // address
    // createdAt
    // role
    desserts: [],
    editedIndex: -1,
    editedUser: {
      id:0,
      name: '',
      gender: 0,
      mobilePhone: 0,
      email: 0,
      birthday: 0,
      address:0,
      createdAt:0,
      role:0
    },
    defaultUser: {
      name: '',
      gender: 0,
      mobilePhone: 0,
      email: 0,
      birthday: 0,
      address:0,
      createdAt:0,
      role:0
    },
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New User' : 'Edit User'
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
        { id:1,name: 'aaa', gender: "男", mobilePhone: "0958476321", email: "aaa@gmail.com", birthday: "1990-08-24" ,address:"台北市大安區",createdAt:"2020-05-20",role:"使用者"},
        { id:2,name: 'bbb', gender: "男", mobilePhone: "0123456789", email: "bbb@gmail.com", birthday: "1990-08-23" ,address:"台北市中正區",createdAt:"2020-05-09",role:"管理員"},
   
      ]
    },

    editUser (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialog = true
    },

    deleteUser (item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteUserConfirm () {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      })
    },

    save () {
      if (!this.editedUser.name || !this.editedUser.mobilePhone || !this.editedUser.address) {
        alert('姓名、手機號碼和地址為必填項')
        return
      }
      if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedUser)
        } else {
          this.desserts.push(this.editedUser)
        }
     
      this.close()
    },
    

  },
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
