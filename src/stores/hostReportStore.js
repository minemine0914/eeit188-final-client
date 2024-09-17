// src/stores/hostReportStore.js

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
        recordsPrapared: [],

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
    getters: {},
    actions: {
        // 1.用host(user)找house
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

        // 2.列出找到的house，找出有資料的頭尾年分
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

        // 3.找出所有交易紀錄(和交易過的user)
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

                //YMDC={Year: yyyy, Month: MM, Date: dd, cashFlow: $$$}

                //YMD={yyyy:
                //       1: [1,2,3,...,31], 
                //       2: [...],...}

                //YM={2023: [1,2,3,...,12], 
                //    2024: [...], ...}

                //YQ={2023: [Q1, Q2, Q3, Q4]
                //    2024: [...], ...}

                //Y={2023: $$$, 2024: $$$, ...}

                this.useTestYMDC('YM')

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },

        // 4.修正回傳值user只有ID的問題，userID->user物件
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

        async useTestYMDC(callWhich) {
            let testArr = [
                {
                    "year": 2024,
                    "month": 3,
                    'date': 2,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 3,
                    'date': 12,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 2,
                    "cashFlow": 10
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 22,
                    "cashFlow": 10
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 13,
                    "cashFlow": 1
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 5,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 8,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 27,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 10,
                    "cashFlow": 1
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 26,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 2,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 4,
                    "cashFlow": 10
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 4,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 6,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 29,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 2,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 2,
                    "cashFlow": 1000
                },
                {
                    "year": 2024,
                    "month": 9,
                    'date': 2,
                    "cashFlow": 10
                },
                {
                    "year": 2024,
                    "month": 4,
                    'date': 2,
                    "cashFlow": 100
                },
                {
                    "year": 2023,
                    "month": 6,
                    'date': 2,
                    "cashFlow": 100
                },
                {
                    "year": 2023,
                    "month": 9,
                    'date': 2,
                    "cashFlow": 100
                },
                {
                    "year": 2024,
                    "month": 8,
                    'date': 2,
                    "cashFlow": 10
                },
                {
                    "year": 2023,
                    "month": 5,
                    'date': 2,
                    "cashFlow": 1
                },
                {
                    "year": 2023,
                    "month": 6,
                    'date': 2,
                    "cashFlow": 10
                },
                {
                    "year": 2024,
                    "month": 8,
                    'date': 2,
                    "cashFlow": 1
                }
            ]
            if (callWhich === 'YMD') {
                this.turnToYMD(testArr)
            } else if (callWhich === 'YM') {
                this.turnToYM(testArr)
            } else if (callWhich === 'YQ') {
                this.turnToYQ(testArr)
            } else if (callWhich === 'Y') {
                this.turnToY(testArr)
            }

        },

        async turnToYMD(YMDC) {
            if (!YMDC) {
                YMDC = this.records.map(record => ({
                    year: new Date(record.createdAt).getFullYear(),
                    month: new Date(record.createdAt).getMonth() + 1,
                    date: new Date(record.createdAt).getDate(),
                    cashFlow: record.cashFlow
                }))
            }
            // Initialize the result object
            const result = {};

            // Iterate over each entry in the simpleArr
            YMDC.forEach(entry => {
                const { year, month, date, cashFlow } = entry;

                // Initialize the year and month entries if they don't exist
                if (!result[year]) {
                    result[year] = {};
                }
                if (!result[year][month]) {
                    // Initialize an array for days of the month (31 days max)
                    result[year][month] = new Array(31).fill(0);
                }

                // Add the cash flow to the appropriate day (date - 1 because array is zero-indexed)
                result[year][month][date - 1] += cashFlow;
            });
            this.recordsPrapared = result
            console.log('YMD', this.recordsPrapared);
        },

        async turnToYM(YMDC) {
            if (!YMDC) {
                YMDC = this.records.map(record => ({
                    year: new Date(record.createdAt).getFullYear(),
                    month: new Date(record.createdAt).getMonth() + 1,
                    date: new Date(record.createdAt).getDate(),
                    cashFlow: record.cashFlow
                }))
            }
            // Initialize the result object
            const result = {};

            // Iterate over each entry in the simpleArr
            YMDC.forEach(entry => {
                const { year, month, cashFlow } = entry;

                // Initialize the year entry if it doesn't exist
                if (!result[year]) {
                    result[year] = new Array(12).fill(0);
                }

                // Add the cash flow to the appropriate month (1-based index, so subtract 1)
                result[year][month - 1] += cashFlow;
            });
            this.recordsPrapared = result
            console.log('YM', this.recordsPrapared);
        },

        async turnToYQ(YMDC) {
            if (!YMDC) {
                YMDC = this.records.map(record => ({
                    year: new Date(record.createdAt).getFullYear(),
                    month: new Date(record.createdAt).getMonth() + 1,
                    date: new Date(record.createdAt).getDate(),
                    cashFlow: record.cashFlow
                }))
            }
            // Initialize the result object
            const result = {};

            // Function to determine the quarter from the month
            const getQuarter = (month) => {
                if (month >= 1 && month <= 3) return 0; // Q1
                if (month >= 4 && month <= 6) return 1; // Q2
                if (month >= 7 && month <= 9) return 2; // Q3
                if (month >= 10 && month <= 12) return 3; // Q4
            };

            // Process each entry
            YMDC.forEach(entry => {
                const { year, month, cashFlow } = entry;
                const quarter = getQuarter(month);

                // Initialize year and quarters if not present
                if (!result[year]) {
                    result[year] = [0, 0, 0, 0]; // Q1, Q2, Q3, Q4
                }

                // Add the cash flow to the appropriate quarter
                result[year][quarter] += cashFlow;
            });
            this.recordsPrapared = result
            console.log('YQ', this.recordsPrapared);
        },

        async turnToY(YMDC) {
            if (!YMDC) {
                YMDC = this.records.map(record => ({
                    year: new Date(record.createdAt).getFullYear(),
                    month: new Date(record.createdAt).getMonth() + 1,
                    date: new Date(record.createdAt).getDate(),
                    cashFlow: record.cashFlow
                }))
            }
            // Initialize the result object
            const result = {};

            // Iterate over each entry in the input array
            YMDC.forEach(entry => {
                const { year, cashFlow } = entry;

                // Initialize or update the yearly cash flow in the result object
                if (!result[year]) {
                    result[year] = 0;
                }
                result[year] += cashFlow;
            });

            // Convert the yearly cash flow object to an array of values
            const output = Object.values(result);

            this.recordsPrapared = output
            console.log('Y', this.recordsPrapared);
        },

        async findAllUser() {
            try {
                const response = await api.get(`/user/`);
                this.users = response.data.users;
                console.log('this.users', this.users)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        },



    }
});
