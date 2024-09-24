import { defineStore } from "pinia";
import { computed, nextTick, reactive, ref } from "vue";
import api from "../plugins/axios";
import { useRouter } from "vue-router";
import { useUserStore } from "./userStore";
import NotAvailableImage from "@/assets/ImageNotAvailable01.webp";

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
    userHouseCount: null,
    houseExternalResourceRecords: [],
};

const initialHostInfo = {
    id: null,
    name: null,
    role: null,
    gender: null,
    birthday: null,
    phone: null,
    mobilePhone: null,
    address: null,
    email: null,
    about: null,
    createdAt: null,
    updatedAt: null,
    avatarBase64: null,
};

const initialSelfHouseDiscuss = {
    id: null,
    discuss: null,
    userId: null,
    user: null,
    houseId: null,
    house: null,
    avatar: null,
    score: null,
};

const userStore = useUserStore();
export const useHouseDetailStore = defineStore(
    "HouseDetail",
    () => {
        const router = useRouter();
        const houseInfo = reactive({ ...initialHouseInfo });
        const hostInfo = reactive({ ...initialHostInfo });
        const selfHouseDiscuss = reactive({ ...initialSelfHouseDiscuss });
        const previewDiscussList = reactive(new Array());
        const discussList = reactive(new Array());
        const totalDiscussCount = ref(0);
        const currentDiscussPage = ref(0);
        const isErrorGetHouseInfo = ref(false);
        const isLoading = ref(true);
        const isLoadingCollection = ref(false);
        const isCollected = ref(false);
        const isShareDialogOpen = ref(false);
        const isDiscussDialogOpen = ref(false);
        const isMoreDiscussesDialogOpen = ref(false);
        const renderDiscussList = ref(true);

        // Record booking list into localstorage
        const bookingList = reactive(new Array());

        function resetHouseInfo() {
            Object.assign(houseInfo, initialHouseInfo);
        }

        function reloadDiscussList() {
            currentDiscussPage.value = 0;
            discussList.splice(0, discussList.length);
            renderDiscussList.value = false;
            nextTick();
            renderDiscussList.value = true;
        }

        function getHouseDetailImage(index) {
            const records = houseInfo.houseExternalResourceRecords;
            // Sort records by createdAt culomn
            records.sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
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

        function addToBookingList() {
            // check exists in list
            if (houseInfo.id != null) {
                if (bookingList.filter((house) => house.id === houseInfo.id).length === 0) {
                    console.log("已紀錄房源", houseInfo.id);
                    bookingList.push({
                        id: houseInfo.id,
                        name: houseInfo.name,
                        resources: houseInfo.houseExternalResourceRecords,
                    });
                }
            }
        }

        function removeBookingListById(id) {
            if (id != null) {
                let index = bookingList.findIndex((house) => house.id === id);
                bookingList.splice(index, 1);
            }
        }

        function cleanBookingList() {
            bookingList.splice(0, bookingList.length);
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
                    checkIsDiscussHouse();
                    getHostInfo();
                    getPreviewDiscussList();
                    getSelfHouseDiscuss();
                })
                .catch((err) => {
                    Object.assign(houseInfo, initialHouseInfo);
                    isErrorGetHouseInfo.value = true;
                    isLoading.value = false;
                    console.log("Get houseInfo from database failed! Take you to home page!");
                });
        }

        async function getHostInfo() {
            await api
                .get(`/user/find/${houseInfo.userId}`)
                .then((res) => {
                    console.log("Get host avater success");
                    Object.assign(hostInfo, res.data);
                })
                .catch((err) => {
                    Object.assign(hostInfo, initialHostInfo);
                    console.log("Get host avater failed");
                });
        }

        async function getPreviewDiscussList() {
            await api
                .get(`/discuss/house/${houseInfo.id}`, { params: { pageNo: 0, pageSize: 4 } })
                .then((res) => {
                    console.log("Get preview discuss success", res.data);
                    previewDiscussList.splice(0, previewDiscussList.length);
                    previewDiscussList.push(...res.data.discusses);
                    totalDiscussCount.value = res.data.totalElements;
                })
                .catch((err) => {
                    console.log("Get preview discuss failed");
                });
        }

        async function getHouseDiscuss() {
            let data = null;
            await api
                .get(`/discuss/house/${houseInfo.id}`, {
                    params: {
                        pageNo: currentDiscussPage.value,
                        pageSize: 10,
                    },
                })
                .then((res) => {
                    console.log("Get house discuss success");
                    data = res.data;
                })
                .catch((err) => {
                    // Object.assign(houseDiscuss, initialHuseDiscuss);
                    console.log("Get host avater failed");
                });

            return data;
        }

        async function getSelfHouseDiscuss() {
            if (userStore.user.id !== null) {
                await api
                    .get(`/discuss/user/${userStore.user.id}/${houseInfo.id}`)
                    .then((res) => {
                        console.log("取得自己的評論成功", res.data.discuss, res.data.score);
                        Object.assign(selfHouseDiscuss, res.data);
                    })
                    .catch((err) => {
                        Object.assign(selfHouseDiscuss, initialSelfHouseDiscuss);
                        console.log("取得自己的評論失敗，你沒有評論");
                    });
            }
        }

        async function writeSelfHouseDiscuss() {
            if (userStore.user.id !== null) {
                await api
                    .post(`/discuss/`, {
                        houseId: houseInfo.id,
                        userId: userStore.user.id,
                        score: selfHouseDiscuss.score,
                        show: true,
                        discuss: selfHouseDiscuss.discuss,
                    })
                    .then((res) => {
                        console.log("評論成功");
                    })
                    .catch((err) => {
                        console.log("評論失敗");
                    });
                getSelfHouseDiscuss();
                getPreviewDiscussList();
                reloadDiscussList();
            } else {
                console.log("尚未登入，登入後再評論");
                router.push("/login");
            }
        }

        async function addHouseToCollection() {
            isLoadingCollection.value = true;
            if (typeof userStore.user.id !== "undefined") {
                await api
                    .post("/user-collection/", {
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

        async function removeHouseToCollection() {
            isLoadingCollection.value = true;
            if (typeof userStore.user.id !== "undefined") {
                await api
                    .post("/user-collection/delete", {
                        userId: userStore.user.id,
                        houseId: houseInfo.id,
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

        async function checkIsCollectedHouse() {
            isLoadingCollection.value = true;
            if (userStore.user.id !== null) {
                await api
                    .get("/user-collection/", {
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
                        isLoadingCollection.value = true;
                    });
            } else {
                console.log("You are not login! can't check collection.");
            }
        }

        async function checkIsDiscussHouse() {
            if (userStore.user.id !== null) {
                await api
                    .get(`/house/mongo/find/${userStore.user.id}/${houseInfo.id}`)
                    .then((res) => {
                        console.log("Check house disscess success.");
                        // if (res.data.isCollected) {
                        //     isCollected.value = true;
                        // } else {
                        //     isCollected.value = false;
                        // }
                        // isLoadingCollection.value = false;
                        // console.log(res.data);
                    })
                    .catch((err) => {
                        console.log("Check house collection failed.");
                        // isLoadingCollection.value = true;
                    });
            } else {
                console.log("You are not login! can't check discuss.");
            }
        }

        return {
            houseInfo,
            hostInfo,
            selfHouseDiscuss,
            discussList,
            previewDiscussList,
            currentDiscussPage,
            totalDiscussCount,
            isErrorGetHouseInfo,
            isLoading,
            isLoadingCollection,
            isCollected,
            isShareDialogOpen,
            isDiscussDialogOpen,
            isMoreDiscussesDialogOpen,
            renderDiscussList,
            bookingList,
            resetHouseInfo,
            reloadDiscussList,
            getHouseDetailImage,
            getHouseInfo,
            getPreviewDiscussList,
            getHouseDiscuss,
            getSelfHouseDiscuss,
            writeSelfHouseDiscuss,
            addHouseToCollection,
            removeHouseToCollection,
            checkIsCollectedHouse,
            checkIsDiscussHouse,
            addToBookingList,
            removeBookingListById,
            cleanBookingList,
        };
    },
    {
        persist: { pick: ["bookingList"] },
    }
);
