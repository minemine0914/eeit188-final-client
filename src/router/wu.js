const router = {
    path: "/wu",
    name: "Wu",
    component: () => import("@/components/wu/Test.vue"),
    children: [
        {
            path: "", // Default
            name: "WuHome",
            component: () => import("@/components/wu/components/HostReport.vue"),
            meta: { title: "Wu Testing", requiresAuth: false },
        },
        // {
        //     path: "/wu/time", // Default
        //     name: "t",
        //     component: () => import("@/components/wu/components/EmptyTemplate.vue"),
        //     meta: { title: "Wu Testing", requiresAuth: false },
        // },
        // {
        //     path: "/wu/user-analysis", // Default
        //     name: "ua",
        //     component: () => import("@/components/wu/components/UserAnalysis.vue"),
        //     meta: { title: "Wu Testing", requiresAuth: false },
        // },
        // {
        //     path: "/wu/income", // Default
        //     name: "i",
        //     component: () => import("@/components/wu/components/HouseIncome.vue"),
        //     meta: { title: "Wu Testing", requiresAuth: false },
        // },
        {
            path: "host-report", // Default
            name: "host-report",
            component: () => import("@/components/wu/components/HostReport.vue"),
            meta: { title: "歷史紀錄與報表[房東]", requiresAuth: false },
        },
        {
            path: "create", // Default
            name: "create",
            component: () => import("@/components/wu/components/CreateTransactionRecord.vue"),
            meta: { title: "交易紀錄產生器", requiresAuth: false },
        },
        {
            path: "table", // Default
            name: "table",
            component: () => import("@/components/wu/components/Table.vue"),
            meta: { title: "Table", requiresAuth: false },
        },
    ],
}

export default router;
