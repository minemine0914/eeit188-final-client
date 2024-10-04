// 此程式會從現有的使用者抓取使用者清單 並從清單內位每個使用者建立隨機的一間房源
// Usage: node ./script/createHousePixelApi.js --api-key=YOUR_API_KEY

import axios from "axios";
import https from "https";
import FormData from "form-data"; // 用來構建 form-data 請求
import fs from "fs"; // 用於讀取 JSON 檔案

// API 網址
let eeitApiUrl;
eeitApiUrl = "https://localhost/api"; // 上線環境
// eeitApiUrl = "http://localhost:8080"; // 開發環境

// 定義抓取使用者清單的參數
const userParams = {
    pageNo: 0,
    pageSize: 50,
};

let foundUserCount = 0;
let processingUserCount = 0;

// 解析命令行參數
const args = process.argv.slice(2); // 去掉前兩個默認參數

// 創建一個對象來存儲解析後的參數
const params = {};
args.forEach(arg => {
    const [key, value] = arg.split("="); // 根據 "=" 分割
    if (key && value) {
        params[key.replace("--", "")] = value; // 去掉 "--" 前綴
    }
});

// 提取 Pexels API 金鑰
const pexelsApiKey = params["api-key"]; // 獲取 api-key 參數
console.log("Pexels API Key:", pexelsApiKey);

// 確保在使用前檢查是否獲取到了 API 金鑰
if (!pexelsApiKey) {
    console.error("Error: Pexels API Key is required.");
    process.exit(1); // 終止程序，返回非零狀態碼
}

