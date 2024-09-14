import { defineStore } from "pinia";
import { computed, reactive, ref, nextTick } from "vue";
import api from "../plugins/axios";

export const useHouseSearchStore = defineStore("HouseSearch", () => {
    const currentPage = ref(0);
    const renderInfinityScrollComponent = ref(true);
    const inputValues = reactive({
        cityName: "",
        dateRange: [],
    });
    const searchParams = reactive({
        city: "",
        postulateIds: [],
        daterange: [],
        adult: 0,
        child: 0,
        pet: false,
    });
    const filterHouseList = reactive([]);
    const postulateList = reactive([]);
    async function resetSearchResult() {
        console.log("Research house filter list...");
        // Reset list and current page
        filterHouseList.splice(0, filterHouseList.length);
        currentPage.value = 0;
        // Rerender Infinity scroll
        renderInfinityScrollComponent.value = false;
        await nextTick();
        renderInfinityScrollComponent.value = true;
    }

    async function getPostulateList() {
        await api
            .get("/postulate/findAll", { params: { page: 0, limit: 20 } })
            .then((res) => {
                // console.log(res);
                postulateList.splice(0, postulateList.length);
                postulateList.push(...res.data.content);
            })
            .catch((err) => {
                console.log("讀取設施失敗!");
            });
    }
    async function getFilterHouses(data) {
        let resData = null;
        await api
            .post("/house/search", { ...searchParams, ...data })
            .then((res) => {
                console.log(res);
                Object.assign(filterHouseList, res.data);
                resData = res.data;
            })
            .catch((err) => {
                console.log("取得房源失敗");
            });
        return resData;
    }

    return {
        renderInfinityScrollComponent,
        currentPage,
        inputValues,
        searchParams,
        postulateList,
        filterHouseList,
        resetSearchResult,
        getPostulateList,
        getFilterHouses,
    };
});
