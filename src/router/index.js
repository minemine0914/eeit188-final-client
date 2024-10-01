import { createWebHistory, createRouter, useRouter } from "vue-router";

// Import your router
import minemineRouter from "./minemine";
import wuRouter_host from "./wu_host";
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
    meta: { title: "Nomad 探索", requiresAuth: false, role: "normal" },
    children: [
      {
        path: "", // Default
        name: "Explore",
        component: () => import("@/pages/home/Explore.vue"),
      },
      {
        path: "search",
        name: "Search",
        component: () => import("@/pages/home/Search.vue"),
        meta: { title: "Nomad 搜尋", requiresAuth: false, role: "normal" },
      },
      {
        path: "search-map",
        name: "SearchMap",
        component: () => import("@/pages/home/SearchMap.vue"),
        meta: { title: "Nomad 地圖搜尋", requiresAuth: false, role: "normal" },
      },
      {
        path: "house",
        name: "House",
        component: () => import("@/pages/home/HouseDetail.vue"),
        meta: { title: "Nomad 房源", requiresAuth: false, role: "normal" },
      },
      {
        path: "house/:houseId",
        name: "HouseWithHouseId",
        component: () => import("@/pages/home/HouseDetail.vue"),
        meta: { title: "Nomad 房源", requiresAuth: false, role: "normal" },
      },
      {
        path: "booking/:houseId",
        name: "BookingWithHouseId",
        component: () => import("@/pages/home/Booking.vue"),
        meta: {
          title: "Nomad 預定您的房源",
          requiresAuth: true,
          role: "normal",
        },
      },
      {
        path: "member",
        name: "Member",
        component: () => import("@/pages/user/MemberPage.vue"),
        meta: { title: "Nomad 會員中心", requiresAuth: true, role: "normal" },
      },
      {
        path: "order",
        name: "UserOrder",
        component: () => import("@/pages/user/OrderPage.vue"),
        meta: { title: "Nomad 會員中心", requiresAuth: true, role: "normal" },
      },
      {
        path: "chat",
        name: "Chat",
        component: () => import("@/pages/user/ChatPage.vue"),
        meta: { title: "Nomad 聊天", requiresAuth: true, role: "normal" },
      },
      {
        path: "login",
        name: "Login",
        component: () => import("@/pages/user/LoginPage.vue"),
        meta: { title: "Nomad 登入", requiresAuth: false, role: "normal" },
      },
      {
        path: "signup",
        name: "Signup",
        component: () => import("@/pages/user/SignupPage.vue"),
        meta: { title: "Nomad 註冊", requiresAuth: false, role: "normal" },
      },
      {
        path: "forgot-password",
        name: "ForgotPassword",
        component: () => import("@/pages/user/ForgotPasswordPage.vue"),
        meta: { title: "Nomad 忘記密碼", requiresAuth: false, role: "normal" },
      },
      {
        path: "reset-password",
        name: "ResetPassword",
        component: () =>
          import("@/pages/user/ResetPasswordFromEmailLinkPage.vue"),
        meta: { title: "Nomad 重設密碼", requiresAuth: false, role: "normal" },
      },
    ],
  },
  {
    path: "/host",
    name: "Host",
    component: () => import("@/views/HostView.vue"),
    children: [
      {
        path: "",
        name: "propertyManagement",
        component: () => import("@/components/lo/PropertyManagement.vue"),
      },
      {
        path: "reviews",
        name: "reviews",
        component: () => import("@/components/lo/Reviews.vue"),
      },
      {
        path: "reservation-management",
        name: "reservationManagement",
        component: () => import("@/components/lo/Reservation.vue"),
      },
      {
        path: "order-records",
        name: "orderRecords",
        component: () => import("@/components/lo/OrderRecord.vue"),
      },
      // {
      //   path: "reports",
      //   name: "reports",
      //   component: () => import("@/components/lo/Reports.vue"),
      // },
      {
        path: "add-property",
        name: "addProperty",
        component: () => import("@/components/lo/AddProperty.vue"),
      },
      {
        path: "edit-property/:propertyId",
        name: "editProperty",
        component: () => import("@/components/lo/EditPropertyImage.vue"),
        props: true,
      },
      {
        path: "order-detail/:id",
        name: "orderDetail",
        component: () => import("@/components/lo/OrderDetail.vue"),
        props: true,
      },
      // wuRouter_host,
    ],
  },
  {
    path: "/system",
    name: "System",
    component: () => import("@/views/SystemView.vue"),
    meta: { title: "Nomad 系統管理", requiresAuth: true, role: "admin" },
    children: [
      kenjoRouter,
      {
        path: "", // Default
        name: "Dashboard",
        component: () => import("@/pages/system/Dashboard.vue"),
      },
      {
        path: "admin",
        name: "Admin",
        component: () => import("@/pages/system/AdminPage.vue"),
        meta: { title: "Nomad 管理中心", requiresAuth: true, role: "admin" },
      },
      {
        path: "login",
        name: "SystemLogin",
        component: () => import("@/pages/system/AdminLoginPage.vue"),
        meta: {
          title: "Nomad 系統管理登入",
          requiresAuth: false,
          role: "admin",
        },
      },
      {
        path: "createAdmin",
        name: "CreateAdmin",
        component: () => import("@/pages/system/CreateAdminPage.vue"),
        meta: {
          title: "Nomad 系統管理註冊",
          requiresAuth: false,
          role: "admin",
        },
      },
      {
        path: "forgot-password",
        name: "AdminForgotPassword",
        component: () => import("@/pages/system/AdminForgotPasswordPage.vue"),
        meta: {
          title: "Nomad 系統管理忘記密碼",
          requiresAuth: false,
          role: "admin",
        },
      },
      {
        path: "/system/reset-password",
        name: "AdminResetPassword",
        component: () =>
          import("@/pages/system/AdminResetPasswordFromEmailLinkPage.vue"),
        meta: {
          title: "Nomad 系統管理重設密碼",
          requiresAuth: false,
          role: "admin",
        },
      },
      {
        path: "admin-chat",
        name: "AdminChat",
        component: () => import("@/pages/system/AdminChatPage.vue"),
        meta: { title: "Nomad 聊天", requiresAuth: true, role: "admin" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
  minemineRouter,
  // wuRouter_host,
  leonRouter,
  loRouter,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const { jwtToken, user } = storeToRefs(userStore);
  console.log(
    "[Router beforeEach] path=" + to.path,
    " requiresAuth=",
    to.meta.requiresAuth
  );
  // 如果用戶已經登入，並且嘗試訪問 /login 或 /system/login，重定向到首頁
  if (
    jwtToken.value != null &&
    user.value &&
    (to.path === "/login" || to.path === "/system/login")
  ) {
    console.log("[Router beforeEach] 已登入，重定向至首頁...");
    next("/");
  } else if (to.meta.requiresAuth) {
    // 檢查使用者是否已登入
    if (jwtToken.value == null) {
      console.log("[Router beforeEach] 你尚未登入，進行重定向...");
      // 保存當前嘗試訪問的路由，並重定向到登入頁面
      const redirectPath = to.fullPath;
      // 根據路徑決定重定向到哪個登入頁面
      if (to.path.startsWith("/system")) {
        console.log("[Router beforeEach] 重定向到 /system/login");
        next({
          path: "/system/login",
          query: { redirect: redirectPath },
        }); // 未登入用戶訪問 /system 時，重定向到 /system/login
      } else {
        console.log("[Router beforeEach] 重定向到 /login");
        next({
          path: "/login",
          query: { redirect: redirectPath },
        }); // 其他情況下重定向到 /login
      }
    } else {
      console.log("[Router beforeEach] 驗證成功");

      // 檢查是否有角色限制，並確認角色是否符合
      if (to.meta.role && user.value) {
        if (to.meta.role === "admin" && user.value.role !== "admin") {
          if (to.path.startsWith("/system")) {
            console.log(
              "[Router beforeEach] 訪問拒絕：此頁面僅限管理員訪問，重定向至 /system/login"
            );
            next("/system/login");
          } else {
            console.log("[Router beforeEach] 訪問拒絕：此頁面僅限管理員訪問");
            next("/"); // 將非管理員重定向至首頁
          }
        } else if (to.meta.role === "normal" && user.value.role !== "normal") {
          console.log("[Router beforeEach] 訪問拒絕：此頁面僅限普通用戶訪問");
          next("/"); // 將非普通用戶重定向至首頁
        } else {
          next(); // 若角色符合，繼續導航
        }
      } else {
        next(); // 若沒有角色要求，繼續導航
      }
    }
  } else {
    next(); // 若不需要登入，直接繼續導航
  }
});

router.afterEach((to, from) => {
  document.title = to.meta.title || DEFAULT_TITLE;
});

export default router;
