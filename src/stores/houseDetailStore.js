import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import api from "../plugins/axios";
import { useRouter } from "vue-router";
import { useUserStore } from "./userStore";
import NotAvailableImage from "@/assets/ImageNotAvailable01.webp";

const userStore = useUserStore();
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
        houseExternalResourceRecords: [],
    };

    const houseInfo = reactive({ ...initialHouseInfo });
    const isErrorGetHouseInfo = ref(false);
    const isLoading = ref(true);
    const isLoadingCollection = ref(false);
    const isCollected = ref(false);
    const isShareDialogOpen = ref(false);

    function resetHouseInfo() {
        Object.assign(houseInfo, initialHouseInfo);
    }

    function getImageUrlList(index) {
        const records = houseInfo.houseExternalResourceRecords;
        let imageBaseUrl = import.meta.env.VITE_API_URL + "/house-external-resource/image/";
        let imageSrc = null;
        if (
            typeof records === "undefined" ||
            typeof records[index] === "undefined" ||
            records[index] === null ||
            records[index] === ""
        ) {
            imageSrc = NotAvailableImage;
        } else {
            imageSrc = imageBaseUrl + records[index].id;
        }
        return imageSrc;
    }

    async function getHouseInfo(id) {
        isLoading.value = true;
        await api
            .get(`/house/${id}`)
            .then((res) => {
                Object.assign(houseInfo, res.data);
                isErrorGetHouseInfo.value = false;
                isLoading.value = false;
                console.log("Get houseInfo from database sucessed!");
                checkIsCollectedHouse();
            })
            .catch((err) => {
                Object.assign(houseInfo, initialHouseInfo);
                isErrorGetHouseInfo.value = true;
                isLoading.value = false;
                console.log("Get houseInfo from database failed! Take you to home page!");
            });
    }

    function addHouseToCollection() {
        isLoadingCollection.value = true;
        if (typeof userStore.user.id !== "undefined") {
            api.post("/user-collection/", {
                userId: userStore.user.id,
                houseId: houseInfo.id,
            })
                .then((res) => {
                    console.log("Add house to collection success.", res);
                    isCollected.value = true;
                    isLoadingCollection.value = false;
                })
                .catch((err) => {
                    console.log("Add house to collection failed.");
                    isLoadingCollection.value = false;
                });
        } else {
            console.log("You are not login! can't collect house.");
        }
    }

    function removeHouseToCollection() {
        isLoadingCollection.value = true;
        if (typeof userStore.user.id !== "undefined") {
            api.delete("/user-collection/", {
                data: {
                    userId: userStore.user.id,
                    houseId: houseInfo.id,
                },
            })
                .then((res) => {
                    console.log("Remove house to collection success.", res);
                    isCollected.value = false;
                    isLoadingCollection.value = false;
                })
                .catch((err) => {
                    console.log("Remove house to collection failed.");
                    isLoadingCollection.value = false;
                });
        } else {
            console.log("You are not login! can't collect house.");
        }
    }

    function checkIsCollectedHouse() {
        isLoadingCollection.value = true;
        if (typeof userStore.user.id !== "undefined") {
            api.get("/user-collection/", {
                params: {
                    userId: userStore.user.id,
                    houseId: houseInfo.id,
                },
            })
                .then((res) => {
                    console.log("Check house collection success.");
                    if (res.data.isCollected) {
                        isCollected.value = true;
                    } else {
                        isCollected.value = false;
                    }
                    isLoadingCollection.value = false;
                })
                .catch((err) => {
                    console.log("Check house collection failed.");
                    isLoadingCollection.value = false;
                });
        } else {
            console.log("You are not login! can't check collection.");
        }
    }

    return {
        houseInfo,
        isErrorGetHouseInfo,
        isLoading,
        isLoadingCollection,
        isCollected,
        isShareDialogOpen,
        resetHouseInfo,
        getImageUrlList,
        getHouseInfo,
        addHouseToCollection,
        removeHouseToCollection,
        checkIsCollectedHouse,
    };
});
