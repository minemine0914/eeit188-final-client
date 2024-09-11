<template>
    <div class="position-relative overflow-y-visible mb-5" style="height: 360px">
        <v-parallax :src="primaryBannerImg" height="100%" width="100%">
            <div class="d-flex flex-column fill-height justify-center align-center text-white">
                <h1 class="text-h3 font-weight-black mb-4 opacity-80">Nomad</h1>
                <h4 class="subheading font-weight-regular">住宿 旅遊 重新定義居住自由</h4>
            </div>
        </v-parallax>
        <SearchHouseBar style="top: 260px;" />
    </div>

    <v-container fluid class="pa-0 my-5">
        <v-sheet class="mb-3">
            <div class="text-h5 font-weight-medium mx-15">熱門推薦</div>
            <v-slide-group show-arrows>
                <v-slide-group-item v-for="n in 15" :key="n">
                    <v-card class="ma-2" height="320" width="300" elevation="0">
                        <v-skeleton-loader class="mx-auto" type="card, list-item-two-line" />
                    </v-card>
                </v-slide-group-item>
            </v-slide-group>
        </v-sheet>
    </v-container>

    <v-parallax :src="secondaryBannerImg" height="320">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-black mb-4 opacity-80">分享您的空間</h1>
            <h4 class="subheading font-weight-regular">為大家提供舒適的住宿體驗</h4>
            <v-btn variant="outlined" class="mt-5">立即加入</v-btn>
        </div>
    </v-parallax>

    <v-container fluid class="pa-0 my-5">
        <v-sheet class="mb-3">
            <div class="text-h5 font-weight-medium mx-15">評價最好</div>
            <v-slide-group show-arrows>
                <v-slide-group-item v-for="n in 15" :key="n">
                    <v-card class="ma-2" height="320" width="300" elevation="0">
                        <v-skeleton-loader class="mx-auto" type="image, article" />
                    </v-card>
                </v-slide-group-item>
            </v-slide-group>
        </v-sheet>
    </v-container>
    <v-container fluid class="pa-0 my-5">
        <v-row class="mx-11" justify="center" align="center">
            <v-col v-for="col_index in 50" :key="col_index" cols="12" lg="3" md="4" sm="6" xs="12">
                <v-card variant="text">
                    <v-skeleton-loader type="image, article" height="100%" class="rounded-xl" />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import primaryBannerImg from "@/assets/banner05.webp";
import secondaryBannerImg from "@/assets/banner06.webp";
import SearchHouseBar from "@/components/minemine/components/SearchHouseBar.vue";



</script>
<style scoped></style>
