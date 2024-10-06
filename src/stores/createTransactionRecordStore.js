// src/stores/createTransactionRecordStore.js

import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useCreateTransactionRecordStore = defineStore('createTransactionRecord', {
    state: () => ({
        usersResult: '',
        housesResult: '',
        house: '',
        dataAmountTxRecord: 100,
        dataAmountClickShare: 1000,
        progress: '',
    }),
    actions: {
        async findAllUserString() {

            try {
                const response = await api.get(`/user/find-users?pageSize=1000`);
                this.usersResult = response.data.users.map(user => user.id || 0);
                console.log('users', this.usersResult)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async findAllHouse() {
            try {
                const response = await api.get(`/house/all?limit=1000`);
                this.housesResult = response.data.content.map(house => house.id || 0);
                console.log('houses', this.housesResult)

            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        },

        async crossInsertTransactionRecord() {
            for (let i = 0; i < this.dataAmountTxRecord; i++) {
                try {
                    this.progress = `*開始建立交易(${i + 1}/${this.dataAmountTxRecord})`
                    console.log(`開始建立交易(${i + 1}/${this.dataAmountTxRecord})`)

                    let houseId
                    if (!this.house) {
                        houseId = this.housesResult[Math.floor(Math.random() * this.housesResult.length)];
                    } else {
                        houseId = this.house;
                    }
                    const userId = this.usersResult[Math.floor(Math.random() * this.usersResult.length)];
                    // let cashflow = Math.random() * 10000
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
                    // console.log(date)

                    let longTime = Date.now() - Math.random() * 86400 * 1000 * 365 * 3 // 訂房起始日設為3年內開始
                    let startDate = new Date(longTime)
                    let endDate = new Date(longTime + Math.random() * 86400 * 1000 * 5) // 住1~5天

                    console.log('RRRRRR', [startDate, endDate])
                    const response = await api.post("/payment/booking-house", {
                        houseId: houseId,
                        userId: userId,
                        // couponId: couponId ? couponId : null,
                        dateRange: [startDate, endDate],
                        createdAt: startDate,
                    });
                    console.log('建立成功：', response.data)
                } catch (error) {
                    console.error("Error creating txRecord:", error);
                    // throw error;
                }

            }
            this.progress = `=已建立${this.dataAmountTxRecord}筆交易紀錄`
        },

        async generateClickAndShare() {
            for (let i = 0; i < this.dataAmountClickShare; i++) {
                try {
                    this.progress = `*開始建立點擊/分享/評分(${i + 1}/${this.dataAmountClickShare})`
                    console.log(`開始建立點擊/分享/評分(${i + 1}/${this.dataAmountClickShare})`)

                    let houseId
                    if (!this.house) {
                        houseId = this.housesResult[Math.floor(Math.random() * this.housesResult.length)];
                    } else {
                        houseId = this.house;
                    }
                    const userId = this.usersResult[Math.floor(Math.random() * this.usersResult.length)];
                    let clicked, liked, shared, score
                    do {
                        clicked = Math.random() > 0.5
                        // liked = Math.random() > 0.5
                        shared = Math.random() > 0.5
                        score = Math.floor(Math.random() * 5 + 1)
                    }
                    while (!clicked && !liked && !shared)

                    const response = await api.put("/house/mongo/set-true", {
                        houseId,
                        userId,
                        clicked,
                        // liked,
                        shared,
                        score
                    });
                    console.log('建立成功：', response.data)
                } catch (error) {
                    console.error("Error creating click and share:", error);
                }
            }
            this.progress = `=已建立${this.dataAmountClickShare}點擊/分享`
        },
    }
});
