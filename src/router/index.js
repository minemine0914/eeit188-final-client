import { createWebHistory, createRouter } from "vue-router";

const routes = [
    { path: "/", name: "Home", component: () => import("@/views/Home.vue") },
    { path: "/test", name: "Test", component: () => import("@/views/Test.vue") },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFound.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;