// 創建 axios 實例並設置 baseURL
const apiClient = axios.create({
    baseURL: eeitApiUrl,
    timeout: 20000, // 可選：設置請求超時（10秒）
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

const pexelsApiClient = axios.create({
    baseURL: "https://api.pexels.com/v1",
    headers: {
        Authorization: pexelsApiKey,
    },
});

const cityCountyDataPath = "src/assets/CityCountyData.json";

// 定義抓取使用者清單的函數
const fetchUserList = async params => {
    try {
        const response = await apiClient.get("/user/find-users", { params });
        return response.data.users;
    } catch (error) {
        console.error("Error fetching user list:", error.message);
        return [];
    }
};

// 查詢經緯度的函數
const getCoordinates = async (city, region) => {
    const query = `${city}${region}`;
    const url = `https://nominatim.openstreetmap.org/search.php`;

    try {
        const response = await axios.get(url, {
            params: {
                q: query,
                format: "jsonv2",
            },
        });
        const results = response.data;

        if (results.length > 0) {
            // 獲取第一個結果的經緯度
            const { lat, lon } = results[0];
            console.log(
                `(${processingUserCount}/${foundUserCount}) Coordinates of ${query}: Latitude ${lat}, Longitude ${lon}`
            );
            return { latitude: lat, longitude: lon };
        } else {
            console.log(`(${processingUserCount}/${foundUserCount}) No results found for ${query}`);
            return null;
        }
    } catch (error) {
        console.error(`(${processingUserCount}/${foundUserCount}) Error fetching coordinates: ${error.message}`);
        return null;
    }
};

// 隨機偏移經緯度的函數
const getRandomOffset = maxOffset => {
    // 隨機生成範圍在 -maxOffset 到 maxOffset 之間的數字
    const offset = Math.random() * maxOffset * 2 - maxOffset; // 偏移範圍：-maxOffset 到 +maxOffset
    return offset;
};

// 隨機生成房源名稱
const generateRandomName = () => {
    const adjectives = [
        "豪華",
        "舒適",
        "浪漫",
        "獨特",
        "寬敞",
        "迷人",
        "現代",
        "經典",
        "溫馨",
        "雅致",
        "寧靜",
        "時尚",
        "田園",
        "豪華",
        "生態",
    ];
    const nouns = ["公寓", "別墅", "套房", "小屋", "度假村", "花園", "城堡", "宅邸", "小型住宅", "家庭旅館", "豪宅"];
    const locations = [
        "海邊",
        "山上",
        "市中心",
        "森林中",
        "鄉村",
        "湖邊",
        "沙灘",
        "河岸",
        "商業區",
        "小巷",
        "古城",
        "都市",
        "鄉村",
    ];

    // 隨機選擇兩個形容詞和一個名詞
    const randomAdjective1 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomAdjective2 = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    // 隨機選擇組合方式
    const formatOptions = [
        `${randomAdjective1}${randomAdjective2}的${randomNoun}在${randomLocation}`,
        `${randomAdjective1}的${randomNoun}位於${randomLocation}`,
        `${randomNoun}在${randomLocation}的${randomAdjective1}${randomAdjective2}`,
        `${randomNoun}在${randomLocation}，${randomAdjective1}${randomAdjective2}`,
        `${randomAdjective1}和${randomAdjective2}的${randomNoun}`,
    ];

    return formatOptions[Math.floor(Math.random() * formatOptions.length)];
};

// 隨機生成價格
const generateRandomPrice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min; // 隨機生成 min 到 max 的價格
};

// 隨機生成房間數量
const generateRandomRoomCount = max => {
    return Math.floor(Math.random() * max) + 1; // 隨機生成 1 到 max 的房間數量
};

// 讀取 CityCountyData.json 並儲存到變數
let cityCountyData;
const readCityCountyData = () => {
    if (!cityCountyData) {
        const rawData = fs.readFileSync(cityCountyDataPath);
        cityCountyData = JSON.parse(rawData);
    }
    return cityCountyData;
};

// 隨機生成房源資料的函數
const generateHouseData = async userId => {
    const data = readCityCountyData();
    const randomCity = data[Math.floor(Math.random() * data.length)];
    const randomArea = randomCity.AreaList[Math.floor(Math.random() * randomCity.AreaList.length)];

    // 獲取經緯度
    const coordinates = await getCoordinates(randomCity.CityName, randomArea.AreaName);

    // 隨機偏移範圍，這裡以 0.0005 度為例，根據需求調整
    const offsetLat = getRandomOffset(0.009); // 經度偏移範圍
    const offsetLon = getRandomOffset(0.009); // 緯度偏移範圍

    // 檢查是否成功獲取經緯度
    if (!coordinates) {
        console.error(
            `(${processingUserCount}/${foundUserCount}) Unable to get coordinates for ${randomCity.CityName} ${randomArea.AreaName}`
        );
        return null; // 或者您可以選擇返回一個默認值
    }

    return {
        name: generateRandomName(), // 隨機生成房源名稱
        userId: userId,
        category: "飯店",
        information: "This is Hotel!!!",
        latitudeX: parseFloat(coordinates.latitude + offsetLat), // 使用獲取的經緯度並加上偏移，保持為數字
        longitudeY: parseFloat(coordinates.longitude + offsetLon), // 使用獲取的經緯度並加上偏移，保持為數字
        country: "台灣",
        city: randomCity.CityName,
        region: randomArea.AreaName,
        address: `${randomArea.AreaName} ${randomArea.ZipCode}`, // 根據隨機的區域和郵遞區號組合地址
        price: generateRandomPrice(10000, 30000), // 隨機價格
        price_per_day: generateRandomPrice(500, 1500), // 隨機每日價格
        price_per_week: generateRandomPrice(3000, 10000), // 隨機每週價格
        price_per_month: generateRandomPrice(10000, 30000), // 隨機每月價格
        livingDiningRoom: generateRandomRoomCount(3), // 隨機客廳數量
        bedroom: generateRandomRoomCount(4), // 隨機臥室數量
        restroom: generateRandomRoomCount(2), // 隨機衛生間數量
        bathroom: generateRandomRoomCount(2), // 隨機浴室數量
        adult: generateRandomRoomCount(6), // 隨機成人數量
        child: Math.floor(Math.random() * 4), // 隨機兒童數量
        pet: Math.random() < 0.5, // 隨機是否接受寵物
        smoke: Math.random() < 0.5, // 隨機是否允許吸煙
        kitchen: Math.random() < 0.5, // 隨機是否有廚房
        balcony: Math.random() < 0.5, // 隨機是否有陽台
        show: true,
        review: true,
    };
};

// 在 createHouse 函數中使用 generateHouseData
const createHouse = async user => {
    const houseData = await generateHouseData(user.id); // 隨機生成房源數據

    try {
        const response = await apiClient.post("/house/", houseData);
        let house = response.data;
        console.log(
            `(${processingUserCount}/${foundUserCount}) House created for user: ${user.name}[${user.id}]:\n\t房源: ${house.name}[${house.id}],\n\t經緯度: [${house.latitudeX},${house.longitudeY}],\n\t地址: ${house.country}${house.city}${house.region}${house.address},\n\t初始價格: ${house.price}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `(${processingUserCount}/${foundUserCount}) Error creating house for user: ${user.name}[${user.id}]:`,
            error.message,
            houseData
        );
    }
};

let imageCache = []; // 用於緩存圖片資料
const imageCacheSize = 80; // 緩存的圖片數量

// 獲取隨機圖片 URL 的函數
const getRandomImageUrls = async (count = 7) => {
    const selectedPhotos = [];

    // 優先使用緩存中的圖片
    while (selectedPhotos.length < count && imageCache.length > 0) {
        const randomIndex = Math.floor(Math.random() * imageCache.length);
        selectedPhotos.push(imageCache[randomIndex]);
        imageCache.splice(randomIndex, 1); // 從緩存中刪除已選擇的圖片
    }

    // 如果緩存不足，則從 API 獲取更多圖片
    if (selectedPhotos.length < count) {
        console.log(`[PexelsApi] 從Pexels快取${imageCacheSize}張圖片來源...`);
        try {
            const response = await pexelsApiClient.get("/search", {
                params: {
                    query: "Living room, Bed room, Hotel room",
                    // query: "Hotel room",
                    orientation: "landscape",
                    per_page: imageCacheSize,
                    page: Math.floor(Math.random() * 100) + 1, // 隨機選擇頁面
                },
            });

            const photos = response.data.photos;
            const rateLimit = response.headers["x-ratelimit-limit"];
            const remaining = response.headers["x-ratelimit-remaining"];
            const resetTime = response.headers["x-ratelimit-reset"];

            console.log(`[PexelsApi] 每月配額總請求次數: ${rateLimit}`);
            console.log(`[PexelsApi] 剩餘的請求次數: ${remaining}`);
            console.log(`[PexelsApi] 重新計算週期的時間: ${new Date(resetTime * 1000).toLocaleString()}`);

            if (photos.length > 0) {
                imageCache.push(...photos.map(photo => photo.src.large)); // 更新緩存
                // 繼續選擇新圖片
                while (selectedPhotos.length < count && imageCache.length > 0) {
                    const randomIndex = Math.floor(Math.random() * imageCache.length);
                    selectedPhotos.push(imageCache[randomIndex]);
                    imageCache.splice(randomIndex, 1);
                }
            } else {
                console.error("[PexelsApi] 沒有圖片可以獲取");
            }
        } catch (error) {
            console.error("[PexelsApi] 獲取圖片錯誤:", error.message);
        }
    }

    return selectedPhotos;
};

// 從 URL 下載圖片並返回 Buffer 的函數
const downloadImage = async imageUrl => {
    try {
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        return Buffer.from(imageResponse.data, "binary");
    } catch (error) {
        console.error(`(${processingUserCount}/${foundUserCount}) 下載圖片失敗: ${imageUrl}`, error.message);
        throw error; // 重新拋出錯誤以便上層函數處理
    }
};

// 更新上傳多張圖片的函數
const uploadMultipleImages = async houseId => {
    try {
        const formData = new FormData();
        formData.append("houseId", houseId);

        // 獲取 7 張隨機圖片的 URL
        const imageUrls = await getRandomImageUrls(7);

        // 下載並添加圖片到 form-data 中
        for (let i = 0; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];
            const imageBuffer = await downloadImage(imageUrl);
            formData.append("files", imageBuffer, `image-${i + 1}.jpg`);
        }

        const response = await apiClient.post("/house-external-resource/", formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        console.log(`(${processingUserCount}/${foundUserCount}) 圖片上傳成功! ${houseId}`);
    } catch (error) {
        console.error(`(${processingUserCount}/${foundUserCount}) 圖片上傳失敗! ${houseId}:`, error.message);
    }
};

// 主函數
const main = async () => {
    const users = await fetchUserList(userParams); // 使用已獨立的搜尋參數
    foundUserCount = users.length;
    if (foundUserCount > 0) {
        for (const user of users) {
            processingUserCount++;
            let house = await createHouse(user);
            if (house) {
                await uploadMultipleImages(house.id);
            }
        }
    } else {
        console.log("找不到使用者可以建立房源");
    }
};

// 執行主函數
main();
