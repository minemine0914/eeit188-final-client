import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref, reactive } from "vue";
import * as jwtDecode from "jwt-decode";
import { useRouter } from "vue-router";
import emptyUserAvavtarImage from "@/assets/user.png";

const initialUser = {
  id: null,
  name: null,
  role: null,
  gender: null,
  birthday: null,
  phone: null,
  mobilePhone: null,
  address: null,
  email: null,
  about: null,
  createdAt: null,
  updatedAt: null,
  avatarBase64: null,
  houseCount: null,
};

export const useUserStore = defineStore(
  "user",
  () => {
    // use Router
    const router = useRouter();

    // Data
    const jwtToken = ref(null);
    const passwordResetToken = ref(null);
    const user = reactive({ ...initialUser });

    // Methods
    function resetJWTTokenAndUser() {
      console.log("Reset user info");
      // remove axios auth header
      api.defaults.headers.common["Authorization"] = null;
      // reset pinia user state
      jwtToken.value = null;
      // Object.assign(user, initialUser);
      for (const key in initialUser) {
        user[key] = initialUser[key]; // 逐一設置 user 的屬性
      }
    }

    async function register(userData) {
      try {
        await api({
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

    async function adminLoginAuth(loginData) {
      try {
        const response = await api({
          method: "post",
          url: "/user/system/login",
          data: loginData,
        });
        // if (response.data && response.data.token) {
        //   localStorage.setItem('jwtToken', response.data.token); 
          jwtToken.value = response.data.token; 
        // } else {
        //   //console.error('未能取得 token');
        //   throw new Error('未能取得 token');
        // }

        await reloadUser();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    function logout() {
      resetJWTTokenAndUser();
      router.push("/");
    }

    function adminLogout() {
      resetJWTTokenAndUser();
      router.push("/system/login");
    }

    function removePasswordResetToken() {
      passwordResetToken.value = null;
      router.push("/login");
    }

    function adminRemovePasswordResetToken() {
      passwordResetToken.value = null;
      router.push("/system/login").then(() => {
        window.location.reload();
      });
    }

    function adminLogout() {
      resetJWTTokenAndUser();
      router.push("/system");
    }

    async function reloadUser() {
      console.log("Reloading user info...");
      api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken.value}`;
      try {
        const userId = decodeToken(jwtToken.value).id;
        const response = await api({
          method: "get",
          url: `/user/find/${userId}`,
        });
        Object.assign(user, initialUser);
        Object.assign(user, response.data);
        if ( user.avatarBase64 == null ) {
          user.avatarBase64 = emptyUserAvavtarImage;
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function updateUser(request) {
      try {
        await api({
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
        const response = await api.get(
          `/user/download-background-image/${user.id}`,
          {
            responseType: "blob",
          }
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    }

    async function getChatRecord() {
      try {
        const response = await api({
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
        passwordResetToken.value = response.data.token;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function adminForgotPassword(request) {
      try {
        const response = await api({
          method: "post",
          url: `/user/system/forgot-password`,
          data: request,
        });
        passwordResetToken.value = response.data.token;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function resetPasswordFromEmailLink(request) {
      const userId = decodeToken(passwordResetToken.value).id;

      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${passwordResetToken.value}`;

      try {
        await api({
          method: "put",
          url: `/user/set-new-password/${userId}`,
          data: request,
        });

        resetJWTTokenAndUser();
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function checkPassword(request) {
      try {
        const response = await api({
          method: "post",
          url: `/user/check-password/${user.id}`,
          data: request,
        });
        return response;
      } catch (error) {
        console.error(error);
        return false;
      }
    }

    async function resetPassword(request) {
      try {
        await api({
          method: "put",
          url: `/user/set-new-password/${user.id}`,
          data: request,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    async function deleteUser() {
      try {
        await api({
          method: "delete",
          url: `/user/${user.id}`,
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    function decodeToken(token) {
      if (typeof token === "string" && token.trim() !== "") {
        try {
          return jwtDecode.jwtDecode(token);
        } catch (error) {
          console.error("Failed to decode JWT token:", error);
          return null;
        }
      } else {
        console.error("Invalid JWT token:", token);
        return null;
      }
    }

    return {
      user,
      jwtToken,
      passwordResetToken,
      resetJWTTokenAndUser,
      register,
      loginAuth,
      adminLoginAuth,
      logout,
      removePasswordResetToken,
      adminRemovePasswordResetToken,
      adminLogout,
      decodeToken,
      updateUser,
      reloadUser,
      uploadAvater,
      uploadBackgroundImage,
      downloadBackgroundImage,
      getChatRecord,
      addChatRecord,
      forgotPassword,
      adminForgotPassword,
      resetPasswordFromEmailLink,
      checkPassword,
      resetPassword,
      deleteUser,
    };
  },
  {
    persist: true,
  }
);
