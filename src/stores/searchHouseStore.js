import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import api from "../plugins/axios";

export const useHouseSearchStore = defineStore("HouseSearch", () => {
    const inputValues = reactive({
        cityName: "",
        dateRange: [],
    });
    const searchParams = reactive({
        city: "",
        postulates: [],
        daterange: [],
        adult: 0,
        child: 0,
        pet: false,
    });
    const postulateList = reactive([{ name: "Wifi" }]);
    function getPostulateList() {
        api.get("/postulate/findAll", { params: { page: 0, limit: 20 } })
            .then((res) => {
                // console.log(res);
                postulateList.splice(0, postulateList.length);
                postulateList.push(...res.data.content);
            })
            .catch((err) => {
                console.log("讀取設施失敗!");
            });
    }
    return { inputValues, searchParams, postulateList, getPostulateList };
});
