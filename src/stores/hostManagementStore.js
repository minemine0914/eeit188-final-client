import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref, reactive } from "vue";

export const useHostManagementStore = defineStore("hostManagement", () => {
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
      const response = await api.get("/houses"); // 假設路徑
      properties.value = response.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  // 2. 添加房源，對應於 HouseController 的 API
  async function addProperty(propertyData) {
    try {
      const response = await api.post("/houses", propertyData); // 假設路徑
      properties.value.push(response.data);
    } catch (error) {
      console.error("Error adding property:", error);
      throw error;
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

  // 7. 上傳房源圖片，對應於 HouseExternalResourceController 的 API
  async function uploadPropertyImage(propertyId, file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/houses/${propertyId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading property image:", error);
      throw error;
    }
  }

  // 8. 獲取房源背景圖片，對應於 HouseExternalResourceController 的 API
  async function fetchPropertyBackgroundImage(propertyId) {
    try {
      const response = await api.get(`/houses/${propertyId}/background`, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 9. 從 MongoDB 獲取房源資料，對應於 HouseMongoController 的 API
  async function fetchMongoProperty(propertyId) {
    try {
      const response = await api.get(`/houses/mongo/${propertyId}`); // 假設路徑
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
    fetchPropertyBackgroundImage,
    fetchMongoProperty,
    fetchAllhouse,
    fetchHouseById,
    countAllhouse,
  };
});
