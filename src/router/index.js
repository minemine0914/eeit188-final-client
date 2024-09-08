import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        name: "User",
        component: () => import("@/views/User.vue"),
        children: [
            {
                path: "",
                name: "Explore",
                component: () => import("@/components/user/Explore.vue"),
            },
        ],
    },
    {
        path: "/host",
        name: "Host",
        component: () => import("@/views/Host.vue"),
        children: [
            {
                path: "",
                name: "Manage",
                component: () => import("@/components/host/Manage.vue"),
            },
        ],
    },
    {
        path: "/system",
        name: "System",
        component: () => import("@/views/System.vue"),
        children: [
            {
                path: "",
                name: "Dashboard",
                component: () => import("@/components/system/Dashboard.vue"),
            },
        ],
    },
    { path: "/test", name: "Test", component: () => import("@/views/Test.vue") },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFound.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
