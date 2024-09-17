import { defineStore } from "pinia";
import { computed, reactive, ref, nextTick } from "vue";
import api from "../plugins/axios";
import NotAvailableImage from "@/assets/ImageNotAvailable01.webp";

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
        matchAllPostulates: false,
        livingDiningRoom: 0,
        bedroom: 0,
        bathroom: 0,
        restroom: 0,
        minPrice: 0,
        maxPrice: 100000,
    });
    const postlateChipGroup = ref([]);
    const housePriceRange = ref([0, 5000]);
    const filterHouseList = reactive([]);
    const postulateList = reactive([]);

    function getImageUrlList(index) {
        const records = filterHouseList[index].houseExternalResourceRecords;
        // console.log(records);
        let imageBaseUrl = import.meta.env.VITE_API_URL + "/house-external-resource/image/";
        let imageSrcList = [];
        if ( records.length === 0 ) {
            imageSrcList.push(NotAvailableImage);
        } else {
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
        postlateChipGroup,
        housePriceRange,
        postulateList,
        filterHouseList,
        getImageUrlList,
        resetSearchResult,
        getPostulateList,
        getFilterHouses,
    };
});
