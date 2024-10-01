// src/stores/createTransactionRecordStore.js

import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useCreateTransactionRecordStore = defineStore('createTransactionRecord', {
    state: () => ({
        usersResult: '',
        housesResult: '',
        dataAmount: 10,
    }),
    actions: {
        async findAllUserString() {

            try {
                const response = await api.get(`/user/find-users?pageSize=1000`);
                this.usersResult = response.data.users.map(user => user.id || 0);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async findAllHouse() {
            try {
                const response = await api.get(`/house/all?limit=1000`);
                this.housesResult = response.data.content.map(house => house.id || 0);
            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        },

        async crossInsertTransactionRecord() {
            for (let i = 0; i < this.dataAmount; i++) {
                try {
                    const houseId = this.housesResult[Math.floor(Math.random() * this.housesResult.length)];
                    const userId = this.usersResult[Math.floor(Math.random() * this.usersResult.length)];
                    let cashflow = Math.random() * 10000
                    // console.log(new Date(Date.now() - Math.random() * 86400 * 1000 * 365 * 10))
                    let date = new Date(Date.now() - Math.random() * 86400 * 1000 * 365 * 10)
                    const pad = (num) => String(num).padStart(2, '0');

                    const year = date.getUTCFullYear();
                    const month = pad(date.getUTCMonth() + 1); // Months are zero-based
                    const day = pad(date.getUTCDate());
                    const hours = pad(date.getUTCHours());
                    const minutes = pad(date.getUTCMinutes());
                    const seconds = pad(date.getUTCSeconds());
                    const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
                    // 2024-09-24 17:54:07.2490000
                    date = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
                    console.log(date)

                    let longTime = Date.now() - Math.random() * 86400 * 1000 * 365
                    let startDate = new Date(longTime)
                    let endDate = new Date(Math.min(longTime + Math.random() * 86400 * 1000 * 365, startDate))


                    const response = await api.post("/payment/booking-house", {
                        houseId: houseId,
                        userId: userId,
                        // couponId: couponId ? couponId : null,
                        dateRange: [startDate, endDate],
                    });
                    return response.data;
                } catch (error) {
                    // console.error("Error creating order:", error);
                    throw error;
                }



                //     await api.post(`/transcation_record/`, {
                //         houseId,
                //         userId,
                //         cashFlow: cashflow,
                //         deal: "確認付款中",
                //         platformIncome: cashflow * 0.05,
                //         "createdAt": date,
                //     });
                //     console.log("created", houseId, userId)
                // } catch (error) {
                //     console.error('Error inserting transaction record:', error);
                // }
            }
        },
    }
});
