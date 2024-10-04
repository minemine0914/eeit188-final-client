// src/stores/hostReportStore.js

import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useHostReportStore = defineStore('hostReport', {
    state: () => ({
        isLoading: false,
        loginUser: {},
        // loginUser: 'f27a7b80-4d60-44cf-aa1c-9b44dd375698',
        selectedHouseId: '',
        selectedUserId: '',

        users: [{ "id": '' }],
        houses: [],
        records: [],
        // recordsPrapared: [],
        // recordsPraparedPlatform: [],

        minCreatedAt: '',
        maxCreatedAt: '',

        selectedPeriod: 'month',
        allYear: false,
        allMonth: true,
        allQuarter: true,

        years: [],
        months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        quarters: ['Q1', 'Q2', 'Q3', 'Q4'],
        selectedYear: '',
        selectedMonth: '1',
        selectedQuarter: '1',

        labels: { name: '', values: [] },

        pics: {
            doge: {
                title: 'doge',
                src: 'https://m.media-amazon.com/images/I/41Bk064aTrL._AC_UF894,1000_QL80_.jpg',
            },
            cat: {
                title: 'cat',
                src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTerRVtsqtqpRscjFIa4yKtVl5XheMoJSvCQA&s',
            },
            smoker: {
                title: 'smoker',
                src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8XvMeMgm-z6_XRI9StUPdeyQLrmVQ8Xmd1w&s',
            },
            toys: {
                title: 'toys',
                src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdGzzG5LzcHNGjCKOg2gACv_8tT0ZN2lbcbw&s',
            },
            good: {
                title: 'good',
                src: 'https://memeprod.ap-south-1.linodeobjects.com/user-template/b3a4babd59ebb46530a7f7cca856d848.png',
            },
        }
    }),
    getters: {
        //依據查詢結果(records)處理資料(依照年份做篩選)
        itemsSource: (state) => {
            let output = state.records
            let temp = state.selectedHouseId
            if (!output) return
            if (!state.allYear) {
                output = output.filter(item => item.year === state.selectedYear);
            }
            if (!state.allMonth) {
                output = output.filter(item => item.month === state.selectedMonth);
            }
            console.log("record處理後的結果itemSource=", output)
            return output
        },
        recordsPrapared: (state) => {
            if (state.selectedPeriod === 'year') {
                return state.turnToY(state.records);
                // store.recordsPraparedPlatform = store.turnToYPlatform(store.records);
            } else if (state.selectedPeriod === 'month') {
                return state.turnToYM(state.records);
                // store.recordsPraparedPlatform = store.turnToYMPlatform(store.records);
            } else if (state.selectedPeriod === 'quarter') {
                return state.turnToYQ(state.records);
                // store.recordsPraparedPlatform = store.turnToYQPlatform(store.records);
            }
        },
        recordsPraparedPlatform: (state) => {
            if (state.selectedPeriod === 'year') {
                return state.turnToYPlatform(state.records);
                // store.recordsPraparedPlatform = store.turnToYPlatform(store.records);
            } else if (state.selectedPeriod === 'month') {
                return state.turnToYMPlatform(state.records);
                // store.recordsPraparedPlatform = store.turnToYMPlatform(store.records);
            } else if (state.selectedPeriod === 'quarter') {
                return state.turnToYQPlatform(state.records);
                // store.recordsPraparedPlatform = store.turnToYQPlatform(store.records);
            }
        },
    },
    actions: {
        // 0.找出所有host
        async findAllHost() {
            try {
                const response = await api.get(`/user/find-users?pageSize=1000`);
                this.users = response.data.users;
                this.users = this.users.filter(user => user.houseCount != 0)
                console.log('找到的所有host = this.users', this.users)

                // 0.1 修正user只有ID的問題，User ID->User物件
                for (let i = 0; i < this.users.length; i++) { this.users[i] = await this.searchUserAgainByRecordId(this.users[i]); }
                console.log('找到的所有host = this.users', this.users)
            } catch (error) {
                console.error('Error fetching hosts:', error);
            }
        },

        // 1.用host(user)找house
        async fetchHouses(userId) {
            try {
                //如果有傳入userId，以傳入值搜尋。否則以登入者loginUser查詢
                if (userId) {
                    this.loginUser.id = userId
                }
                const response = await api.post('/house/mongo/scores/average-of-user', {
                    userId: this.loginUser.id,
                    page: 0,
                    limit: 1000,
                    dir: true,
                    order: "averageScore"
                });

                this.houses = response.data.content.map(item => {
                    const { houseDetails, averageScore } = item;
                    return {
                        ...houseDetails,
                        averageScore: averageScore
                    };
                });

                // House插入點擊數click
                const click = await api.post('/house/mongo/count/all/click', {
                    page: 0,
                    limit: 1000,
                    dir: true,
                    order: "counts"
                });

                // Combine the arrays
                const combinedClick = this.houses.map(item1 => {
                    const item2 = click.data.content.find(item => item.houseId === item1.id);
                    return {
                        ...item1,
                        click: item2 ? item2.counts : 0 // Add counts if found, otherwise default to 0
                    };
                });

                this.houses = combinedClick

                // House插入分享數share
                const share = await api.post('/house/mongo/count/all/share', {
                    page: 0,
                    limit: 1000,
                    dir: true,
                    order: "counts"
                });

                // Combine the arrays
                const combinedShare = this.houses.map(item1 => {
                    const item2 = share.data.content.find(item => item.houseId === item1.id);
                    return {
                        ...item1,
                        share: item2 ? item2.counts : 0 // Add counts if found, otherwise default to 0
                    };
                });

                this.houses = combinedShare

                console.log('host底下的house=this.houses', this.houses)
                //如果查詢結果為空，產生一個NO HOUSE結果
                if (Object.keys(this.houses).length === 0) {
                    this.houses = [{ id: '', name: 'NO HOUSES' }]
                }
                //指定第一筆資料做顯示
                this.selectedHouseId = this.houses[0].id

                console.log('沒有house的情況，處理後的this.houses = ', this.houses)
            } catch (error) {
                console.error('Error fetching houses:', error);
            }
        },

        // 2.列出找到的house，找出有資料的頭尾年分
        async fetchTransactionRecordsStartingValue(year, month, quarter) {
            if (!this.selectedHouseId) {
                this.records = []
                return
            }

            try {
                console.log('currentHouseID', this.selectedHouseId)
                //default
                let minCreatedAt = new Date(0)
                let maxCreatedAt = new Date()
                const houseId = this.selectedHouseId

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
                    let startYear = new Date(first.data.content[0].createdAt).getFullYear()
                    console.log('fetch 1st year', startYear)

                    body.dir = true //desc
                    const last = await api.post(`/transcation_record/search`, body);
                    let endYear = new Date(last.data.content[0].createdAt).getFullYear()
                    console.log('fetch last year', endYear)

                    this.years = []
                    for (let i = Number(startYear); i <= Number(endYear); i++) {
                        this.years.push(i)
                        // console.log(startYear, endYear, i)
                    }
                    // console.log(this.years.filter(year => typeof year === 'number'))
                    this.selectedYear = this.years[this.years.length - 1]
                    // console.log(this.years)

                }
            } catch (error) {
                console.error('Error fetching tx-records:', error);
            }
        },

        // 3.找出所有交易紀錄(和交易過的user)
        async fetchTransactionRecords(year, month, quarter) {
            //log*******************
            console.log('this.selectedHouseId', this.selectedHouseId)
            //log*******************
            if (!this.selectedHouseId) {
                console.log('NO selectedHouseId')
                this.records = []
                return
            }

            try {
                //default
                console.log('year = ', year)
                let minCreatedAt = year ? new Date(year, 0, 1) : new Date(0)
                let maxCreatedAt = year ? new Date(parseInt(year) + 1, 0, 1) : new Date()
                const houseId = this.selectedHouseId
                //log**********
                console.log('minCreatedAt = ', minCreatedAt)
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
                console.log('All Records response.data', response.data)

                // 4.1 修正回傳值TxRecord只有ID的問題，TxRecord ID->TxRecord物件
                let transformedRecords = await this.searchRecordAgainByRecordId(response.data.content);
                console.log('fix recordID', transformedRecords)
                // 4.2.1 修正house只有ID的問題，House ID->House物件
                for (let item of transformedRecords) { item.house = await this.searchHouseAgainByRecordId(item.house); }
                console.log('fix houseID', transformedRecords)

                // 4.2.2 修正user只有ID的問題，User ID->User物件
                for (let item of transformedRecords) { item.user = await this.searchUserAgainByRecordId(item.user); }
                console.log('fix userID', transformedRecords)

                // 4.3 把CreatedAt的時間拆開成不同object，方便篩選
                transformedRecords = await this.separateCreatedAt(transformedRecords)
                console.log('fix cratedeAT', transformedRecords)

                // 4.4 查詢評分
                transformedRecords = await this.getScore(transformedRecords)
                console.log('transformedRecords with score', transformedRecords)

                this.records = transformedRecords;

                // 資料輸出格式
                //YMDC={Year: yyyy, Month: MM, Date: dd, cashFlow: $$$}

                //YMD={yyyy:
                //       1: [1,2,3,...,31], 
                //       2: [...],...}

                //YM={2023: [1,2,3,...,12], 
                //    2024: [...], ...}

                //YQ={2023: [Q1, Q2, Q3, Q4]
                //    2024: [...], ...}

                //Y={2023: $$$, 2024: $$$, ...}

                if (this.selectedPeriod === 'year') {
                    this.turnToY()
                } else if (this.selectedPeriod === 'month') {
                    this.turnToYM()
                } else if (this.selectedPeriod === 'quarter') {
                    this.turnToYQ()
                }

            } catch (error) {
                console.error('Error fetching transcation_record:', error);
            }
        },

        // 4.1 修正回傳值TxRecord只有ID的問題，TxRecord ID->TxRecord物件
        async searchRecordAgainByRecordId(contentArray) {
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

        // 4.2.1 修正house只有ID的問題，House ID->House物件
        async searchHouseAgainByRecordId(element) {
            if (typeof element === 'object' && !Array.isArray(element)) {
                return element;
            } else if (typeof element === 'string') {
                try {
                    const response = await api.get(`/house/${element}`);
                    return response.data;
                } catch (error) {
                    console.error('Error fetching record by ID:', error);
                }
            }
        },

        // 4.2.2 修正user只有ID的問題，House ID->House物件
        async searchUserAgainByRecordId(element) {
            if (typeof element === 'object' && !Array.isArray(element)) {
                return element;
            } else if (typeof element === 'string') {
                try {
                    const response = await api.get(`/user/find/${element}`);
                    return response.data;
                } catch (error) {
                    console.error('Error fetching record by ID:', error);
                }
            }
        },

        // 4.3 把CreatedAt的時間拆開成不同object，方便篩選
        async separateCreatedAt(contentArray) {
            for (let i = 0; i < contentArray.length; i++) {
                // Parse the date string
                const date = new Date(contentArray[i].createdAt);

                // Create the output object
                const output = {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1, // getMonth() returns 0-11
                    date: date.getDate(),
                    ...contentArray[i] // Spread the other properties
                };
                // Remove the original createdAt property if desired
                // delete output.createdAt;
                contentArray[i] = output
            }
            return contentArray
        },

        // 4.4 查詢評分
        async getScore(contentArray) {
            for (let i = 0; i < contentArray.length; i++) {
                let score = 0
                try {
                    const response = await api.get(`/house/mongo/find/${contentArray[i].user.id}/${this.selectedHouseId}`);
                    if (response.data?.score) {
                        score = response.data.score
                    }
                } catch (error) {
                    console.error('Error fetching score:', error);
                }
                contentArray[i].houseScore = score
            }
            return contentArray
        },

        turnToYMD(YMDC) {
            if (!YMDC) {
                YMDC = this.records
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
            return result
        },

        turnToYM(YMDC) {
            if (!YMDC) {
                YMDC = this.records
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
            return result
        },

        turnToYQ(YMDC) {
            if (!YMDC) {
                YMDC = this.records
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
            return result
        },

        turnToY(YMDC) {
            if (!YMDC) {
                YMDC = this.records
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

            const keys = Object.keys(result)
            const start = Math.min(...keys)
            const end = Math.max(...keys)
            let output = []
            for (let i = start; i <= end; i++) {
                output.push(result[i] || 0)
            }

            // Convert the yearly cash flow object to an array of values
            // console.log("RES", result, start, end)
            // const output = Object.values(result);
            // console.log("output", output)
            return output
        },

        // Function to sum monthly data across all years
        sumMonthlyData(data) {
            const monthlySum = new Array(12).fill(0); // Initialize an array for 12 months

            // Iterate over each year in the data
            for (const year in data) {
                const monthlyData = data[year];

                // Sum each month's data
                monthlyData.forEach((value, month) => {
                    monthlySum[month] += value; // Add to the corresponding month
                });
            }

            return monthlySum; // Returns an array of summed monthly data
        },

        turnToYMDPlatform(YMDC) {
            if (!YMDC) {
                YMDC = this.records
            }
            // Initialize the result object
            const result = {};

            // Iterate over each entry in the simpleArr
            YMDC.forEach(entry => {
                const { year, month, date, platformIncome } = entry;

                // Initialize the year and month entries if they don't exist
                if (!result[year]) {
                    result[year] = {};
                }
                if (!result[year][month]) {
                    // Initialize an array for days of the month (31 days max)
                    result[year][month] = new Array(31).fill(0);
                }

                // Add the cash flow to the appropriate day (date - 1 because array is zero-indexed)
                result[year][month][date - 1] += platformIncome;
            });
            return result
        },

        turnToYMPlatform(YMDC) {
            if (!YMDC) {
                YMDC = this.records
            }
            // Initialize the result object
            const result = {};

            // Iterate over each entry in the simpleArr
            YMDC.forEach(entry => {
                const { year, month, platformIncome } = entry;

                // Initialize the year entry if it doesn't exist
                if (!result[year]) {
                    result[year] = new Array(12).fill(0);
                }

                // Add the cash flow to the appropriate month (1-based index, so subtract 1)
                result[year][month - 1] += platformIncome;
            });
            return result
        },

        turnToYQPlatform(YMDC) {
            if (!YMDC) {
                YMDC = this.records
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
                const { year, month, platformIncome } = entry;
                const quarter = getQuarter(month);

                // Initialize year and quarters if not present
                if (!result[year]) {
                    result[year] = [0, 0, 0, 0]; // Q1, Q2, Q3, Q4
                }

                // Add the cash flow to the appropriate quarter
                result[year][quarter] += platformIncome;
            });
            return result
        },

        turnToYPlatform(YMDC) {
            if (!YMDC) {
                YMDC = this.records
            }
            // Initialize the result object
            const result = {};

            // Iterate over each entry in the input array
            YMDC.forEach(entry => {
                const { year, platformIncome } = entry;

                // Initialize or update the yearly cash flow in the result object
                if (!result[year]) {
                    result[year] = 0;
                }
                result[year] += platformIncome;
            });

            // Convert the yearly cash flow object to an array of values
            const output = Object.values(result);

            return output

        },

        getUserBySelectedUserId(userId) {
            if (typeof userId === 'object' || Array.isArray(userId)) {
                userId = userId[0];
            }
            return this.users.find(user => user.id === userId) || null;
        },

        // for houses
        async getHouseClick(houseId) {
            try {
                const response = await api.post(`/house/mongo/count/click`, { "houseId": houseId });
                // console.log('gethouseclickresponse', response.data)
                return response.data
            } catch (error) {
                console.error('Error fetching users:', error);
            }
            return 0
        },

        // get click only
        async getselectedHouseClick() {
            try {
                const response = await api.post(`house/mongo/count/click`, { houseId: this.selectedHouseId });
                // console.log('HGGHHGHGHGH', response.data)
                return response.data
            } catch (error) {
                console.log("catch error!", error)
                return 0
            }
        },

        formatDate(date) {
            return `${new Date(date).getFullYear()}年${String(new Date(date).getMonth() + 1).padStart(2, '0')}月${String(new Date(date).getDate()).padStart(2, '0')}日 ${String(new Date(date).getHours()).padStart(2, '0')}:${String(new Date(date).getMinutes()).padStart(2, '0')}:${String(new Date(date).getSeconds()).padStart(2, '0')}`
        },
    },
});