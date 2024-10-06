<template>
    <v-data-table-server
        :headers="headers"
        :items="users"
        :items-per-page="itemsPerPage"
        :items-length="totalItems"
        :search="search"
        :loading="loading"
        :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
        show-current-page
        @update:options="fetchUsers"
    >
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>使用者管理</v-toolbar-title>
                <v-sheet color="transparent" class="d-flex flex-row flex-grow-1 ga-2 mr-2">
                    <v-select
                        prefix="搜尋欄位:"
                        v-model="selectedField"
                        :items="[{ title: '使用者名稱', value: 'name' }]"
                        density="compact"
                        label="選擇搜尋欄位"
                        variant="solo-filled"
                        flat
                        hide-details
                        single-line
                        :style="{ width: '30px' }"
                    ></v-select>
                    <v-text-field
                        density="compact"
                        label="查詢"
                        prepend-inner-icon="mdi-magnify"
                        variant="solo-filled"
                        flat
                        hide-details
                        single-line
                        :style="{ width: '200px' }"
                        @blur="onSearchTextFieldUpdate"
                        @keyup.enter="onSearchTextFieldUpdate"
                        clearable
                    ></v-text-field>
                </v-sheet>
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
                                    <v-col cols="12" v-if="editedIndex !== -1">
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
                                            v-model="editedUser.birthday"
                                            label="生日"
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
                                            v-model="editedUser.role"
                                            label="身分"
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
                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="editedUser.email"
                                            label="信箱"
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
                                關閉
                            </v-btn>
                            <!-- <v-btn color="blue-darken-1" variant="text" @click="save">
                                儲存
                            </v-btn> -->
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">確定要刪除?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                                >取消</v-btn
                            >
                            <v-btn color="blue-darken-1" variant="text" @click="deleteUserConfirm"
                                >刪除</v-btn
                            >
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.birthday="{ item }">
            {{ new Date(item.birthday).toLocaleDateString() }}
        </template>
        <template v-slot:item.createdAt="{ item }">
            {{ new Date(item.createdAt).toLocaleString() }}
        </template>
        <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="editUser(item)"> mdi-eye </v-icon>
            <!-- <v-icon size="small" @click="deleteUser(item)">
                mdi-delete
            </v-icon> -->
        </template>
    </v-data-table-server>
</template>

<script>
//import axios from 'axios';
import { useUserStore } from "../../../stores/userStore";
import axios from "@/plugins/axios";

export default {
    data() {
        return {
            search: "",
            dialog: false,
            dialogDelete: false,
            headers: [
                { title: "姓名", key: "name" },
                { title: "性別", key: "gender" },
                { title: "手機號碼", key: "mobilePhone" },
                { title: "信箱", key: "email" },
                { title: "生日", key: "birthday" },
                { title: "加入時間", key: "createdAt" },
                { title: "地址", key: "address" },
                { title: "權限", key: "role" },
                { title: "檢視", key: "actions", sortable: false },
            ],
            users: [],
            editedIndex: -1,
            editedUser: {
                id: "",
                name: "",
                gender: "",
                mobilePhone: "",
                email: "",
                birthday: "",
                address: "",
                createdAt: "",
                role: "",
                about: "",
            },
            defaultUser: {
                id: "",
                name: "",
                gender: "",
                mobilePhone: "",
                email: "",
                birthday: "",
                address: "",
                createdAt: "",
                role: "",
                about: "",
            },
            itemsPerPage: 10,
            totalItems: 0,
            loading: false,
            selectedField: "name",
        };
    },

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "新增用戶" : "檢視用戶";
        },
    },

    // watch: {
    //     dialog(val) {
    //         val || this.close();
    //     },
    //     dialogDelete(val) {
    //         val || this.closeDelete();
    //     },
    // },

    // created() {
    //     this.fetchUsers();
    // },

    methods: {
        onSearchTextFieldUpdate(e) {
            console.log(e.target.value);
            this.search = e.target.value;
        },
        async fetchUsers({ page, itemsPerPage, sortBy }) {
            this.loading = true;
            // 動態生成搜尋條件
            const searchCondition = {};
            if (this.selectedField === "id") {
                // 如果選擇的是 ID，檢查是否為有效 UUID
                searchCondition["id"] = this.isUUID(this.search) ? this.search : null;
            } else if (this.search) {
                // 如果選擇的是其他欄位，直接設置搜尋條件
                searchCondition[this.selectedField] = this.search;
            }
            const requestData = Object.assign(
                {
                    pageNum: page - 1,
                    pageSize: itemsPerPage,
                    desc: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
                    orderBy: sortBy.length > 0 ? sortBy[0].key : null,
                },
                searchCondition
            );
            try {
                const response = await axios.post("/user/find-condition", requestData );
                console.log("Fetch Order success: ", response.data);
                this.totalItems = response.data.totalElements;
                this.users = response.data.users;
            } catch (error) {
                console.error("Fetch Order error: Status code: ", error.response.status);
                // Handle error (e.g., show error message to user)
            } finally {
                this.loading = false;
            }
        },

        formatDate(dateString) {
            if (!dateString) return "";
            return dateString.split(" ")[0];
        },

        editUser(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedUser = Object.assign({}, item);
            this.dialog = true;
        },

        deleteUser(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedUser = Object.assign({}, item);
            this.dialogDelete = true;
        },

        async deleteUserConfirm() {
            try {
                await axios.delete(`/user/${this.editedUser.id}`);
                this.users.splice(this.editedIndex, 1);
                this.closeDelete();
            } catch (error) {
                console.error("刪除用戶時發生錯誤:", error);
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
            const token = localStorage.getItem("jwtToken");
            console.log("JWT Token:", token);
            if (!token) {
                console.error("未找到授權令牌。請確認用戶已登入。");
                alert("請登入以獲取用戶資料");
                return;
            }
            if (!token || !token.includes(".")) {
                alert("無效的授權令牌");
                return;
            }

            // 驗證必填字段
            if (!this.editedUser.name || !this.editedUser.mobilePhone) {
                alert("請填寫所有必填字段");
                return;
            }

            const { createdAt, ...dataToSend } = this.editedUser;
            //console.log('Sending data:', dataToSend);

            try {
                if (this.editedIndex > -1) {
                    // 更新現有用戶
                    const response = await axios.put(`/user/${this.editedUser.id}`, dataToSend, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    // 更新本地數據
                    Object.assign(this.users[this.editedIndex], response.data);
                } else {
                    // 創建新用戶
                    const response = await axios.post("/user/createUser", dataToSend, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    this.users.push({
                        ...response.data,
                        birthday: this.formatDate(response.data.birthday), // 確保格式化日期
                    });
                }
                this.close(); // 關閉對話框
            } catch (error) {
                console.error("儲存用戶時發生錯誤:", error.response ? error.response.data : error);
                alert("儲存用戶失敗，請檢查輸入並重試。");
            }
        },
    },
};
</script>

<style></style>
