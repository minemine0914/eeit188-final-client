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

const preCreateDiscussTemplates = [
    { discuss: "這住宿體驗還不錯", score: 4 },
    { discuss: "房東很有趣", score: 4 },
    { discuss: "東西很好吃，小孩很喜歡", score: 5 },
    { discuss: "清潔度還可以", score: 3 },
    { discuss: "服務人員態度很好", score: 5 },
    { discuss: "位置非常便利", score: 5 },
    { discuss: "房間有點小", score: 3 },
    { discuss: "價錢很划算", score: 4 },
    { discuss: "隔音效果不太好", score: 2 },
    { discuss: "房間非常乾淨", score: 5 },
    { discuss: "浴室設備很新", score: 5 },
    { discuss: "床墊不太舒適", score: 2 },
    { discuss: "附近有很多餐廳", score: 5 },
    { discuss: "電視有點問題", score: 3 },
    { discuss: "WIFI 很快", score: 5 },
    { discuss: "房間不夠亮", score: 3 },
    { discuss: "冷氣很吵", score: 2 },
    { discuss: "位置離景點很近", score: 5 },
    { discuss: "房東很友善", score: 4 },
    { discuss: "家具有些舊", score: 3 },
    { discuss: "周邊環境很安靜", score: 5 },
    { discuss: "早餐選擇不多", score: 3 },
    { discuss: "房間大小剛好", score: 4 },
    { discuss: "空調很舒服", score: 5 },
    { discuss: "浴室有霉味", score: 2 },
    { discuss: "交通便利，方便遊玩", score: 5 },
    { discuss: "停車不太方便", score: 3 },
    { discuss: "服務非常周到", score: 5 },
    { discuss: "房間有蚊子", score: 1 },
    { discuss: "住宿環境非常好", score: 5 },
    { discuss: "房間的設施有待改善", score: 3 },
    { discuss: "床鋪很乾淨", score: 4 },
    { discuss: "附近有便利商店", score: 5 },
    { discuss: "熱水器有點問題", score: 2 },
    { discuss: "房間打掃得很乾淨", score: 5 },
    { discuss: "窗戶無法完全關閉", score: 3 },
    { discuss: "位置鬧中取靜", score: 4 },
    { discuss: "浴室有些老舊", score: 3 },
    { discuss: "價格合理，值得推薦", score: 5 },
    { discuss: "附近有超市，方便購物", score: 5 },
    { discuss: "房間內有異味", score: 2 },
    { discuss: "服務速度非常快", score: 5 },
    { discuss: "房間布置很溫馨", score: 4 },
    { discuss: "公共區域設施不多", score: 3 },
    { discuss: "房東人非常好", score: 5 },
    { discuss: "房間很安靜", score: 5 },
    { discuss: "衛浴設備不太好用", score: 2 },
    { discuss: "入住手續很方便", score: 4 },
    { discuss: "附近景點很多", score: 5 },
    { discuss: "住宿位置非常方便", score: 5 },
    { discuss: "服務非常親切", score: 5 },
    { discuss: "房間有異味，稍微影響住宿體驗", score: 2 },
    { discuss: "價格合理，值得推薦", score: 4 },
    { discuss: "設施有點老舊，需要改善", score: 3 },
    { discuss: "早餐豐富，家人很喜歡", score: 5 },
    { discuss: "隔音效果差，影響睡眠", score: 2 },
    { discuss: "床鋪舒適，睡得很好", score: 5 },
    { discuss: "附近有很多好吃的餐廳", score: 5 },
    { discuss: "房間整體清潔度不佳", score: 2 },
    { discuss: "浴室很乾淨，令人滿意", score: 4 },
    { discuss: "無線網路不穩定，影響使用", score: 2 },
    { discuss: "環境安靜，適合放鬆", score: 5 },
    { discuss: "房東非常熱情，入住很愉快", score: 5 },
    { discuss: "衛浴設備齊全", score: 4 },
    { discuss: "房間空間較小，但還算舒適", score: 3 },
    { discuss: "位置偏遠，交通不太方便", score: 3 },
    { discuss: "提供的餐點非常美味", score: 5 },
    { discuss: "冷氣效果不佳，房間稍熱", score: 2 },
    { discuss: "提供的設施齊全，住得很滿意", score: 4 },
    { discuss: "價格偏高，性價比一般", score: 3 },
    { discuss: "停車位充足，對開車旅客很方便", score: 5 },
    { discuss: "房間光線不足，感覺有點壓抑", score: 3 },
    { discuss: "住了兩天，整體感覺不錯", score: 4 },
    { discuss: "床單乾淨，讓人感覺很舒適", score: 5 },
    { discuss: "附近交通便利，地理位置佳", score: 5 },
    { discuss: "房東不夠友善，入住體驗不佳", score: 2 },
    { discuss: "提供的設施相當不錯", score: 4 },
    { discuss: "廁所設備需要改善", score: 2 },
    { discuss: "房間很安靜，適合休息", score: 5 },
    { discuss: "水壓不足，淋浴不太方便", score: 3 },
    { discuss: "服務人員很專業，感覺很好", score: 5 },
    { discuss: "景色美麗，非常推薦", score: 5 },
    { discuss: "房東態度不好，讓人感覺不愉快", score: 1 },
    { discuss: "房間溫暖舒適", score: 4 },
    { discuss: "離景點很近，非常方便", score: 5 },
    { discuss: "客房清潔度有待提升", score: 3 },
    { discuss: "房間設施都很好，住得滿意", score: 4 },
    { discuss: "冷氣效果非常好，睡得很舒服", score: 5 },
    { discuss: "床不太舒服，影響睡眠品質", score: 2 },
    { discuss: "服務非常到位，體驗很棒", score: 5 },
    { discuss: "廁所清潔度不好", score: 2 },
    { discuss: "設施很齊全，值得推薦", score: 4 },
    { discuss: "離市中心遠，需要搭車", score: 3 },
    { discuss: "房間隔音不錯，住得安心", score: 4 },
];

