import { createWebHistory, createRouter } from "vue-router";

// Import your router
import minemineRouter from "./minemine";
import wuRouter from "./wu";
import kenjoRouter from "./kenjo";
import leonRouter from "./leon";
import loRouter from "./lo";
const DEFAULT_TITLE = "Nomad";

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
                meta: { title: "Nomad 探索", requiresAuth: false },
            },
            {
                path: "search",
                name: "UserSearch",
                component: () => import("@/components/user/Search.vue"),
                meta: { title: "Nomad 搜尋", requiresAuth: false },
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
                component: () => import("@/components/lo/HostHome.vue"),
                meta: { title: "Nomad 分享你的房源", requiresAuth: false },
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
                meta: { title: "Nomad 系統管理", requiresAuth: false },
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue"),
    },
    minemineRouter,
    wuRouter,
    kenjoRouter,
    leonRouter,
    loRouter,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.afterEach((to, from) => {
    document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
