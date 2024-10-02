import { defineStore } from "pinia";
import { nextTick, reactive, ref } from "vue";
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

const initalScoreDetail = {
    totalReviews: 0,
    scoresInRange4To5: 0,
    scoresInRange2To3: 0,
    scoresInRange3To4: 0,
    scoresInRange0To1: 0,
    scoresInRange1To2: 0,
    averageScore: 0,
};

const userStore = useUserStore();
export const useHouseDetailStore = defineStore(
    "HouseDetail",
    () => {
        const router = useRouter();
        const houseInfo = reactive({ ...initialHouseInfo });
        const hostInfo = reactive({ ...initialHostInfo });
        const selfHouseDiscuss = reactive({ ...initialSelfHouseDiscuss });
        const previewDiscussList = reactive([]);
        const discussList = reactive([]);
        const currentDiscussPage = ref(0);
        const scoreDetail = reactive({ ...initalScoreDetail });
        const isErrorGetHouseInfo = ref(false);
        const isLoading = ref(true);
        const isLoadingCollection = ref(false);
        const isCollected = ref(false);
        const isShareDialogOpen = ref(false);
        const isDiscussDialogOpen = ref(false);
        const isMoreDiscussesDialogOpen = ref(false);
        const renderDiscussList = ref(true);

        // Record booking list into localstorage
        // (pinia plugin persistedstate could not use reactive!!)
        const bookingList = ref([]);

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
            if (houseInfo.id != null && userStore.user.id != null) {
                let house = {
                    id: houseInfo.id,
                    name: houseInfo.name,
                    resources: houseInfo.houseExternalResourceRecords,
                };
                let currentIndex = bookingList.value.findIndex(
                    (list) => list.userId == userStore.user.id
                );
                if (currentIndex == -1) {
                    bookingList.value.push({
                        userId: userStore.user.id,
                        list: new Array(),
                    });
                    // Using bookingList.length - 1 to always target the last added user
                    if (
                        bookingList.value[bookingList.value.length - 1].list.filter(
                            (house) => house.id == houseInfo.id
                        ).length == 0
                    ) {
                        bookingList.value[bookingList.value.length - 1].list.push(house);
                        console.log(
                            `[HouseDetailStore] BookingList: 新增紀錄 房源(${house.name}) 使用者(${
                                bookingList.value[bookingList.value.length - 1].userId
                            })`
                        );
                    }
                } else {
                    if (
                        bookingList.value[currentIndex].list.filter(
                            (house) => house.id == houseInfo.id
                        ).length == 0
                    ) {
                        bookingList.value[currentIndex].list.push(house);
                        console.log(
                            `[HouseDetailStore] BookingList: 新增紀錄 房源(${house.name}) 使用者(${
                                bookingList.value[bookingList.value.length - 1].userId
                            })`
                        );
                    }
                }
            }
        }

        // 取得當前使用者的BookingList
        function getBookingList() {
            let list = [];
            if (houseInfo.id != null && userStore.user.id != null) {
                let currentIndex = bookingList.value.findIndex(
                    (list) => list.userId == userStore.user.id
                );
                if (currentIndex != -1) {
                    list.push(...bookingList.value[currentIndex].list);
                }
            }
            return list;
        }

        function removeBookingList() {
            if (houseInfo.id != null && userStore.user.id != null) {
                let currentIndex = bookingList.value.findIndex(
                    (list) => list.userId == userStore.user.id
                );
                if (currentIndex != -1) {
                    let houseIndex = bookingList.value[currentIndex].list.findIndex(
                        (house) => house.id == houseInfo.id
                    );
                    if (houseIndex != -1) {
                        bookingList.value[currentIndex].list.splice(houseIndex, 1);
                        console.log(
                            `[HouseDetailStore] BookingList: 刪除紀錄 房源(${houseInfo.name}) 使用者(${bookingList.value[currentIndex].userId})`
                        );
                    }
                }
            }
        }

        function cleanBookingList() {
            if (houseInfo.id != null && userStore.user.id) {
                let currentIndex = bookingList.value.findIndex(
                    (list) => list.userId === userStore.user.id
                );
                if (currentIndex !== -1) {
                    bookingList.value[currentIndex].list.splice(
                        0,
                        bookingList.value[currentIndex].list.length
                    );
                    console.log(
                        `[HouseDetailStore] BookingList: 清除紀錄 使用者(${
                            bookingList.value[bookingList.value.length - 1].userId
                        })`
                    );
                }
            }
        }

        async function getHouseInfo(id) {
            isLoading.value = true;
            await api
                .get(`/house/${id}`)
                .then((res) => {
                    Object.assign(houseInfo, res.data);
                    isErrorGetHouseInfo.value = false;
                    isLoading.value = false;
                    console.log("[HouseDetailStore] Get houseInfo from database sucessed!");
                })
                .catch((err) => {
                    Object.assign(houseInfo, initialHouseInfo);
                    isErrorGetHouseInfo.value = true;
                    isLoading.value = false;
                    console.log(
                        "[HouseDetailStore] Get houseInfo from database failed! Take you to home page!"
                    );
                });
        }

        async function getHostInfo() {
            await api
                .get(`/user/find/${houseInfo.userId}`)
                .then((res) => {
                    console.log("[HouseDetailStore] Get host avater success");
                    Object.assign(hostInfo, res.data);
                })
                .catch((err) => {
                    Object.assign(hostInfo, initialHostInfo);
                    console.log("[HouseDetailStore] Get host avater failed");
                });
        }

        async function getPreviewDiscussList() {
            await api
                .get(`/discuss/house/${houseInfo.id}`, { params: { pageNo: 0, pageSize: 4 } })
                .then((res) => {
                    console.log("[HouseDetailStore] Get preview discuss success", res.data);
                    previewDiscussList.splice(0, previewDiscussList.length);
                    previewDiscussList.push(...res.data.discusses);
                })
                .catch((err) => {
                    console.log("[HouseDetailStore] Get preview discuss failed");
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
                    console.log("[HouseDetailStore] Get house discuss success");
                    data = res.data;
                })
                .catch((err) => {
                    // Object.assign(houseDiscuss, initialHuseDiscuss);
                    console.log("[HouseDetailStore] Get host discuss failed");
                });

            return data;
        }

        async function getScoreDetail() {
            await api
                .get(`/house/mongo/scores/${houseInfo.id}`)
                .then((res) => {
                    console.log("[HouseDetailStore] Get score detail success", res.data);
                    Object.assign(scoreDetail, initalScoreDetail);
                    Object.assign(scoreDetail, res.data);
                })
                .catch((err) => {
                    Object.assign(scoreDetail, initalScoreDetail);
                    console.log("[HouseDetailStore] Get score detail failed");
                });
        }

        async function getSelfHouseDiscuss() {
            if (userStore.user.id !== null) {
                await api
                    .get(`/discuss/user/${userStore.user.id}/${houseInfo.id}`)
                    .then((res) => {
                        console.log("[HouseDetailStore] 取得自己的評論成功", res.data.score);
                        Object.assign(selfHouseDiscuss, res.data);
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] 取得自己的評論失敗，你沒有評論");
                        Object.assign(selfHouseDiscuss, initialSelfHouseDiscuss);
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
                        console.log("[HouseDetailStore] 評論成功");
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] 評論失敗");
                    });
                getSelfHouseDiscuss();
                getPreviewDiscussList();
                getScoreDetail();
                reloadDiscussList();
            } else {
                console.log("[HouseDetailStore] 尚未登入，登入後再評論");
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
                        console.log("[HouseDetailStore] Add house to collection success.", res);
                        isCollected.value = true;
                        isLoadingCollection.value = false;
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] Add house to collection failed.");
                        isLoadingCollection.value = false;
                    });
            } else {
                console.log("[HouseDetailStore] You are not login! can't collect house.");
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
                        console.log("[HouseDetailStore] Remove house to collection success.", res);
                        isCollected.value = false;
                        isLoadingCollection.value = false;
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] Remove house to collection failed.");
                        isLoadingCollection.value = false;
                    });
            } else {
                console.log("[HouseDetailStore] You are not login! can't collect house.");
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
                        console.log("[HouseDetailStore] Check house collection success.");
                        if (res.data.isCollected) {
                            isCollected.value = true;
                        } else {
                            isCollected.value = false;
                        }
                        isLoadingCollection.value = false;
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] Check house collection failed.");
                        isLoadingCollection.value = true;
                    });
            } else {
                console.log("[HouseDetailStore] You are not login! can't check collection.");
            }
        }

        async function checkIsDiscussHouse() {
            if (userStore.user.id !== null) {
                await api
                    .get(`/house/mongo/find/${userStore.user.id}/${houseInfo.id}`)
                    .then((res) => {
                        console.log("[HouseDetailStore] Check house disscess success.");
                        // if (res.data.isCollected) {
                        //     isCollected.value = true;
                        // } else {
                        //     isCollected.value = false;
                        // }
                        // isLoadingCollection.value = false;
                        // console.log(res.data);
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] Check house collection failed.");
                        // isLoadingCollection.value = true;
                    });
            } else {
                console.log("[HouseDetailStore] You are not login! can't check discuss.");
            }
        }

        async function recordHouseMongoClick() {
            if (userStore.user.id !== null) {
                await api
                    .post(`/house/mongo/click`, {
                        userId: userStore.user.id,
                        houseId: houseInfo.id,
                    })
                    .then((res) => {
                        console.log("[HouseDetailStore] Record user click house success.");
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] Record user click house failed.");
                    });
            } else {
                console.log("[HouseDetailStore] You are not login! can't check discuss.");
            }
        }

        async function recordHouseMongoShare() {
            if (userStore.user.id !== null) {
                await api
                    .post(`/house/mongo/share`, {
                        userId: userStore.user.id,
                        houseId: houseInfo.id,
                    })
                    .then((res) => {
                        console.log("[HouseDetailStore] Record user share house success.");
                    })
                    .catch((err) => {
                        console.log("[HouseDetailStore] Record user share house failed.");
                    });
            } else {
                console.log("[HouseDetailStore] You are not login! can't check discuss.");
            }
        }

        return {
            houseInfo,
            hostInfo,
            selfHouseDiscuss,
            discussList,
            scoreDetail,
            previewDiscussList,
            currentDiscussPage,
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
            getHostInfo,
            getPreviewDiscussList,
            getHouseDiscuss,
            getScoreDetail,
            getSelfHouseDiscuss,
            writeSelfHouseDiscuss,
            addHouseToCollection,
            removeHouseToCollection,
            checkIsCollectedHouse,
            checkIsDiscussHouse,
            addToBookingList,
            getBookingList,
            removeBookingList,
            cleanBookingList,
            recordHouseMongoClick,
            recordHouseMongoShare,
        };
    },
    {
        // persist: true,
        persist: {
            pick: ["bookingList"],
        },
    }
);
