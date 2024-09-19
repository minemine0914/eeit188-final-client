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
                const response = await api.get(`/user/find-users`);
                this.usersResult = response.data.users.map(user => user.id || 0);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async findAllHouse() {
            try {
                const response = await api.get(`/house/all`);
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

                    await api.post(`/transcation_record/`, {
                        houseId,
                        userId,
                        cashFlow: i * 10,
                        deal: "haha",
                        platformIncome: i,
                    });
                } catch (error) {
                    console.error('Error inserting transaction record:', error);
                }
            }
        },
    }
});
