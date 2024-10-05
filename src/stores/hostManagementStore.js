import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref, reactive } from "vue";
import { useUserStore } from "./userStore";

export const useHostManagementStore = defineStore("hostManagement", () => {
  const userStore = useUserStore();

  // 狀態
  const state = reactive({
    properties: [], // 房源
    reviews: [], // 評價
    orders: [], // 訂單
    selectedProperty: null, // 當前選中的房源
    selectedReview: null, // 當前選中的評價
    loading: false, // 加載狀態
    error: null, // 錯誤訊息
  });

  // 錯誤處理方法
  function handleError(error) {
    state.loading = false;
    if (error.response) {
      // 確保 error.response 存在，避免 undefined 錯誤
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
      state.error = error.response.data.message || "Unknown error occurred";
    } else if (error.request) {
      // 請求發出但沒有收到回應
      console.error("No response from server:", error.request);
      state.error = "No response received from server";
    } else {
      // 其他錯誤
      console.error("Error:", error.message);
      state.error = error.message || "An unknown error occurred";
    }
  }

  // 清空錯誤訊息
  function clearError() {
    state.error = null;
  }

  // 狀態
  const properties = ref([]); // 房源
  const reviews = ref([]); // 評價
  const orders = ref([]); // 訂單
  const selectedProperty = ref(null); // 當前選中的房源
  const selectedReview = ref(null); // 當前選中的評價

  // 方法

  // 1. 獲取所有房源，對應於 HouseController 的 API
  async function fetchProperties() {
    try {
      const response = await api.get("/house"); // 假設路徑
      state.properties.value = response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  // 2. 添加房源，對應於 HouseController 的 API
  async function addProperty(propertyData) {
    let data = {
      ...propertyData,
      userId: userStore.user.id,
      price: propertyData.price,
    };
    clearError();
    state.loading = true;
    await api
      .get("https://nominatim.openstreetmap.org/search.php", {
        params: {
          q: propertyData.city + propertyData.region,
          format: "jsonv2",
        },
      })
      .then((res) => {
        console.log("OpenStreetMap search long lat:", res.data);
        if (res.data.length !== 0) {
          data.latitudeX = res.data[0].lat;
          data.longitudeY = res.data[0].lon;
        }
      })
      .catch((err) => {
        // console.log();
      });
    try {
      const response = await api.post("/house/", data);
      state.properties.push(response.data);
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }

  // 3. 更新房源，對應於 HouseController 的 API
  async function updateProperty(propertyId, propertyData) {
    try {
      const response = await api({
        method: "put",
        url: `/house/${propertyId}`,
        data: propertyData,
      });

      return response;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  }

  // 4. 刪除房源，對應於 HouseController 的 API
  async function deleteProperty(propertyId) {
    try {
      await api({
        method: "delete",
        url: `/house/${propertyId}`,
      });
      properties.value = properties.value.filter((p) => p.id !== propertyId);
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  }

  // 5. 獲取訂單，對應於 TranscationRecordController 的 API
  async function fetchOrders() {
    try {
      const response = await api.get("/transactions"); // 假設路徑
      orders.value = response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // 6. 獲取特定房源的評價，對應於 HouseController 的 API
  async function fetchReviews(propertyId) {
    try {
      const response = await api.get(`/houses/${propertyId}/reviews`); // 假設路徑
      reviews.value = response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  }

  // 7. 上傳房源圖片
  async function uploadPropertyImage(propertyId, file) {
    clearError();
    state.loading = true;
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("houseId", propertyId);
      await api.post(`/house-external-resource/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      state.loading = false;
    } catch (error) {
      handleError(error);
      state.loading = false;
    }
  }

  async function fetchPropertyImages(propertyId) {
    clearError();
    state.loading = true;
    try {
      const response = await api.get(`/house-external-resource/image/${propertyId}`);
      console.log(response)
      state.images = response.data.content;
      state.loading = false;
      return response;
    } catch (error) {
      handleError(error);
      state.loading = false;
    }
  }
  // 8. 獲取房源背景圖片，對應於 HouseExternalResourceController 的 API
  // async function fetchPropertyBackgroundImage(propertyId) {
  //   try {
  //     const response = await api.get(`/house/${propertyId}/background`, {
  //       responseType: "blob",
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async function deleteImage(propertyId, imageId) {
    try {
      await api.delete(`/house-external-resource/${imageId}`, {
        params: { houseId: propertyId },
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }





  // 9. 從 MongoDB 獲取房源資料，對應於 HouseMongoController 的 API
  async function fetchMongoProperty(propertyId) {
    try {
      const response = await api.get(`/house/mongo/${propertyId}`); // 假設路徑
      selectedProperty.value = response.data;
    } catch (error) {
      console.error("Error fetching MongoDB property:", error);
      throw error;
    }
  }

  // 10. 使用房東ID取得所有房源
  async function fetchAllhouse(userId) {
    try {
      const response = await api({
        method: "post",
        url: "/house/search",
        data: {
          userId: userId,
          page: 0,
          limit: 100,
          order: "createdAt",
          dir: true,
        },
      });

      return response.data.content;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 11. 使用houseId查詢單一筆房源資料
  async function fetchHouseById(houseId) {
    try {
      const response = await api({
        method: "get",
        url: `/house/${houseId}`,
      });

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 12. 使用userId查詢房東所擁有的房源總數
  async function countAllhouse(userId) {
    try {
      const response = await api({
        method: "get",
        url: `/user/find/${userId}`,
      });

      return response.data.houseCount;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function fetchHostCountDetail(hostId) {
    try {
      const response = await api.get(`/house/host-count-detail/${hostId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  return {
    properties,
    reviews,
    orders,
    selectedProperty,
    selectedReview,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
    fetchOrders,
    fetchReviews,
    uploadPropertyImage,
    deleteImage,
    fetchPropertyImages,
    //fetchPropertyBackgroundImage,
    fetchMongoProperty,
    fetchAllhouse,
    fetchHouseById,
    countAllhouse,
    fetchHostCountDetail,
  };
});
