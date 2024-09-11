const router = {
    path: "/wu",
    name: "Wu",
    component: () => import("@/components/wu/test.vue"),
    children: [
        {
            path: "/aaa", // Default
            name: "WuHome",
            component: () => import("@/components/wu/components/EmptyTemplate.vue"),
            meta: { title: "Wu Testing", requiresAuth: false },
        },
    ],
}

export default router;