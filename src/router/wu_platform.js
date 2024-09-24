const router = {
    path: "/platform-report",
    name: "Wu_platform",
    children: [
        {
            path: "", // Default
            name: "platform-report",
            component: () => import("@/components/wu/components/PlatformReport.vue"),
            meta: { title: "歷史紀錄", requiresAuth: false },
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
            component: () => import("@/components/wu/components/TextTable.vue"),
            meta: { title: "Table", requiresAuth: false },
        },
        {
            path: "tab", // Default
            name: "tab",
            component: () => import("@/components/wu/components/Tab.vue"),
            meta: { title: "Tab", requiresAuth: false },
        },
    ],
}

export default router;
