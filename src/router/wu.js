const router = {
    path: "/wu",
    name: "Wu",
    component: () => import("@/components/wu/Test.vue"),
    children: [
        {
            path: "/aaa", // Default
            name: "WuHome",
            component: () => import("@/components/wu/components/EmptyTemplate.vue"),
            meta: { title: "Wu Testing", requiresAuth: false },
        }, {
            path: "/wu/time", // Default
            name: "t",
            component: () => import("@/components/wu/components/EmptyTemplate.vue"),
            meta: { title: "Wu Testing", requiresAuth: false },
        }, {
            path: "/wu/user-analysis", // Default
            name: "ua",
            component: () => import("@/components/wu/components/UserAnalysis.vue"),
            meta: { title: "Wu Testing", requiresAuth: false },
        }, {
            path: "/wu/income", // Default
            name: "i",
            component: () => import("@/components/wu/components/HouseIncome.vue"),
            meta: { title: "Wu Testing", requiresAuth: false },
        }
    ],
}

export default router;
