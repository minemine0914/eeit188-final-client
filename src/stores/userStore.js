import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref, reactive } from "vue";
import * as jwtDecode from "jwt-decode";
import { useRouter } from "vue-router";

export const useUserStore = defineStore(
  "user",
  () => {
    // Data
    const jwtToken = ref(null);
    const user = reactive({});
    const router = useRouter();

    // Methods
    async function register(userData) {
      try {
        const response = await api({
          method: "post",
          url: "/user/createUser",
          data: userData,
        });
        console.log("Registration successful:", response.data);
        return response.data;
      } catch (error) {
        console.error(error);
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
        await reloadUser();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    function logout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      router.push("/").then(() => {
        window.location.reload();
      });
    }

    function adminLogout() {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      router.push("/system").then(() => {
        window.location.reload();
      });
    }

    async function reloadUser() {
      try {
        const userId = decodeToken().id;
        const response = await api({
          method: "get",
          url: `/user/find/${userId}`,
        });
        Object.assign(user, response.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function updateUser(request) {
      try {
        const userId = decodeToken().id;
        await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "put",
          url: `/user/${userId}`,
          data: request,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function uploadAvater(payload) {
      try {
        const userId = decodeToken().id;
        await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "put",
          url: `/user/upload-avatar/${userId}`,
          data: payload,
        });
      } catch (error) {
        console.log(error);
      }
    }

    async function uploadBackgroundImage(file) {
      const userId = decodeToken().id;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          await api.post(`/user/upload-background-image/${userId}`, formData, {
            headers: {
              Authorization: `Bearer ${jwtToken.value}`,
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
    }

    async function downloadBackgroundImage() {
      const userId = decodeToken().id;
      try {
        const response = await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "get",
          url: `/user/download-background-image/${userId}`,
          responseType: "blob",
        });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function getChatRecord(userId) {
      try {
        const response = await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "get",
          url: `/chat-record/${userId}`,
        });
        return response.data.chatRecords;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function addChatRecord(request) {
      try {
        await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "post",
          url: `/chat-record/`,
          data: request,
        });
      } catch (error) {
        console.error(error);
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
      logout,
      adminLogout,
      decodeToken,
      updateUser,
      reloadUser,
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
