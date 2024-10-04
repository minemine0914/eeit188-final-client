// 注意!! 最好是當前設施是空的 才運行此程式 不然會重複設施

import axios from "axios";
import https from "https";
import FormData from "form-data"; // 用來構建 form-data 請求
import fs from "fs"; // 用於讀取 JSON 檔案

// API 網址
let eeitApiUrl;
eeitApiUrl = "https://localhost/api"; // 上線環境
// eeitApiUrl = "http://localhost:8080"; // 開發環境

// 創建 axios 實例並設置 baseURL
const apiClient = axios.create({
    baseURL: eeitApiUrl,
    timeout: 20000, // 可選：設置請求超時（10秒）
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

const preCreatePostulateList = [
    { name: "電視", icon: "mdi-television" },
    { name: "電腦", icon: "mdi-laptop" },
    { name: "遊戲機", icon: "mdi-nintendo-game-boy" },
    { name: "健身房", icon: "mdi-weight-lifter" },
    { name: "桌球", icon: "mdi-table-tennis" },
    { name: "速食餐廳", icon: "mdi-food" },
    { name: "ATM", icon: "mdi-currency-usd" },
    { name: "吹風機", icon: "mdi-hair-dryer" },
    { name: "無障礙", icon: "mdi-wheelchair" },
    { name: "WiFi", icon: "mdi-wifi" },
    { name: "有線網路", icon: "mdi-ethernet" },
    { name: "哺乳室", icon: "mdi-human-baby-changing-table" },
    { name: "鋼琴", icon: "mdi-piano" },
    { name: "KTV", icon: "mdi-microphone-variant" },
    { name: "加油站", icon: "mdi-gas-station-in-use" },
    { name: "烤肉架", icon: "mdi-grill" },
];

// 新增設施
// api url [POST] : /postulate/
// data: { name: "...", icon: "..." }
async function createPostulates() {
    for (const postulate of preCreatePostulateList) {
        try {
            const response = await apiClient.post("/postulate/", postulate);
            console.log(`新增設施成功: ${postulate.name}`, response.data);
        } catch (error) {
            console.error(`新增設施失敗: ${postulate.name}`, error.response ? error.response.data : error.message);
        }
    }
}

// 呼叫新增設施函式
createPostulates();
