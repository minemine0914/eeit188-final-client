<template>
    <v-container v-if="isErrorGetHouseInfo">
        <!-- House not found
        <v-btn to="/house/qwe">TEST1</v-btn>
        <v-btn to="/house/asd">TEST1</v-btn>
        <v-btn to="/house/f4d671db-d560-46b6-8606-276df8f8cadc">TEST1</v-btn> -->
    </v-container>
    <v-container v-if="!isErrorGetHouseInfo">
        <v-row class="pa-1">
            <v-col cols="12">
                <v-sheet height="40px">
                    <v-skeleton-loader type="heading" width="30%" v-if="isLoading" />
                    <div class="text-h4" v-else>{{ houseInfo.name }}</div>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <!-- Images Box -->
            <v-col cols="6">
                <v-responsive :aspect-ratio="10 / 9">
                    <v-sheet class="h-100 w-100 pa-1 rounded-s-xl overflow-hidden">
                        <v-skeleton-loader
                            class="custom-skeleton-image"
                            type="image"
                            height="100%"
                            width="100%"
                            v-if="isLoading"
                        />
                        <v-img :src="testImg" position="center" class="h-100" cover v-else></v-img>
                    </v-sheet>
                </v-responsive>
            </v-col>
            <v-col cols="6">
                <v-row no-gutters class="h-50">
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="testImg"
                                position="center"
                                class="h-100"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100 overflow-hidden rounded-te-xl ">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="testImg"
                                position="center"
                                class="h-100"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                    </v-col>
                </v-row>
                <v-row no-gutters class="h-50">
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="testImg"
                                position="center"
                                class="h-100"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col cols="6">
                        <v-sheet color=" pa-1 h-100 w-100 rounded-be-xl overflow-hidden">
                            <v-skeleton-loader
                                type="image"
                                height="100%"
                                width="100%"
                                v-if="isLoading"
                            />
                            <v-img
                                :src="testImg"
                                position="center"
                                class="h-100"
                                cover
                                v-else
                            ></v-img>
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row class="px-1">
            <v-col cols="12" md="8">
                <v-sheet>
                    <v-card min-height="100" flat>
                        <v-card-title>設施</v-card-title>
                        
                        <v-card-item >
                            <v-skeleton-loader type="chip, chip, chip" v-if="isLoading" />
                            <v-row v-else>
                                <v-col v-for="postulaue in houseInfo.postulates">
                                    {{ postulaue.name }}
                                </v-col>
                            </v-row>
                        </v-card-item>
                    </v-card>
                    <v-divider class="border-opacity-25"></v-divider>
                    <v-card min-height="350" flat>
                        <v-card-title> 房源介紹 </v-card-title>
                        <v-skeleton-loader type="list-item-three-line, list-item-two-line" v-if="isLoading" />
                        <v-card-item v-else>

                            {{ houseInfo.information }}

                        </v-card-item>
                    </v-card>
                    <v-divider class="border-opacity-25"></v-divider>
                    <v-card min-height="100" flat>
                        <v-card-title>房東</v-card-title>
                        <v-card-item>
                            <v-row>
                                <v-col v-for="postulaue in houseInfo.postulates">
                                    {{ houseInfo.userName }}
                                </v-col>
                            </v-row>
                        </v-card-item>
                    </v-card>
                    <v-divider class="border-opacity-25"></v-divider>
                    <v-card min-height="100" flat>
                        <v-card-title>評價</v-card-title>
                        <v-card-item>
                            <v-row>
                                <!-- <v-col v-for="postulaue in houseInfo.postulates">
                                    {{ postulaue.name }}
                                </v-col> -->
                            </v-row>
                        </v-card-item>
                    </v-card>
                </v-sheet>
            </v-col>
            <v-col cols="12" md="4">
                <v-card rounded="lg" class="pt-3">
                    <v-card-title>TWD ${{ houseInfo.price }}</v-card-title>
                    <v-card-item>
                        <v-date-input class="mt-3" label="入住日期" variant="outlined" prepend-icon="" multiple="range"></v-date-input>
                    </v-card-item>
                    <v-card-item>
                        <v-btn color="brown-lighten-2" width="100%" rounded="lg">預定</v-btn>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHouseDetailStore } from "../../stores/houseDetailStore";
import { storeToRefs } from "pinia";
import testImg from "@/assets/banner05.webp";

// Use route, router
const router = useRouter();
const route = useRoute();

// Use pinia store
const houseDetailStore = useHouseDetailStore();
const { houseInfo, isErrorGetHouseInfo, isLoading } = storeToRefs(houseDetailStore);

watch(
    // Watch Route params houseId change
    () => route.params.houseId,
    (newId, oldId) => {
        console.log(newId, oldId);
        houseDetailStore.getHouseInfo(newId);
    }
);

onMounted(async () => {
    if (route.params.houseId) {
        // If Route params houseId found
        console.log("Found houseId in url param: " + route.params.houseId);
        await houseDetailStore.getHouseInfo(route.params.houseId);
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    } else {
        // If Route params houseId not found
        console.log("HouseId not found in url param!  Take you to home page!");
        isErrorGetHouseInfo.value = true;
        if (isErrorGetHouseInfo.value) {
            router.push("/");
        }
    }
});
</script>

<style scoped>
:deep(.v-skeleton-loader > *) {
    margin: 0;
}

:deep(.v-skeleton-loader .v-skeleton-loader__image) {
    display: flex;
    flex-grow: 1;
    height: 100%;
    flex-direction: column;
}
</style>
