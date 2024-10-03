<template>
    <div style="border:1px solid black; margin:50px;">
        <div>
            <div style="display: inline-block;">
                <p>all users</p><textarea
                    style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
                    v-model="store.usersResult"></textarea>
            </div>
            <div style="display: inline-block;">
                <p>all houses</p>
                <textarea style="width: 25rem;height:500px;border:1px solid black;font-family: monospace;"
                    v-model="store.housesResult"></textarea>
            </div>
        </div>

        (1.抓取使用者清單<button @click="findAllUserString">先點我</button>
        2.抓取房源清單<button @click="findAllHouse">再點我</button>
        ) 3.產生假交易<button @click="crossInsertTransactionRecord">最後再點我</button>
        <p>*{{ store.progress }}</p>
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

</script>

<style scoped>
button {
    border: 1px solid black;
}
</style>