// 取得使用者清單 (limit=100)
// api url [GET] : /user/find-users?pageNo=0&pageSize=100
// response data: { users:[ { id: "", ... }, { ... }, ... ] }

// 取得房源清單 (limit=100)
// api url [GET] : /house/all?page=0&limit=100&dir=true&order=createdAt
// response data: { content:[ { id: "", ... }, { ... }, ... ] }

// 新增評論 (每個使用者至少評論3~5間房)
// api url [POST]: /discuss/
// post data: { houseId: "", userId: "", show: true, score: 從範例隨機, discuss: 從範例隨機 }

async function addRandomDiscuss() {
    try {
        // 取得使用者清單
        const usersResponse = await apiClient.get("/user/find-users?pageNo=0&pageSize=500");
        const users = usersResponse.data.users;

        // 取得房源清單
        const housesResponse = await apiClient.get("/house/all?page=0&limit=500&dir=true&order=createdAt");
        const houses = housesResponse.data.content;

        for (let index = 0; index < users.length; index++) {
            const user = users[index];
            console.log(`(${index + 1} / ${users.length}) 處理使用者 ${index + 1} / ${users.length}`); // 顯示目前處理的使用者計算

            // 每位使用者隨機評論 3~5 間房源
            const numberOfReviews = Math.floor(Math.random() * 3) + 3; // 隨機 3 到 5

            for (let i = 0; i < numberOfReviews; i++) {
                const randomHouse = houses[Math.floor(Math.random() * houses.length)];
                const randomTemplate =
                    preCreateDiscussTemplates[Math.floor(Math.random() * preCreateDiscussTemplates.length)];

                const discussData = {
                    houseId: randomHouse.id,
                    userId: user.id,
                    show: true,
                    score: randomTemplate.score,
                    discuss: randomTemplate.discuss,
                };

                // 發送 POST 請求新增評論
                await apiClient.post("/discuss/", discussData);
                console.log(
                    `(${index + 1} / ${users.length}) 成功新增評論: ${discussData.discuss}，分數: ${
                        discussData.score
                    }，房源: ${randomHouse.name}[${randomHouse.id}]`
                );
            }
        }
    } catch (error) {
        console.error("新增評論時出錯:", error);
    }
}

// 執行函數以新增評論
addRandomDiscuss();
