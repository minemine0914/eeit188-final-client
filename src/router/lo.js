const router = {
    path: "/lo",
    name: "Lo",
    component: () => import("@/components/lo/HostHome.vue"),
    children: [
        {
            path: "", // Default
            name: "Lo_Home",
            component: () => import("@/components/lo/HostHome.vue"),
            meta: { title: "LO Home", requiresAuth: false },
        },
    ],
}

export default router;