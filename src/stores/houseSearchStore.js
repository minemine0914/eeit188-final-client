import { defineStore } from "pinia";
import { computed, reactive, ref, nextTick } from "vue";
import isEqual from "lodash/isEqual"; // 可以使用 Lodash 進行深度比較
import api from "../plugins/axios";
import NotAvailableImage from "@/assets/ImageNotAvailable01.webp";

const initialSearchParams = {
    city: "",
    postulateIds: [],
    daterange: [],
    adult: 0,
    child: 0,
    pet: false,
    matchAllPostulates: false,
    livingDiningRoom: 0,
    bedroom: 0,
    bathroom: 0,
    restroom: 0,
    minPrice: 0,
    maxPrice: 99999,
    minLatitudeX: null,
    maxLatitudeX: null,
    minLongitudeY: null,
    maxLongitudeY: null,
    name: "",
};

const initialInputValues = {
    cityName: "",
    dateRange: [],
    postulates: "",
    cityChipGroup: [],
    postulateChipGroup: [],
    housePriceRange: [0, 99999],
};

export const useHouseSearchStore = defineStore("HouseSearch", () => {
    // Default pageable limit
    const currentFilterHouseLimit = ref(10);
    const currentAllHouseLimit = ref(12);
    // Record Infinity scroll current page
    const currentFilterHousePage = ref(0);
    const currentAllHousePage = ref(0);
    const renderInfinityScrollComponent = ref(true);

    // const isSearchParams = ref(true);

    // Some input values
    const inputValues = reactive({ ...initialInputValues });

    // Postulate List
    const postulateList = reactive([]);

    // Filter House Search params
    const searchParams = reactive({ ...initialSearchParams });

    // House List
    const filterHouseList = reactive([]);
    const allHouseList = reactive([]);
    const newHouseList = reactive([]);
    const hotHouseList = reactive([]);

    const isSearchParamsEqual = computed(() => {
        return (
            isEqual(searchParams, initialSearchParams) && isEqual(inputValues, initialInputValues)
        );
    });

    function resetSearchParams() {
        console.log("Reset search params");
        Object.assign(searchParams, { ...initialSearchParams });
        Object.assign(inputValues, { ...initialInputValues });
        searchParams.postulateIds.splice(0, searchParams.postulateIds.length);
    }

    function getHouseImageUrlList(records) {
        let imageBaseUrl = import.meta.env.VITE_API_URL + "/house-external-resource/image/";
        let imageSrcList = [];
        if (records.length === 0) {
            imageSrcList.push(NotAvailableImage);
        } else {
            // Sort records by createdAt culomn
            records.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            for (let index = 0; index < records.length; index++) {
                if (
                    typeof records === "undefined" ||
                    typeof records[index] === "undefined" ||
                    records[index] === null ||
                    records[index] === ""
                ) {
                    imageSrcList.push(NotAvailableImage);
                } else {
                    imageSrcList.push(imageBaseUrl + records[index].id);
                }
            }
        }
        return imageSrcList;
    }

    async function resetSearchResult() {
        console.log("Research house filter list...");
        // Reset list and current page
        filterHouseList.splice(0, filterHouseList.length);
        currentFilterHousePage.value = 0;
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

    async function getFilterHouse() {
        let resData = null;
        await api
            .post("/house/search", {
                ...searchParams,
                limit: currentFilterHouseLimit.value,
                page: currentFilterHousePage.value,
                show: true,
                review: true,
            })
            .then((res) => {
                console.log("取得FilterHouse成功");
                resData = res.data;
            })
            .catch((err) => {
                console.log("取得FilterHouse失敗");
            });
        return resData;
    }

    async function getAllHouse() {
        let resData = null;
        await api
            .post("/house/search-with-score", {
                limit: currentAllHouseLimit.value,
                page: currentAllHousePage.value,
                show: true,
                review: true,
            })
            .then((res) => {
                console.log("取得AllHouse成功");
                resData = res.data;
            })
            .catch((err) => {
                console.log("取得AllHouse失敗");
            });
        return resData;
    }

    async function getNewHouse() {
        await api
            .post("/house/search-with-score", {
                show: true,
                review: true,
                limit: 10,
                page: 0,
                dir: true,
                order: "createdAt",
            })
            .then((res) => {
                console.log("取得NewHouse成功");
                newHouseList.splice(0, newHouseList.length);
                newHouseList.push(...res.data.content);
            })
            .catch((err) => {
                console.log("取得NewHouse失敗");
            });
    }

    async function getHotHouse() {
        await api
            .post("/house/mongo/scores/average-grouped-by-house", {
                show: true,
                review: true,
                limit: 30,
                page: 0,
                dir: true,
                order: "averageScoreModified",
                randomFactor: 0,
            })
            .then((res) => {
                console.log("取得HotHouse成功");
                hotHouseList.splice(0, hotHouseList.length);
                // 排除未上架與未審核
                res.data.content.forEach((houseWithScore) => {
                    if (houseWithScore.houseDetails.show === true && houseWithScore.houseDetails.review === true) {
                        hotHouseList.push(houseWithScore);
                    }
                });
                // hotHouseList.push(...res.data.content);
            })
            .catch((err) => {
                console.log("取得HotHouse失敗");
            });
    }

    return {
        currentFilterHouseLimit,
        currentAllHouseLimit,
        renderInfinityScrollComponent,
        currentFilterHousePage,
        currentAllHousePage,
        inputValues,
        searchParams,
        postulateList,
        filterHouseList,
        allHouseList,
        newHouseList,
        hotHouseList,
        isSearchParamsEqual,
        resetSearchParams,
        getHouseImageUrlList,
        resetSearchResult,
        getPostulateList,
        getFilterHouse,
        getAllHouse,
        getNewHouse,
        getHotHouse,
    };
});
