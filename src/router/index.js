import { createWebHistory, createRouter } from "vue-router";

// Import your router
import minemineRouter from "./minemine";
import wuRouter from "./wu";
import kenjoRouter from "./kenjo";
import leonRouter from "./leon";
import loRouter from "./lo";
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
        name: "HouseWithId",
        component: () => import("@/pages/home/HouseDetail.vue"),
        meta: { title: "Nomad 房源", requiresAuth: false },
      },
      {
        path: "member",
        name: "Member",
        component: () => import("@/pages/user/MemberPage.vue"),
        meta: { title: "Nomad 會員中心", requiresAuth: false },
      },
      {
        path: "chat",
        name: "Chat",
        component: () => import("@/pages/user/ChatPage.vue"),
        meta: { title: "Nomad 聊天", requiresAuth: false },
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

// router.beforeEach((to, from) => {
//   document.title = to.meta.title || DEFAULT_TITLE;
// });

router.afterEach((to, from) => {
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
