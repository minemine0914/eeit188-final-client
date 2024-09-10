const router = {
    path: "/kenjo",
    name: "Kenjo",
    component: () => import("@/components/kenjo/Home.vue"),
    children: [
        {
            path: "test", // Default
            name: "KenjoHome",
            component: () => import("@/components/kenjo/components/Test.vue"),
            meta: { title: "Kenjo Testing", requiresAuth: false },
        },
    ],
}

export default router;