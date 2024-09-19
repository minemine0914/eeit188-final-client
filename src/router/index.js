import { createWebHistory, createRouter, useRouter } from "vue-router";

// Import your router
import minemineRouter from "./minemine";
import wuRouter from "./wu";
import kenjoRouter from "./kenjo";
import leonRouter from "./leon";
import loRouter from "./lo";

// Use Store
import { useUserStore } from "../stores/userStore";
import { storeToRefs } from "pinia";

const DEFAULT_TITLE = "Nomad";

const routes = [
    {
        path: "/",
        name: "User",
        component: () => import("@/views/UserView.vue"),
        children: [
            {
                path: "", // Default
                name: "Explore",
                component: () => import("@/pages/home/Explore.vue"),
                meta: { title: "Nomad 探索", requiresAuth: false },
            },
            {
                path: "search",
                name: "Search",
                component: () => import("@/pages/home/Search.vue"),
                meta: { title: "Nomad 搜尋", requiresAuth: false },
            },
            {
                path: "house",
                name: "House",
                component: () => import("@/pages/home/HouseDetail.vue"),
                meta: { title: "Nomad 房源", requiresAuth: false },
            },
            {
                path: "house/:houseId",
                name: "HouseWithHouseId",
                component: () => import("@/pages/home/HouseDetail.vue"),
                meta: { title: "Nomad 房源", requiresAuth: false },
            },
            {
                path: "booking/:houseId",
                name: "BookingWithHouseId",
                component: () => import("@/pages/home/Booking.vue"),
                meta: { title: "Nomad 預定您的房源", requiresAuth: true },
            },
            {
                path: "member",
                name: "Member",
                component: () => import("@/pages/user/MemberPage.vue"),
                meta: { title: "Nomad 會員中心", requiresAuth: true },
            },
            {
                path: "chat",
                name: "Chat",
                component: () => import("@/pages/user/ChatPage.vue"),
                meta: { title: "Nomad 聊天", requiresAuth: true },
            },
            {
                path: "login",
                name: "Login",
                component: () => import("@/pages/user/LoginPage.vue"),
                meta: { title: "Nomad 登入", requiresAuth: false },
            },
            {
                path: "signup",
                name: "Signup",
                component: () => import("@/pages/user/SignupPage.vue"),
                meta: { title: "Nomad 註冊", requiresAuth: false },
            },
            {
                path: "forgot-password",
                name: "ForgotPassword",
                component: () => import("@/pages/user/ForgotPasswordPage.vue"),
                meta: { title: "Nomad 忘記密碼", requiresAuth: false },
            },
            {
                path: "reset-password",
                name: "ResetPassword",
                component: () => import("@/pages/user/ResetPasswordFromEmailLinkPage.vue"),
                meta: { title: "Nomad 重設密碼", requiresAuth: false },
            },
        ],
    },
    {
        path: "/host",
        name: "Host",
        component: () => import("@/views/HostView.vue"),
        children: [
            {
                path: "", // Default
                name: "Manage",
                component: () => import("@/pages/host/Manage.vue"),
                meta: { title: "Nomad 分享你的房源", requiresAuth: false },
            },
        ],
    },
    {
        path: "/system",
        name: "System",
        component: () => import("@/views/SystemView.vue"),
        children: [
            {
                path: "", // Default
                name: "Dashboard",
                component: () => import("@/pages/system/Dashboard.vue"),
                meta: { title: "Nomad 系統管理", requiresAuth: false },
            },
            {
                path: "admin",
                name: "Admin",
                component: () => import("@/pages/system/AdminPage.vue"),
                meta: { title: "Nomad 管理中心", requiresAuth: false },
            },
            {
                path: "login",
                name: "SystemLogin",
                component: () => import("@/pages/system/AdminLoginPage.vue"),
                meta: { title: "Nomad 系統管理登入", requiresAuth: false },
            },
            {
                path: "createAdmin",
                name: "CreateAdmin",
                component: () => import("@/pages/system/CreateAdminPage.vue"),
                meta: { title: "Nomad 系統管理註冊", requiresAuth: false },
            },
            {
                path: "forgot-password",
                name: "AdminForgotPassword",
                component: () => import("@/pages/system/AdminForgotPasswordPage.vue"),
                meta: { title: "Nomad 系統管理忘記密碼", requiresAuth: false },
            },
            {
                path: "/system/reset-password",
                name: "AdminResetPassword",
                component: () => import("@/pages/system/AdminResetPasswordFromEmailLinkPage.vue"),
                meta: { title: "Nomad 系統管理重設密碼", requiresAuth: false },
            },
            {
                path: "admin-chat",
                name: "AdminChat",
                component: () => import("@/pages/system/AdminChatPage.vue"),
                meta: { title: "Nomad 聊天", requiresAuth: false },
            },
        ],
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: () => import("@/views/NotFound.vue"),
    },
    minemineRouter,
    wuRouter,
    kenjoRouter,
    leonRouter,
    loRouter,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    const {jwtToken, user} = storeToRefs(userStore);
    if (to.meta.requiresAuth && jwtToken.value == null && user.value != null) {
        console.log("[Router beforeach] Youare not login, take you to login page...");
        next("/login");
    } else {
        console.log("[Router beforeach] Check success");
        next();
    }
});

router.afterEach((to, from) => {
    document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
