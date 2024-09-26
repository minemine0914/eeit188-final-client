import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/plugins/axios.js";

export const useHouseBookingStore = defineStore("HouseBooking", () => {
    async function getCouponList(userId, page, limit) {
        try {
            const response = await api.post("/coupon/search", {
                userId: userId,
                page: page,
                limit: limit,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async function processBookingPayment(houseId, userId, couponId) {
        try {
            const response = await api.post("/payment/booking-house", {
                houseId: houseId,
                userId: userId,
                couponId: couponId,
            });
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

    return {
        getCouponList,
        processBookingPayment,
    };
});
