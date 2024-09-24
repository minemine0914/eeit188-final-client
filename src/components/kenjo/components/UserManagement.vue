<!--/*使用者管理	UserManagement
	用戶列表:顯示所有系統用戶的列表，包括管理員、房東和普通用戶。
	用戶詳細信息:查看和編輯用戶的詳細信息，包括聯繫方式、賬號狀態等。
	---用戶角色和權限:管理用戶的角色和權限，設置不同層級的管理功能---。
//id欄位無法新增、修改
09/16新增待修
*/ -->

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
              <!-- 新增 -->
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
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.gender"
                      label="性別"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4" sm="6">
                    <v-text-field
                      v-model="editedUser.mobilePhone"
                      label="手機電話"
                      required
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
                  <v-col cols="12" md="8" sm="6">
                    <v-text-field
                      v-model="editedUser.email"
                      label="信箱"
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
                      required
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
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        重置
      </v-btn>
    </template> -->
  </v-data-table>
</template>


<script>
import axios, { all } from 'axios';
// import { decodeToken } from '../../../stores/userStore';
// const token = localStorage.getItem('authToken'); 
// const decoded = decodeToken(token);
export default {
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      headers: [
        //{ title: '編號', key: 'id' },
        { title: '姓名', key: 'name' },
        { title: '性別', key: 'gender' },
        { title: '手機號碼', key: 'mobilePhone' },
        { title: '信箱', key: 'email' },
        { title: '生日', key: 'birthday' },
        { title: '地址', key: 'address' },
        //{ title: '創建時間', key: 'createdAt' },
        { title: '權限', key: 'role' },
        { title: '編輯', key: 'actions', sortable: false },
      ],
      desserts: [], // 確保此處初始化為數組
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
        about:'',
        avatar_base64:'',
        background_image_blob:'',
        updated_at:'',
        password:'123',
        phone:''

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
        about:'',
        avatar_base64:'',
        background_image_blob:'',
        updated_at:'',
        password:'123',
        phone:''
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
      try {
        const response = await axios.get('http://localhost:8080/user/find-users'
        , {
          // headers: {
          //   Authorization: `Bearer ${token}` // 添加授權標頭
          // },
          params: {
            pageNo: 0,
            pageSize: 1000
          }
        });
        if (response.status === 200) {
          console.log('API response:', response.data); 
          // 確保 response.data 是包含 users 屬性的物件
          if (response.data && Array.isArray(response.data.users)) {
            this.desserts = response.data.users.map(user => ({
            ...user,
            birthday: this.formatDate(user.birthday) 
          }));
          } else {
            console.error('API response is not in expected format:', response.data);
            this.desserts = []; // 初始化為空數組
          }
        } else {
          console.error('API response status is not OK:', response.status);
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error);
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
      try {
        await axios.delete(`http://localhost:8080/user/${this.editedUser.id}`,{
          // headers: {
          //   Authorization: `Bearer ${token}` // 添加授權標頭
          // }
        });
        this.desserts.splice(this.editedIndex, 1);
        this.closeDelete();
      } catch (error) {
        console.error('Error deleting user:', error);
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
      if (!this.editedUser.name || !this.editedUser.mobilePhone ) {
        alert('姓名、手機號碼為必填項');
        return;
      }

      try {
        if (this.editedIndex > -1) {
          // 更新現有用戶
          await axios.put(`http://localhost:8080/user/${this.editedUser.id}`, this.editedUser,
          // {headers: {Authorization: `Bearer ${token}`}}
          );
          Object.assign(this.desserts[this.editedIndex], this.editedUser);
        } else {
          // 創建新用戶
          const response = await axios.post('http://localhost:8080/user/createUser', this.editedUser,
            // {headers: {Authorization: `Bearer ${token}`}}
            );
          this.desserts.push(response.data);
        }
        this.close();
      } catch (error) {
        console.error('Error saving user:', error);
        console.error('Error saving user:', error.response ? error.response.data : error);
      }
    },
  },
};
</script>

<style scoped>

</style>
