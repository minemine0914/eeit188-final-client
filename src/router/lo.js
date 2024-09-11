const router = {
    path: "/lo",
    name: "Lo",
    component: () => import("@/components/lo/HostHome.vue"),
    children: [
        {
            path: "register-host",
            name: "HostBasicInfo",
            component: () => import("@/components/lo/HostBasicInfo.vue"),
        },
        {
            path: "register-property",
            name: "HostProperty",
            component: () => import("@/components/lo/HostProperty.vue"),
            props: true, // 接收來自 HostBasicInfo 的資料
        },
    ],
};

export default router;
