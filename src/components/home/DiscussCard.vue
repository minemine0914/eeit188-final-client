<template>
    <v-card color="brown-lighten-5" flat border rounded="lg">
        <template v-slot:prepend>
            <v-avatar size="large" border>
                <v-img :src="discuss.avatar ? discuss.avatar : emptyUserAvavtarImage"></v-img>
            </v-avatar>
        </template>
        <template v-slot:title>
            <div class="text-subtitle-1 font-weight-medium">{{ discuss.user }}</div>
        </template>
        <template v-slot:subtitle>
            <div class="text-caption">評論了 {{ discuss.totalDiscussCount }} 間房源</div>
        </template>
        <template v-slot:append>
            <v-rating
                hover
                :length="5"
                :size="23"
                :model-value="discuss.score"
                color="warning"
                active-color="warning"
                readonly
            />
        </template>
        <v-card-text class="pb-2">
            <v-sheet height="80px" class="overflow-auto pa-1" rounded color="rgba(255,255,255,0.75)">
                <p v-if="discuss.discuss.length != 0" style="white-space: pre">
                    {{ discuss.discuss }}
                </p>
                <div v-else class="d-flex justify-center align-center h-100">
                    <div class="flex-grow-1 text-grey-darken-2 text-center">此使用者只有評分</div>
                </div>
            </v-sheet>
            <div class="d-flex justify-space-between mt-2 mb-1">
                <span class="text-caption pr-1"
                    >評論日期: {{ new Date(discuss.createdAt).toLocaleDateString() }}</span
                >
                <v-badge
                    color="light-green-lighten-3"
                    rounded="1"
                    :content="timeAgo.format(new Date(discuss.createdAt))"
                    inline
                >
                </v-badge>
            </div>
        </v-card-text>
    </v-card>
</template>
<script setup>
import timeAgo from "@/plugins/time-ago";
import emptyUserAvavtarImage from "@/assets/user.png";
defineProps(["discuss"]);
</script>
<style scoped></style>
