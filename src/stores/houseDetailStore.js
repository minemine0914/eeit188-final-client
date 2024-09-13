import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import api from "../plugins/axios";
import { useRouter } from "vue-router";
export const useHouseDetailStore = defineStore("HouseDetail", () => {
    const initialHouseInfo = {
        id: null,
        name: null,
        category: null,
        information: null,
        latitudeX: null,
        longitudeY: null,
        country: null,
        city: null,
        region: null,
        address: null,
        price: null,
        pricePerDay: null,
        pricePerWeek: null,
        pricePerMonth: null,
        livingDiningRoom: null,
        bedroom: null,
        restroom: null,
        bathroom: null,
        adult: null,
        child: null,
        pet: null,
        smoke: null,
        kitchen: null,
        balcony: null,
        createdAt: null,
        updatedAt: null,
        priceRanges: null,
        postulates: null,
        tickets: null,
        collectionCount: null,
        userId: null,
        userName: null,
    };
    const houseInfo = reactive({ ...initialHouseInfo });
    const isErrorGetHouseInfo = ref(false);
    const isLoading = ref(true);

    function resetHouseInfo() {
        Object.assign(houseInfo, initialHouseInfo);
    }

    async function getHouseInfo(id) {
        isLoading.value = true;
        await api.get(`/house/${id}`)
            .then((res) => {
                Object.assign(houseInfo, res.data);
                isErrorGetHouseInfo.value = false;
                isLoading.value = false;
                console.log("Get houseInfo from database sucessed!");
            })
            .catch((err) => {
                Object.assign(houseInfo, initialHouseInfo);
                isErrorGetHouseInfo.value = true;
                isLoading.value = false;
                console.log("Get houseInfo from database failed! Take you to home page!");
            });
    }

    return { houseInfo, isErrorGetHouseInfo, isLoading, resetHouseInfo, getHouseInfo };
});
