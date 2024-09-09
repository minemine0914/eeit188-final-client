<template>
    <v-parallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg" height="300">
        <div class="d-flex flex-column fill-height justify-center align-center text-white">
            <h1 class="text-h4 font-weight-thin mb-4">Nomad</h1>
            <h4 class="subheading">Build your application today!</h4>

            <!-- <v-text-field></v-text-field> -->
        </div>
    </v-parallax>
    <v-container fluid>
        <v-sheet class="mb-3">
            <div class="text-h5 mx-15">熱門推薦</div>
            <v-slide-group v-model="model" selected-class="bg-success" show-arrows>
                <v-slide-group-item
                    v-for="n in 15"
                    :key="n"
                    v-slot="{ isSelected, toggle, selectedClass }"
                >
                    <v-card :class="['ma-2', selectedClass]" height="300" width="300">
                        <v-skeleton-loader
                            class="mx-auto"
                            type="image, article"
                        ></v-skeleton-loader>
                    </v-card>
                </v-slide-group-item>
            </v-slide-group>
        </v-sheet>
        <v-sheet class="mb-3">
            <div class="text-h5 mx-15">評價最好</div>
            <v-slide-group v-model="model" selected-class="bg-success" show-arrows>
                <v-slide-group-item
                    v-for="n in 15"
                    :key="n"
                    v-slot="{ isSelected, toggle, selectedClass }"
                >
                    <v-card :class="['ma-2', selectedClass]" height="300" width="300">
                        <v-skeleton-loader
                            class="mx-auto"
                            type="image, article"
                        ></v-skeleton-loader>
                    </v-card>
                </v-slide-group-item>
            </v-slide-group>
        </v-sheet>
        <v-row v-for="row_index in 2" cols="12" md="3" :key="row_index">
            <v-col v-for="col_index in 4" cols="12" md="3" :key="col_index">
                <v-skeleton-loader
                    class="mx-auto"
                    max-width="300"
                    type="image, article"
                ></v-skeleton-loader>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup>
import { ref } from "vue";
import { useTheme } from "vuetify";
const model = ref(null);
const theme = useTheme();
function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}
</script>
<style scoped></style>
