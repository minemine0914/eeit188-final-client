<!--房間管理	RoomManagement
	房間類型管理:管理不同類型的房間，包括設施、價格、描述等。
	房間設施:管理房間內的各種設施和設備，如Wi-Fi、空調等。

  房屋類型按照實際狀況調整
-->
<template>
    <v-container fluid>
        <v-toolbar flat rounded="lg" color="brown-lighten-5">
            <v-toolbar-title>房間管理</v-toolbar-title>
            <!-- 搜尋欄位下拉選單 -->
            <v-sheet color="transparent" class="d-flex flex-row flex-grow-1 ga-2 mr-2">
                <v-select
                    prefix="搜尋欄位:"
                    v-model="selectedField"
                    :items="[
                        { title: '房源名稱', value: 'name' },
                        { title: '房東', value: 'userName' },
                    ]"
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
        </v-toolbar>
        <v-data-table-server
            :search="search"
            :expanded="expanded"
            :headers="headers"
            :items="houses"
            item-value="name"
            show-expand
            :items-per-page="itemsPerPage"
            :items-length="totalItems"
            :loading="loading"
            :items-per-page-options="[10, 20, 30, 50, 100, 1000]"
            show-current-page
            @update:options="fetchHouses"
        >
            <template v-slot:item.show="{ item }">
                <!--狀態欄位-->
                <v-chip :color="getStatusColor(item.show)" size="small" class="text-uppercase">
                    {{ getStatusText(item.show) }}
                </v-chip>
            </template>

            <!-- <template v-slot:item.category="{ category }">    類型欄位 -->
            <!-- <v-chip 
          :color="getCategoryColor(item.category)"
          size="small"
          class="text-uppercase">
          {{ getCategoryText(item.category) }}
        </v-chip>
          </template> -->

            <template v-slot:expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        所在國家： {{ item.country }},<br />
                        基本設施： 客廳: {{ item.livingDiningRoom }}間、 房間:
                        {{ item.bedroom }}間、 衛生間: {{ item.restroom }}間、 淋浴間:
                        {{ item.bathroom }}間、 {{ getkitchenText(item.kitchen) }}、
                        {{ getbalconyText(item.balcony) }}<br />
                        公共設施：
                        <div v-for="postulate in item.postulates" :key="postulate.id">
                            {{ postulate.name }}
                        </div>
                    </td>
                </tr>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon @click="openDialog(item)" class="me-2" small> mdi-pencil </v-icon>
            </template>
        </v-data-table-server>

        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-title class="headline">選擇狀態</v-card-title>
                <v-card-text>
                    <v-radio-group v-model="selectedStatus">
                        <v-radio label="上架" :value="true"></v-radio>
                        <v-radio label="下架" :value="false"></v-radio>
                        <!-- <v-radio label="審核中" :value="null"></v-radio> -->
                    </v-radio-group>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="updateStatus" color="primary">確認</v-btn>
                    <v-btn @click="resetDialog" color="grey">取消</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
//import axios from "axios";
import axios from "@/plugins/axios";

export default {
    data() {
        return {
            search: "",
            expanded: [],
            dialog: false,
            selectedStatus: null,
            currentItem: null,
            houses: [],
            headers: [
                //標題
                {
                    title: "房屋名稱",
                    align: "start",
                    sortable: false,
                    key: "name",
                },
                { title: "房東", key: "userName" },
                { title: "地址 ", key: "address" },
                { title: "房屋類型 ", key: "category" },
                { title: "狀態 ", key: "show" },
                { title: "編輯", value: "actions", sortable: false },
            ],
            itemsPerPage: 10,
            totalItems: 0,
            loading: false,
            selectedField: "name",
        };
    },

    // watch: {
    //     dialog(val) {
    //         val || this.close();
    //     },
    //     dialogDelete(val) {
    //         val || this.closeDelete();
    //     },
    //     dialogHostInfo(val) {
    //         val || this.closeHostInfo();
    //     },
    //     dialogGuestInfo(val) {
    //         val || this.closeGuestInfo();
    //     },
    //     dialogPropertyId(val) {
    //         val || this.closePropertyId();
    //     },
    // },

    // watch: {
    //     dialog(val) {
    //         if (!val) {
    //             this.selectedStatus = null;
    //         }
    //     },
    // },
    // created() {
    //     this.fetchOrder();
    // },
    methods: {
        onSearchTextFieldUpdate(e) {
            console.log(e.target.value);
            this.search = e.target.value;
        },
        async fetchHouses({ page, itemsPerPage, sortBy }) {
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
                    page: page - 1,
                    limit: itemsPerPage,
                    dir: sortBy.length > 0 ? sortBy[0].order === "asc" : true,
                    order: sortBy.length > 0 ? sortBy[0].key : null,
                },
                searchCondition
            );
            try {
                const response = await axios.post("/house/search", requestData);
                console.log("Fetch Order success: ", response.data);
                this.totalItems = response.data.totalElements;
                this.houses = response.data.content;
            } catch (error) {
                console.error("Fetch Order error: Status code: ", error.response.status);
                // Handle error (e.g., show error message to user)
            } finally {
                this.loading = false;
            }
        },

        getStatusColor(show) {
            switch (show) {
                case true:
                    return "green";
                case false:
                    return "orange";
                case null:
                    return "blue";
                default:
                    return "red";
            }
        },
        getStatusText(show) {
            switch (show) {
                case true:
                    return "刊登中";
                case null:
                    return "審核中";
                case false:
                    return "下架中";
                default:
                    return "確認中";
            }
        },

        // getCategoryColor(category) {
        //   switch (category) {
        //     case "公寓":
        //       return 'green';
        //     case "度假別墅":
        //       return 'orange';
        //     case "包棟民宿":
        //       return 'blue';
        //     case "旅店":
        //       return 'yellow';
        //     case "露營地":
        //       return 'gray';
        //     case "酒店式公寓":
        //       return 'magenta';
        //     default:
        //         return 'red';
        //   }
        // },

        // getCategoryText(category) {
        //     switch (category) {
        //       case "公寓":
        //         return '公寓';
        //       case "度假別墅":
        //         return '度假別墅';
        //       case "包棟民宿":
        //         return '包棟民宿';
        //       case "旅店":
        //         return '旅店';
        //       case "apartment":
        //         return '公寓';
        //       case "露營地":
        //         return '露營地';
        //         case"酒店式公寓":
        //         return'酒店式公寓'
        //       default:
        //         return '其他';
        //     }
        //   },

        getkitchenText(kitchen) {
            switch (kitchen) {
                case true:
                    return "有廚房";
                case false:
                    return "無廚房";
                default:
                    return "有無廚房待確認";
            }
        },
        getbalconyText(balcony) {
            switch (balcony) {
                case true:
                    return "有陽台";
                case false:
                    return "無陽台";
                default:
                    return "有無陽台待確認";
            }
        },
        async updateStatus() {
            try {
                const response = await axios.put(`/house/${this.currentItem.id}`, {
                    show: this.selectedStatus,
                });

                if (response.status === 200) {
                    this.currentItem.show = this.selectedStatus;
                    this.dialog = false;
                }
            } catch (error) {
                console.error("Error updating status:", error);
            }
        },

        openDialog(item) {
            this.currentItem = item;
            this.selectedStatus = item.show;
            this.dialog = true;
        },
        resetDialog() {
            this.selectedStatus = null;
            this.dialog = false;
        },
    },
};
</script>

<style scoped>
.title-center {
    display: flex;
    justify-content: center;
    flex-grow: 1;
}
</style>
