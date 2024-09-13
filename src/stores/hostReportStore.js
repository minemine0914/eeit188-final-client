// src/stores/useHostReportStore.js

import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useHostReportStore = defineStore('hostReport', {
    state: () => ({
        // loginUser: 'e61abdb4-d054-4188-9e41-c2691792cf73',
        loginUser: 'f27a7b80-4d60-44cf-aa1c-9b44dd375698',
        selectedYear: '',
        selectedMonth: '',
        selectedQuarter: '',
        selectedHouse: '',
        selectedUser: '',
        users:[{"id":''}],
        houses: [],
        records: [],
        selectedHouse: null,
        usersResult: '',
        housesResult: '',
        minCreatedAt: '',
        maxCreatedAt: "2024-09-13T06:15:24.850+00:00"
    }),
    getters: {
        currentUser: (state) => state.users.find(user => user.id === state.selectedUser?.id) || null,
    },
    actions: {
        setSelectedUser(userId) {
            this.selectedUser = this.users.find(user => user.id === userId) || null;
        },
        async fetchHouses(userId) {
            try {
                console.log(userId)
                if(userId){
                    this.loginUser=userId
                }
                const response = await api.post('/house/search', {
                    userId: this.loginUser,
                    page: 0,
                    limit: 100
                });
                this.houses = response.data.content;
            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        },

        async fetchTransactionRecords() {
            console.log(this.selectedHouse)
            if (!this.selectedHouse) return;

            try {
                // const minCreatedAt = new Date(1900, 8, 13, 14, 0, 0)
                const minCreatedAt = new Date(0)
                // const maxCreatedAt = new Date(2028, 8, 13, 16, 0, 0)
                const maxCreatedAt = new Date()
                const houseId = this.selectedHouse
                const response = await api.post(`/transcation_record/search`, {
                    houseId,
                    limit: 1000,
                    minCreatedAt,
                    maxCreatedAt,
                    "order": "createdAt",
                    "dir": true
                });
                console.log(response.data)
                const transformedRecords = await this.searchUserAgainByRecordId(response.data.content);
                console.log(transformedRecords)
                this.records = transformedRecords;
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async findAllUserString() {
            try {
                const response = await api.get(`/user/`);
                this.usersResult = response.data.users.map(user => user.id || 0);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async findAllUserArray() {
            try {
                const response = await api.get(`/user/`);
                this.users = response.data.users;
                console.log('this.users',this.users)
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
            const dataAmount = 10;
            for (let i = 0; i < dataAmount; i++) {
                try {
                    const houseId = this.housesResult[Math.floor(Math.random() * this.housesResult.length)];
                    const userId = this.usersResult[Math.floor(Math.random() * this.usersResult.length)];

                    await api.post(`/transcation_record/`, {
                        houseId,
                        userId,
                        cashFlow: Math.pow(10, i),
                        deal: "haha",
                        platformIncome: Math.pow(10, i)
                    });
                } catch (error) {
                    console.error('Error inserting transaction record:', error);
                }
            }
        },

        async searchUserAgainByRecordId(contentArray) {
            const transformedArray = await Promise.all(contentArray.map(async (element) => {
                if (typeof element === 'object' && !Array.isArray(element)) {
                    return element;
                } else if (typeof element === 'string') {
                    try {
                        const response = await api.get(`/transcation_record/${element}`);
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching record by ID:', error);
                    }
                }
            }));
            return transformedArray.filter(item => item); // Filter out undefined values
        }
    }
});
