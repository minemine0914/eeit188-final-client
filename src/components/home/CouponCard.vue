<template>
    <v-sheet
        :border="true"
        rounded="sm"
        elevation="0"
        class="d-flex flex-row ga-3"
        color="brown-lighten-5"
    >
        <v-sheet :border="false" class="pa-5" color="brown-darken-1">
            <v-icon icon="mdi-ticket-percent-outline" size="60"></v-icon>
        </v-sheet>
        <v-sheet
            class="flex-grow-1 d-flex flex-column justify-space-between py-2"
            color="transparent"
        >
            <div class="font-weight-regular text-h6">NT ${{ coupon.discount }}元</div>
            <div class="text-caption">使用期限: {{ expireDate.toLocaleDateString() }}</div>
        </v-sheet>
        <v-sheet class="d-flex align-center px-3" color="transparent">
            <v-btn
                variant="outlined"
                color="brown"
                :disabled="isExpired"
                :prepend-icon="isExpired ? '' : selected ? 'mdi-check' : ''"
                @click="toggle"
            >
                {{ isExpired ? "已過期" : selected ? "已套用" : "使用" }}
            </v-btn>
        </v-sheet>
    </v-sheet>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
    coupon: {
        type: Object,
        default: {
            id: null,
            discountRate: null,
            discount: 0,
            expire: 0,
            createdAt: null,
            userName: null,
        },
    },
    selected: {
        type: Boolean,
        default: false,
    },
    used: {
        type: Boolean,
        default: false,
    },
    toggle: {
        type: Function,
        default: function () {
            console.log("Do nothing!!");
        },
    },
});

const { coupon } = props;

const expireDate = computed(() => {
    if (!coupon.createdAt) return null; // 如果 createdAt 为 null，返回 null
    let date = new Date(coupon.createdAt);
    date.setDate(date.getDate() + coupon.expire);
    return date;
});

const isExpired = computed(() => {
    const today = new Date();
    return expireDate.value && today > expireDate.value;
});
</script>
<style scoped>
.content-card {
    background: radial-gradient(8px at left, #0000 98%, #fff) left,
        radial-gradient(8px at right, #0000 98%, #fff) right;
    background-size: 50.5% 25px;
    background-repeat: repeat-y;
    filter: drop-shadow(4px 8px 12px rgba(0, 0, 0, 0.12));
    border-radius: 8px;
}
</style>
