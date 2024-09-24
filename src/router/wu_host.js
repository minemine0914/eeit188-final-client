const router = {
    path: "/wu",
    name: "Wu",
    children: [
        {
            path: "/host-report",
            name: "host-report",
            component: () => import("@/components/wu/components/HostReport.vue"),
            meta: { title: "歷史紀錄與報表[房東]", requiresAuth: false },
        },
    ],
}

export default router;
