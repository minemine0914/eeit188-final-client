<template>
    <div style="border:1px solid black; margin:50px;">
        <div>
            <div style="display: inline-block;">
                <p>users列表</p><textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
                    v-model="store.usersResult"></textarea>
            </div>
            <div style="display: inline-block;">
                <p>houses列表</p>
                <textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
                    v-model="store.housesResult"></textarea>
            </div>
        </div>
        <p>**注意1和2要等到抓完資料(列表出現ID字串)才可以繼續下一步</p>
        1. 抓取使用者清單<button @click="findAllUserString">先點我</button>
        <br>
        2. 抓取房源清單(會卡卡，稍等他一下)<button @click="findAllHouse">再點我</button>
        <br>
        3.1 產生假交易<button @click="crossInsertTransactionRecord">最後再點我</button>
        <br>
        3.2 隨機產生點擊/分享<button @click="generateClickAndShare">最後再點我</button>
        <p>{{ store.progress }}</p>
    </div>
</template>

<script setup>
import { useCreateTransactionRecordStore } from '@/stores/createTransactionRecordStore';

const store = useCreateTransactionRecordStore();

const findAllUserString = () => {
    store.findAllUserString();
};

const findAllHouse = () => {
    store.findAllHouse();
};

const crossInsertTransactionRecord = () => {
    if (!store.usersResult) findAllUserString()
    if (!store.housesResult) findAllHouse()

    store.crossInsertTransactionRecord();
};

const generateClickAndShare = () => {
    store.generateClickAndShare()
}

</script>

<style scoped>
button {
    border: 1px solid black;
}
</style>
