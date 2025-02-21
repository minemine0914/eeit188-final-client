// 此程式會從現有的使用者抓取使用者清單 並從清單內位每個使用者建立隨機的一間房源

import axios from "axios";
import https from "https";
import FormData from "form-data"; // 用來構建 form-data 請求
import fs from "fs"; // 用於讀取 JSON 檔案

// API 網址
let eeitApiUrl;
// eeitApiUrl = "https://localhost/api"; // 上線環境
eeitApiUrl = "http://localhost:8080"; // 開發環境

// 定義抓取使用者清單的參數
const userParams = {
    pageNo: 0,
    pageSize: 50,
};

let foundUserCount = 0;
let processingUserCount = 0;

// 創建 axios 實例並設置 baseURL
const apiClient = axios.create({
    baseURL: eeitApiUrl,
    timeout: 20000, // 可選：設置請求超時（10秒）
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
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
            console.log(`(${processingUserCount}/${foundUserCount}) Coordinates of ${query}: Latitude ${lat}, Longitude ${lon}`);
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
        console.error(`(${processingUserCount}/${foundUserCount}) Unable to get coordinates for ${randomCity.CityName} ${randomArea.AreaName}`);
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
        console.error(`(${processingUserCount}/${foundUserCount}) Error creating house for user: ${user.name}[${user.id}]:`, error.message, houseData);
    }
};

// 生成隨機圖片 URL 的函數
const generateRandomImageUrl = () => {
    return `https://picsum.photos/640/320.webp?random=${Math.floor(Math.random() * 10000)}`;
    // return `https://loremflickr.com/640/320/house`;
};

// 從 URL 下載圖片並返回 Buffer 的函數
const downloadImage = async imageUrl => {
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    return Buffer.from(imageResponse.data, "binary");
};

// 上傳多張圖片的函數
const uploadMultipleImages = async houseId => {
    try {
        const formData = new FormData();
        formData.append("houseId", houseId); // 添加 houseId

        // 下載並添加 7 張隨機圖片到 form-data 中
        for (let i = 0; i < 7; i++) {
            const imageUrl = generateRandomImageUrl(); // 生成隨機圖片的 URL
            const imageBuffer = await downloadImage(imageUrl); // 下載圖片
            formData.append("files", imageBuffer, `image-${i + 1}.jpg`); // 添加圖片到 form-data
        }

        // 發送 POST 請求上傳圖片
        const response = await apiClient.post("/house-external-resource/", formData, {
            headers: {
                ...formData.getHeaders(), // 設置適當的 headers
            },
        });

        console.log(`(${processingUserCount}/${foundUserCount}) Images uploaded for house ${houseId}:`, response.data.locations);
    } catch (error) {
        console.error(`(${processingUserCount}/${foundUserCount}) Error uploading images for house ${houseId}:`, error.message);
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
        console.log("No users found to create houses.");
    }
};

// 執行主函數
main();
