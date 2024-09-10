import { defineStore } from "pinia";
import api from "../plugins/axios";

export const useUserViewStore = defineStore("userView", () => {
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

  return { register };
});
