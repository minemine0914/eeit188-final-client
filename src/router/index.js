import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: "/",
        name: "User",
        component: () => import("@/views/UserView.vue"),
        children: [
            {
                path: "", // Default
                name: "UserExplore",
                component: () => import("@/components/user/Explore.vue"),
            },
            {
                path: "search",
                name: "UserSearch",
                component: () => import("@/components/user/Search.vue"),
            },
        ],
    },
    {
        path: "/host",
        name: "Host",
        component: () => import("@/views/HostView.vue"),
        children: [
            {
                path: "", // Default
                name: "Manage",
                component: () => import("@/components/host/Manage.vue"),
            },
        ],
    },
    {
        path: "/system",
        name: "System",
        component: () => import("@/views/SystemView.vue"),
        children: [
            {
                path: "", // Default
                name: "Dashboard",
                component: () => import("@/components/system/Dashboard.vue"),
            },
        ],
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: () => import("@/views/NotFound.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
