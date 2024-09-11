<template>
    <v-container>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="users"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>UserManagement</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn @click="addUser" color="primary">Add User</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="editUser(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        headers: [
          { text: 'Name', value: 'name' },
          { text: 'Email', value: 'email' },
          { text: 'Status', value: 'status' },
          { text: 'Actions', value: 'actions', sortable: false }
        ],
        users: [
          { id: 1, name: 'aaa', email: 'aaa@gmail.com', status: '用戶' },
          { id: 2, name: 'bbb', email: 'bbb@gmail.com', status: '用戶' },
          { id: 3, name: 'ccc', email: 'ccc@gmail.com', status: '管理員' }
          
        ]
      };
    },
    methods: {
      addUser() {
        // Logic to add a new user
        alert('Add User clicked');
      },
      editUser(user) {
        // Logic to edit user
        alert(`Edit User ${user.name}`);
      },
      deleteUser(user) {
        
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          this.users = this.users.filter(u => u.id !== user.id);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  

<!--/*使用者管理	UserManagement
	用戶列表:顯示所有系統用戶的列表，包括管理員、房東和普通用戶。
	用戶詳細信息:查看和編輯用戶的詳細信息，包括聯繫方式、賬號狀態等。
	---用戶角色和權限:管理用戶的角色和權限，設置不同層級的管理功能---。
*/ -->