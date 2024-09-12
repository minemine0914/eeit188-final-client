import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import api from "../plugins/axios";
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

    function resetHouseInfo() {
        Object.assign(houseInfo, initialHouseInfo);
    }

    function getHouseInfo(id) {
        api.get(`/house/${id}`)
            .then((res) => {
                // console.log(res.data);
                Object.assign(houseInfo, res.data);
                isErrorGetHouseInfo.value = false;
            })
            .catch((err) => {
                Object.assign(houseInfo, initialHouseInfo);
                isErrorGetHouseInfo.value = true;
                console.log("House not found!");
            });
    }

    return { houseInfo, isErrorGetHouseInfo, resetHouseInfo, getHouseInfo };
});
