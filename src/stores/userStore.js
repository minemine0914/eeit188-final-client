import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref } from "vue";
import * as jwtDecode from "jwt-decode";

export const useUserStore = defineStore(
  "userView",
  () => {
    // Data
    const jwtToken = ref(null);
    const user = ref(null);

    // Methods
    async function register(userData) {
      try {
        const response = await api({
          method: "post",
          url: "/user/",
          data: userData,
        });
        console.log("Registration successful:", response.data);
        return response.data;
      } catch (error) {
        console.error("Registration failed:", error);
        throw error;
      }
    }

    async function loginAuth(loginData) {
      try {
        const response = await api({
          method: "post",
          url: "/user/login",
          data: loginData,
        });
        jwtToken.value = response.data.token;
        user.value = await findUserById(jwtToken.id);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    }

    async function findUserById() {
      try {
        const userId = decodeToken(jwtToken).id;
        const response = await api({
          method: "get",
          url: `/user/${userId}`,
        });
        user.value = response.data;
      } catch (error) {
        console.log(error);
      }
    }

    async function updateUser(request) {
      try {
        const userId = decodeToken(jwtToken).id;
        await api({
          method: "put",
          url: `/user/${userId}`,
          data: request,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function uploadAvater(request) {
      try {
        const userId = decodeToken(jwtToken).id;
        await api({
          method: "post",
          url: `/user/upload-avatar/${userId}`,
          data: request,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function uploadBackgroundImage(file) {
      const userId = decodeToken(jwtToken).id;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await api.post(
            `/user/upload-background-image/${userId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }

    async function downloadBackgroundImage(userId) {
      try {
        const response = await api({
          method: "get",
          url: `/user/download-background-image/${userId}`,
          responseType: "blob",
        });
        return response.data;
      } catch (error) {
        console.error("Error downloading background image:", error);
        throw error;
      }
    }

    async function getChatRecord(userId) {
      try {
        const response = await api({
          method: "get",
          url: `/chat-record/${userId}`,
        });
        return response.data;
      } catch (error) {
        console.error("Error downloading background image:", error);
        throw error;
      }
    }

    async function addChatRecord(request) {
      try {
        const response = await api({
          method: "post",
          url: `/chat-record/`,
          data: request,
        });
        console.log("ok");
      } catch (error) {
        console.error("Error downloading background image:", error);
        throw error;
      }
    }

    function decodeToken() {
      if (typeof jwtToken.value === "string" && jwtToken.value.trim() !== "") {
        try {
          return jwtDecode.jwtDecode(jwtToken.value);
        } catch (error) {
          console.error("Failed to decode JWT token:", error);
          return null;
        }
      } else {
        console.error("Invalid JWT token:", jwtToken.value);
        return null;
      }
    }

    return {
      user,
      jwtToken,
      register,
      loginAuth,
      decodeToken,
      findUserById,
      updateUser,
      uploadAvater,
      uploadBackgroundImage,
      downloadBackgroundImage,
      getChatRecord,
      addChatRecord,
    };
  },
  {
    persist: true,
  }
);
