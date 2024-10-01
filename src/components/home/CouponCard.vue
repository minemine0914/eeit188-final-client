<template>
    <v-sheet
        :border="true"
        rounded
        elevation="0"
        class="d-flex flex-row ga-3 mx-3 overflow-hidden"
        :color="isExpired ? 'grey-lighten-3' : 'white'"
    >
        <v-sheet
            class="d-flex justify-center align-center text-center position-relative"
            :color="isExpired ? 'grey-darken-1' : 'brown-darken-1'"
            height="100"
            width="100"
            :class="[isExpired ? 'opacity-80' : '']"
        >
            <v-icon
                icon="mdi-ticket-percent-outline"
                size="45"
                class="mb-3"
                :class="[isExpired ? 'opacity-30' : '']"
            ></v-icon>

            <div
                v-if="coupon.discount != null"
                class="text-caption position-absolute left-0 bottom-0 w-100 mb-4"
                :class="[isExpired ? 'opacity-30' : '']"
            >
                NT ${{ coupon.discount }}
            </div>
            <div
                v-else
                class="text-caption position-absolute left-0 bottom-0 w-100 mb-4"
                :class="[isExpired ? 'opacity-30' : '']"
            >
                {{ 100 - (coupon.discountRate * 100).toFixed(0) }} 折
            </div>
        </v-sheet>
        <v-sheet
            class="flex-grow-1 d-flex flex-column justify-space-between py-2"
            color="transparent"
        >
            <div
                class="font-weight-regular text-h6 font-weight-bold"
                :class="[isExpired ? 'opacity-30' : '']"
            >
                {{ coupon.name != null ? coupon.name : "折價券" }}
            </div>
            <div
                v-if="coupon.discount != null"
                class="text-caption"
                :class="[isExpired ? 'opacity-30' : '']"
            >
                折抵 NT ${{ coupon.discount }} 元
            </div>
            <div v-else class="text-caption" :class="[isExpired ? 'opacity-30' : '']">
                折抵 {{ 100 - (coupon.discountRate * 100).toFixed(0) }} 折
            </div>
            <div class="text-caption" :class="[isExpired ? 'text-red' : '']">
                使用期限: {{ expireDate.toLocaleDateString() }} {{ isExpired ? "(已過期)" : "" }}
            </div>
        </v-sheet>
        <v-sheet class="d-flex align-center px-3" color="transparent">
            <v-btn
                v-show="show"
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
            name: null,
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
    show: {
        type: Boolean,
        default: true,
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
.text-ring {
    --character-width: 1; /* In "ch" units */
    --inner-angle: calc((360 / var(--total)) * 1deg);
    --radius: calc((var(--character-width, 1) / sin(var(--inner-angle))) * -1ch);
}
.text-ring [style*="--index"] {
    transform: translate(-50%, -50%) rotate(calc(var(--inner-angle) * var(--index)))
        translateY(var(--radius, -5ch));
}
</style>
