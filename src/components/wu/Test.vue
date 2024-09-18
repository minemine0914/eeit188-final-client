<template>
    <p>this is a test page, componets are as below</p>
    <div>
        <router-link class="link" to="/wu">Go to Wu</router-link>
        <router-link class="link" :to="{ name: 'host-report' }">Go to Host Report</router-link>
        <router-link class="link" :to="{ name: 'create' }">Go to create</router-link>
        <router-link class="link" :to="{ name: 'table' }">Go to table</router-link>
        <router-link class="link" :to="{ name: 'tab' }">Go to tab</router-link>
    </div>
    <hr>
    <router-view></router-view>
</template>

<script setup>

</script>

<style scoped>
.link {
    margin: 20px;
    padding: 0 5px;
    border: 1px solid black;
    text-decoration: none;
}
</style>
