// Vue core
import { createApp } from "vue";

// App node
import App from "./App.vue";

// Plugins
import pinia from "./plugins/pinia";
import router from "./router";
import vuetify from "./plugins/vuetify";

// Openlayers
import OpenLayersMap from "./plugins/vue-openlayers";

// Social Network sharing pluglin
import Vue3SocialSharingPlugin from "vue3-social-sharing";

const app = createApp(App);

app.use(Vue3SocialSharingPlugin);
app.use(OpenLayersMap);
app.use(router);
app.use(pinia);
app.use(vuetify);

app.mount("#app");
