const router = {
    path: "/minemine",
    name: "MineMine",
    component: () => import("@/components/minemine/Home.vue"),
    children: [
        {
            path: "test", // Default
            name: "MineMineHome",
            component: () => import("@/components/minemine/components/Test.vue"),
            meta: { title: "Minemine Testing", requiresAuth: false },
        },
    ],
}

export default router;