const router = {
    path: "/lo",
    name: "Lo",
    component: () => import("@/components/lo/HostHome.vue"),
    children: [
        {
            path: "order-detail/:id",
            name: "OrderDetail",
            component: () => import("@/components/lo/OrderDetail.vue"),
            props: true,
        },
    ],
};

export default router;
