// Vue core
import { createApp } from "vue";

// App node
import App from "./App.vue";

// Plugins
import pinia from "./plugins/pinia";
import router from "./router";
import vuetify from "./plugins/vuetify";

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(vuetify);

app.mount("#app");
