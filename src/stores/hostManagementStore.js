import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref, reactive } from "vue";
import { useUserStore } from "./userStore";

export const useHostManagementStore = defineStore("hostManagement", () => {
  const userStore = useUserStore();
  // 狀態
  const state = reactive({
    properties: [],  // 房源
    reviews: [],     // 評價
    orders: [],      // 訂單
    selectedProperty: null,  // 當前選中的房源
    selectedReview: null,    // 當前選中的評價
    loading: false,          // 加載狀態
    error: null,             // 錯誤訊息
  });

  // 錯誤處理方法
  function handleError(error) {
    state.loading = false;
    if (error.response) {
      // 確保 error.response 存在，避免 undefined 錯誤
      console.error("Error response:", error.response.status, error.response.data);
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

  // API 請求函數

  // 獲取所有房源
  async function fetchAllProperties() {
    clearError();
    state.loading = true;
    try {
      const response = await api.get("/house/all");
      state.properties = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }

  async function fetchPropertyDetails(propertyId) {
    clearError();
    state.loading = true;
    try {
      const response = await api.get(`/house/${propertyId}`);
      state.selectedProperty = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }
  // 新增房源
  async function addProperty(propertyData) {
    let data = {...propertyData, userId: userStore.user.id}
    clearError();
    state.loading = true;
    api.get("https://nominatim.openstreetmap.org/search.php",
       { params: { q: propertyData.city + propertyData.region, format: "jsonv2"  } })
       .then((res)=>{
        console.log("OpenStreetMap search long lat:", res.data);
        if (res.data.length !== 0) {
          data.latitudeX = res.data[0].lat;
          data.longitudeY = res.data[0].lon;
        }
       })
       .catch((err)=>{
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

  // 上傳房源圖片
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



  // 更新房源
  async function updateProperty(id, propertyData) {
    clearError();
    state.loading = true;
    try {
      const response = await api.put(`/house/${id}`, propertyData);
      const index = state.properties.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.properties[index] = { ...state.properties[index], ...propertyData };
      }
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }

  // 刪除房源
  async function deleteProperty(id) {
    clearError();
    state.loading = true;
    try {
      await api.delete(`/house/${id}`);
      state.properties = state.properties.filter((p) => p.id !== id); // 移除房源
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }

  // 獲取訂單
  async function fetchOrders() {
    clearError();
    state.loading = true;
    try {
      const response = await api.get("/transcation_record/all");
      state.orders = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }
  // 獲取單筆訂單詳情
  async function fetchOrderDetail(orderId) {
    clearError();
    state.loading = true;
    try {
      const response = await api.get(`/transcation_record/${orderId}`);
      state.selectedOrder = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }
  // 獲取房源評價
  async function fetchReviews(propertyId) {
    clearError();
    state.loading = true;
    try {
      const response = await api.get(`/house/${propertyId}/reviews`);
      state.reviews = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }
  // 獲取所有預約訂單
  async function fetchReservations() {
    clearError();
    state.loading = true;
    try {
      const response = await api.get("/reservation/all");
      state.reservations = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }

  // 獲取單筆預約訂單詳情
  async function fetchReservationDetail(reservationId) {
    clearError();
    state.loading = true;
    try {
      const response = await api.get(`/reservation/${reservationId}`);
      state.selectedReservation = response.data;
      state.loading = false;
    } catch (error) {
      handleError(error);
    }
  }

  return {
    state,
    fetchAllProperties,
    fetchPropertyDetails,
    addProperty,
    updateProperty,
    deleteProperty,
    fetchOrders,
    fetchOrderDetail,
    fetchReservations,
    fetchReservationDetail,
    fetchReviews,
    uploadPropertyImage,

  };
}, {
  // persist: true, // 持久化狀態
});
