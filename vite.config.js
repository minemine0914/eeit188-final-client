import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            styles: {
                configFile: "src/styles/settings.scss",
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    css: {
        preprocessorOptions: {
            sass: {
                api: "modern-compiler", // Use the modern Sass compiler
            },
        },
    },
    optimizeDeps: {
        noDiscovery: true,
        include: ["geotiff", "lodash/isEqual", "@vueuse/integrations/useQRCode", "qrcode"],
    },
    cacheDir: "node_modules/.vite_cache", // Use a cache directory to persist dependency optimization
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: function (id) {
                    if (id.includes("node_modules")) {
                        return id.toString().split("node_modules/")[1].split("/")[0];
                    }
                },
            },
        },
    },
});
