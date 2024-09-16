import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserViewStore = defineStore("userView", () => {
    const windowSize = ref({
        x: 0,
        y: 0,
    });
    const containerHeight = ref(1);
    const isOpenLoginDialog = ref(false);
    const memberMenu = ref(false);
    const appbarRef = ref(null);
    return {
        windowSize,
        containerHeight,
        isOpenLoginDialog,
        memberMenu,
        appbarRef,
    };
});
