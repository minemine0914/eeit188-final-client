// src/stores/useHostReportStore.js

import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useHostReportStore = defineStore('hostReport', {
    state: () => ({
        // loginUser: 'e61abdb4-d054-4188-9e41-c2691792cf73',
        loginUser: 'f27a7b80-4d60-44cf-aa1c-9b44dd375698',
        selectedHouse: '',
        selectedUser: '',

        users: [{ "id": '' }],
        houses: [],
        records: [],

        usersResult: '',
        housesResult: '',

        minCreatedAt: '',
        maxCreatedAt: '',

        selectedPeriod: 'month',
        labels: { name: '', values: [] },
        years: [],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
        selectedYear: '',
        selectedMonth: '',
        selectedQuarter: '',

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
                //如果有傳入userId，以傳入值搜尋。否則以登入者loginUser查詢
                if (userId) {
                    this.loginUser = userId
                }
                const response = await api.post('/house/search', {
                    userId: this.loginUser,
                    page: 0,
                    limit: 1000
                });
                this.houses = response.data.content;
                //如果查詢結果為空，產生一個NO HOUSE結果
                if (Object.keys(this.houses).length === 0) {
                    this.houses = [{ id: '', name: 'NO HOUSES' }]
                }
                //指定第一筆資料做顯示
                this.selectedHouse = this.houses[0].id

            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        },

        async fetchTransactionRecordsStartingValue(year, month, quarter) {
            if (!this.selectedHouse) {
                this.records = []
                return
            }

            try {
                //default
                let minCreatedAt = new Date(0)
                let maxCreatedAt = new Date()
                const houseId = this.selectedHouse

                let body = {
                    houseId,
                    limit: 1,
                    minCreatedAt,
                    maxCreatedAt,
                    "order": "createdAt",
                    "dir": false //asc
                }

                // body.minCreatedAt = new Date(parseInt(this.selectedYear), 0, 1)
                // body.maxCreatedAt = new Date(parseInt(this.selectedYear) + 1, 0, 1)
                // console.log('111111', body.maxCreatedAt)

                //啥都沒傳，初始化years陣列(資料內容的頭~尾年分)
                if (!year && !month && !quarter) {
                    const first = await api.post(`/transcation_record/search`, body);
                    console.log('fetch 1st', new Date(first.data.content[0].createdAt).getFullYear())
                    let startYear = new Date(first.data.content[0].createdAt).getFullYear()

                    body.dir = true //desc
                    const last = await api.post(`/transcation_record/search`, body);
                    console.log('fetch last', new Date(last.data.content[0].createdAt).getFullYear())
                    let endYear = new Date(last.data.content[0].createdAt).getFullYear()

                    this.years = []
                    for (let i = startYear; i <= endYear; i++) {
                        this.years.push(i)
                    }

                    this.selectedYear = this.years[0]
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async fetchTransactionRecords(year, month, quarter) {
            //log*******************
            console.log('this.selectedHouse', this.selectedHouse)
            //log*******************
            if (!this.selectedHouse) {
                console.log('NO selectedHouse')
                this.records = []
                return
            }

            try {
                //default
                console.log('year', year)
                let minCreatedAt = year ? new Date(year, 0, 1) : new Date(0)
                let maxCreatedAt = year ? new Date(parseInt(year) + 1, 0, 1) : new Date()
                const houseId = this.selectedHouse
                //log**********
                console.log('minCA:', minCreatedAt)
                //log***************
                let body = {
                    houseId,
                    limit: 1000,
                    minCreatedAt,
                    maxCreatedAt,
                    "order": "createdAt",
                    "dir": true
                }


                // body.minCreatedAt = new Date(parseInt(this.selectedYear), 0, 1)
                // body.maxCreatedAt = new Date(parseInt(this.selectedYear) + 1, 0, 1)
                // console.log('111111', body.maxCreatedAt)
                const response = await api.post(`/transcation_record/search`, body);
                console.log('response.data', response.data)
                const transformedRecords = await this.searchUserAgainByRecordId(response.data.content);
                console.log('transformedRecords', transformedRecords)
                this.records = transformedRecords;




            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        async sumByYear() {

            let simpleArr = this.records.map(record => ({
                year: new Date(record.createdAt).getFullYear(),
                month: new Date(record.createdAt).getMonth() + 1,
                date: new Date(record.createdAt).getDate(),
                cashFlow: record.cashFlow
            }))

            simpleArr = [
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 1
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 1000000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 1000000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 1000000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 100000
                },
                {
                    "year": 2024,
                    "month": 9,
                    "cashFlow": 10000
                },
                {
                    "year": 2024,
                    "month": 8,
                    "cashFlow": 1000
                },
                {
                    "year": 2023,
                    "month": 5,
                    "cashFlow": 100
                },
                {
                    "year": 2023,
                    "month": 6,
                    "cashFlow": 10
                },
                {
                    "year": 2024,
                    "month": 8,
                    "cashFlow": 1
                }
            ]


            // Aggregate cashFlow by year and month
            const aggregatedCashFlow = simpleArr.reduce((acc, record) => {
                const key = `${record.year}-${record.month}`;
                if (!acc[key]) {
                    acc[key] = { year: record.year, month: record.month, totalCashFlow: 0 };
                }
                acc[key].totalCashFlow += record.cashFlow;
                return acc;
            }, {});

            // Convert the result to an array
            const result = Object.values(aggregatedCashFlow);

            console.log('arr', simpleArr)
            console.log(aggregatedCashFlow);
            console.log(result)

            // Aggregate cashFlow by year
            const aggregatedByYear = result.reduce((acc, record) => {
                const { year, totalCashFlow } = record;
                if (!acc[year]) {
                    acc[year] = 0;
                }
                acc[year] += totalCashFlow;
                return acc;
            }, {});

            // Convert to the desired output format
            const output = Object.entries(aggregatedByYear).reduce((obj, [year, sumcashflow]) => {
                obj[year] = { year: Number(year), sumcashflow };
                return obj;
            }, {});

            console.log(output);
            this.records = output
        },

        async findAllUserArray() {
            try {
                const response = await api.get(`/user/`);
                this.users = response.data.users;
                console.log('this.users', this.users)
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
        },

    }
});
