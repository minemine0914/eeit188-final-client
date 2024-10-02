// 此程式可以重複執行 可以放心使用

import axios from "axios";
import https from "https";
import FormData from "form-data"; // 用來構建 form-data 請求
import fs from "fs"; // 用於讀取 JSON 檔案

// API 網址
let eeitApiUrl;
// eeitApiUrl = "https://localhost/api"; // 上線環境
eeitApiUrl = "http://localhost:8080"; // 開發環境

// 創建 axios 實例並設置 baseURL
const apiClient = axios.create({
    baseURL: eeitApiUrl,
    timeout: 20000, // 可選：設置請求超時（10秒）
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});


// 取得房源清單 (limit=100)
// api url [GET] : /house/all?page=0&limit=100&dir=true&order=createdAt
// response data: { content:[ { id: "", ... }, { ... }, ... ] }


// 取得設施清單 (limit=100)
// api url [GET] : /postulate/findAll?page=0&limit=100&dir=true&order=createdAt
// response data: { content:[ { id: "", name: "", icon: "" }, { ... }, ... ] }


// 編輯房源的設施清單 (隨機放置1~5個設施)
// api url [PUT]: /house/${house.id}
// put data: { postulateIds: [ "${postulate.id}" ] }

async function getHouses() {
    try {
        const response = await apiClient.get("/house/all", {
            params: {
                page: 0,
                limit: 100,
                dir: true,
                order: "createdAt"
            }
        });
        return response.data.content;
    } catch (error) {
        console.error("取得房源清單失敗:", error.response ? error.response.data : error.message);
        return [];
    }
}

async function getPostulates() {
    try {
        const response = await apiClient.get("/postulate/findAll", {
            params: {
                page: 0,
                limit: 100,
                dir: true,
                order: "createdAt"
            }
        });
        return response.data.content;
    } catch (error) {
        console.error("取得設施清單失敗:", error.response ? error.response.data : error.message);
        return [];
    }
}

function getRandomPostulates(postulates) {
    const shuffled = [...postulates].sort(() => 0.5 - Math.random());
    const randomCount = Math.floor(Math.random() * 5) + 1; // 隨機選擇1到5個設施
    return shuffled.slice(0, randomCount).map(postulate => postulate.id);
}

async function updateHousePostulates(house, postulateIds) {
    try {
        const response = await apiClient.put(`/house/${house.id}`, {
            postulateIds: postulateIds
        });
        console.log(`更新房源 ${house.id} 的設施清單成功`, response.data);
    } catch (error) {
        console.error(`更新房源 ${house.id} 的設施清單失敗:`, error.response ? error.response.data : error.message);
    }
}

async function assignPostulatesToHouses() {
    const houses = await getHouses();
    const postulates = await getPostulates();

    if (houses.length === 0 || postulates.length === 0) {
        console.error("無法繼續，因為房源或設施清單為空");
        return;
    }

    for (const house of houses) {
        const randomPostulates = getRandomPostulates(postulates);
        await updateHousePostulates(house, randomPostulates);
    }
}

// 呼叫函式開始分配設施
assignPostulatesToHouses();