

const router = {
    path: "",
    name: "kenjo",
    component: () => import("@/components/kenjo/Home.vue"),
    children: [
        {
            path: "BookingManagement",
            name: "BookingManagement",
            component: () => import("@/components/kenjo/components/BookingManagement.vue"),
            
        },
        {
            path: "UserManagement", 
            name: "UserManagement",
            component: () => import("@/components/kenjo/components/UserManagement.vue"),
            meta: { title: "UserManagement", requiresAuth: false },
        },
        {
            path: "RoomManagement", 
            name: "RoomManagement",
            component: () => import("@/components/kenjo/components/RoomManagement.vue"),
            meta: { title: "RoomManagement", requiresAuth: false },
        },
        {
            path: "PropertyApproval", 
            name: "PropertyApproval",
            component: () => import("@/components/kenjo/components/PropertyApproval.vue"),
            meta: { title: "PropertyApproval", requiresAuth: false },
        },
        {
            path: "DataAnalysis", 
            name: "DataAnalysis",
            component: () => import("@/components/kenjo/components/DataAnalysis.vue"),
            meta: { title: "DataAnalysis", requiresAuth: false },
        },
        {
            path: "PromotionsandDiscountsManagement", 
            name: "PromotionsandDiscountsManagement",
            component: () => import("@/components/kenjo/components/PromotionsandDiscountsManagement.vue"),
            meta: { title: "PromotionsandDiscountsManagement", requiresAuth: false },
        },
        {
            path: "FinancialManagement", 
            name: "FinancialManagement",
            component: () => import("@/components/kenjo/components/FinancialManagement.vue"),
            meta: { title: "FinancialManagement", requiresAuth: false },
        },
        {
            path: "SystemSettings", 
            name: "SystemSettings",
            component: () => import("@/components/kenjo/components/SystemSettings.vue"),
            meta: { title: "SystemSettings", requiresAuth: false },
        },
        {
            path: "test", 
            name: "test",
            component: () => import("@/components/kenjo/components/Test.vue"),
            meta: { title: "Test", requiresAuth: false },
        },
    ],
}

export default router;