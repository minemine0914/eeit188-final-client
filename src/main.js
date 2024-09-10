// Vue core
import { createApp } from "vue";

// App node
import App from "./App.vue";

// Plugins
import pinia from "./plugins/pinia";
import router from "./router";
import vuetify from "./plugins/vuetify";


import VueApexCharts from "vue3-apexcharts";

// app.use(VueApexCharts);
// The app.use(VueApexCharts) will make <apexchart> component available everywhere.

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(vuetify);

app.mount("#app");
