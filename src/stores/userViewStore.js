import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref } from "vue";
import * as jwtDecode from "jwt-decode";

export const useUserViewStore = defineStore(
  "userView",
  () => {
    // Data
    const jwtToken = ref(null);

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
      } catch (error) {
        console.error("Login failed:", error);
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

    return { jwtToken, register, loginAuth, decodeToken };
  },
  {
    persist: true,
  }
);
