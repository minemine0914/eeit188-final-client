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
    const userResetToken = ref(null);
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
        await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "put",
          url: `/user/${user.id}`,
          data: request,
        });
        await reloadUser();
      } catch (error) {
        console.log(error);
      }
    }

    async function uploadAvater(payload) {
      try {
        await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "put",
          url: `/user/upload-avatar/${user.id}`,
          data: payload,
        });
        await reloadUser();
      } catch (error) {
        console.log(error);
      }
    }

    async function uploadBackgroundImage(file) {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          await api.post(`/user/upload-background-image/${user.id}`, formData, {
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
      try {
        const response = await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "get",
          url: `/user/download-background-image/${user.id}`,
          responseType: "blob",
        });
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function getChatRecord() {
      try {
        const response = await api({
          headers: {
            Authorization: `Bearer ${jwtToken.value}`,
          },
          method: "get",
          url: `/chat-record/${user.id}`,
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

    async function forgotPassword(request) {
      try {
        const response = await api({
          method: "post",
          url: `/user/forgot-password`,
          data: request,
        });

        userResetToken.value = response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function checkPassword(request) {
      try {
        const response = await api({
          method: "post",
          url: `/check-password/`,
          data: request,
        });

        userResetToken.value = response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function resetPassword(request) {
      try {
        const response = await api({
          method: "post",
          url: `/user/forgot-password`,
          data: request,
        });

        userResetToken.value = response;
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
