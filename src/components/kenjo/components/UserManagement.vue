<template>
  <v-data-table
    v-model:search="search"
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'createdAt', order: 'desc' }]">
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
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.gender"
                      label="性別"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.mobilePhone"
                      label="手機電話"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.birthday"
                      label="生日"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.role"
                      label="身分"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="8" sm="6">
                    <v-text-field
                      v-model="editedUser.email"
                      label="信箱"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.createdAt"
                      label="建立時間"
                      readonly
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="6">
                    <v-text-field
                      v-model="editedUser.address"
                      label="地址"
                      readonly
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
        mdi-eye
      </v-icon>
      <!-- <v-icon size="small" @click="deleteUser(item)">
        mdi-delete
      </v-icon> -->
    </template>
  </v-data-table>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../../../stores/userStore';

export default {
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        { title: '姓名', key: 'name' },
        { title: '性別', key: 'gender' },
        { title: '手機號碼', key: 'mobilePhone' },
        { title: '信箱', key: 'email' },
        { title: '生日', key: 'birthday' },
        { title: '地址', key: 'address' },
        { title: '權限', key: 'role' },
        { title: '檢視', key: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedUser: {
        id: '',
        name: '',
        gender: '',
        mobilePhone: '',
        email: '',
        birthday: '',
        address: '',
        createdAt: '',
        role: '',
        about: ''
      },
      defaultUser: {
        id: '',
        name: '',
        gender: '',
        mobilePhone: '',
        email: '',
        birthday: '',
        address: '',
        createdAt: '',
        role: '',
        about: ''
      },
    };
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新增用戶' : '編輯用戶';
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
    const token = localStorage.getItem('jwtToken'); // 確保這裡使用正確的鍵

    // if (!token) {
    //   console.error('未找到授權令牌。請確認用戶已登入。');
    //   alert('請登入以獲取用戶資料');
    //   return;
    // }

    try {
      const response = await axios.get('http://localhost:8080/user/find-users', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          pageNo: 0,
          pageSize: 1000
        }
    });
        if (response.status === 200) {
          if (response.data && Array.isArray(response.data.users)) {
            this.desserts = response.data.users.map(user => ({
              ...user,
              birthday: this.formatDate(user.birthday)
            }));
          } else {
            console.error('API 回應格式不正確:', response.data);
            this.desserts = [];
          }
        } else {
          console.error('API 回應狀態不正常:', response.status);
        }
      } catch (error) {
        console.error('抓取用戶時發生錯誤:', error);
        alert('無法獲取用戶數據，請稍後再試。');
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return dateString.split(' ')[0];
    },

    editUser(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialog = true;
    },

    deleteUser(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteUserConfirm() {
      const token = localStorage.getItem('jwtToken');
      try {
        await axios.delete(`http://localhost:8080/user/${this.editedUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.desserts.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.error('刪除用戶時發生錯誤:', error);
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },

    async save() {
    const token = localStorage.getItem('jwtToken');
    console.log("JWT Token:", token);
    if (!token) {
    console.error('未找到授權令牌。請確認用戶已登入。');
    alert('請登入以獲取用戶資料');
    return;
}
      if (!token || !token.includes('.')) {
          alert('無效的授權令牌');
          return;
      }

      // 驗證必填字段
      if (!this.editedUser.name || !this.editedUser.mobilePhone) {
          alert('請填寫所有必填字段');
          return;
      }

      const { createdAt, ...dataToSend } = this.editedUser;
      //console.log('Sending data:', dataToSend);

      try {
          if (this.editedIndex > -1) {
              // 更新現有用戶
              const response = await axios.put(`http://localhost:8080/user/${this.editedUser.id}`, dataToSend, {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              // 更新本地數據
              Object.assign(this.desserts[this.editedIndex], response.data);
          } else {
              // 創建新用戶
              const response = await axios.post('http://localhost:8080/user/createUser', dataToSend, {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              this.desserts.push({
                  ...response.data,
                  birthday: this.formatDate(response.data.birthday) // 確保格式化日期
              });
          }
          this.close(); // 關閉對話框
      } catch (error) {
          console.error('儲存用戶時發生錯誤:', error.response ? error.response.data : error);
          alert('儲存用戶失敗，請檢查輸入並重試。');
      }
    },  
  },
};
</script>

<style>

</style>
