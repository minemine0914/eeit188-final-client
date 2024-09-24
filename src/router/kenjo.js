

const router = {
    path: "",
    name: "kenjo",
    component: () => import("@/components/kenjo/Home.vue"),
    children: [
        {
            path: "BookingManagement",
            name: "BookingManagement",
            component: () => import("@/components/kenjo/components/BookingManagement.vue"),
            meta: { title: "BookingManagement", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "UserManagement", 
            name: "UserManagement",
            component: () => import("@/components/kenjo/components/UserManagement.vue"),
            meta: { title: "UserManagement", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "RoomManagement", 
            name: "RoomManagement",
            component: () => import("@/components/kenjo/components/RoomManagement.vue"),
            meta: { title: "RoomManagement", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "PropertyApproval", 
            name: "PropertyApproval",
            component: () => import("@/components/kenjo/components/PropertyApproval.vue"),
            meta: { title: "PropertyApproval", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "DataAnalysis", 
            name: "DataAnalysis",
            component: () => import("@/components/kenjo/components/DataAnalysis.vue"),
            meta: { title: "DataAnalysis", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "PromotionsandDiscountsManagement", 
            name: "PromotionsandDiscountsManagement",
            component: () => import("@/components/kenjo/components/PromotionsandDiscountsManagement.vue"),
            meta: { title: "PromotionsandDiscountsManagement", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "FinancialManagement", 
            name: "FinancialManagement",
            component: () => import("@/components/kenjo/components/FinancialManagement.vue"),
            meta: { title: "FinancialManagement", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "SystemSettings", 
            name: "SystemSettings",
            component: () => import("@/components/kenjo/components/SystemSettings.vue"),
            meta: { title: "SystemSettings", requiresAuth: true , requiresAdmin: true},
        },
        {
            path: "PlatformReport", 
            name: "PlatformReport",
            component: () => import("@/components/wu/components/PlatformReport.vue"),
            meta: { title: "Test", requiresAuth: true , requiresAdmin: true},
        },
    ],
}

export default router;