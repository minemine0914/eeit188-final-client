const router = {
    path: "/kenjo",
    name: "Kenjo",
    component: () => import("@/components/kenjo/Home.vue"),
    children: [
        {
            path: "BookingManagement", // Default
            name: "BookingManagement",
            component: () => import("@/components/kenjo/components/BookingManagement.vue"),
            meta: { title: "BookingManagement", requiresAuth: false },
        },
        {
            path: "UserManagement", // Default
            name: "UserManagement",
            component: () => import("@/components/kenjo/components/UserManagement.vue"),
            meta: { title: "UserManagement", requiresAuth: false },
        },
        {
            path: "UserManagementTest", // Default
            name: "UserManagementTest",
            component: () => import("@/components/kenjo/components/UserManagementTest.vue"),
            meta: { title: "UserManagementTest", requiresAuth: false },
        },
        {
            path: "RoomManagement", // Default
            name: "RoomManagement",
            component: () => import("@/components/kenjo/components/RoomManagement.vue"),
            meta: { title: "RoomManagement", requiresAuth: false },
        },
        {
            path: "PropertyApproval", // Default
            name: "PropertyApproval",
            component: () => import("@/components/kenjo/components/PropertyApproval.vue"),
            meta: { title: "PropertyApproval", requiresAuth: false },
        },
        {
            path: "DataAnalysis", // Default
            name: "DataAnalysis",
            component: () => import("@/components/kenjo/components/DataAnalysis.vue"),
            meta: { title: "DataAnalysis", requiresAuth: false },
        },
        {
            path: "PromotionsandDiscountsManagement", // Default
            name: "PromotionsandDiscountsManagement",
            component: () => import("@/components/kenjo/components/PromotionsandDiscountsManagement.vue"),
            meta: { title: "PromotionsandDiscountsManagement", requiresAuth: false },
        },
        {
            path: "FinancialManagement", // Default
            name: "FinancialManagement",
            component: () => import("@/components/kenjo/components/FinancialManagement.vue"),
            meta: { title: "FinancialManagement", requiresAuth: false },
        },
        {
            path: "SystemSettings", // Default
            name: "SystemSettings",
            component: () => import("@/components/kenjo/components/SystemSettings.vue"),
            meta: { title: "SystemSettings", requiresAuth: false },
        },
        {
            path: "test", // Default
            name: "test",
            component: () => import("@/components/kenjo/components/Test.vue"),
            meta: { title: "Test", requiresAuth: false },
        },
    ],
}

export default router;