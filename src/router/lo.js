const router = {
  path: "/lo",
  name: "Lo",
  component: () => import("@/views/HostView.vue"),
  children: [
    {
      path: "",
      name: "lo_propertyManagement",
      component: () => import("@/components/lo/PropertyManagement.vue"),
    },
    {
      path: "reviews",
      name: "lo_reviews",
      component: () => import("@/components/lo/Reviews.vue"),
    },
    // {
    //     path: 'reservation-management',
    //     name: 'reservationManagement',
    //     component: () => import('@/components/lo/Reservation.vue')
    // },
    {
      path: "order-records",
      name: "lo_orderRecords",
      component: () => import("@/components/lo/OrderRecord.vue"),
    },
    {
      path: "check-in",
      name: "lo_CheckIn",
      component: () => import("@/components/lo/CheckIn.vue"),
    },
    {
      path: "reports",
      name: "lo_reports",
      component: () => import("@/components/wu/components/HostReport.vue"),
      meta: { title: "歷史紀錄與報表[房東]", requiresAuth: false },
    },
    {
      path: "add-property",
      name: "lo_addProperty",
      component: () => import("@/components/lo/AddProperty.vue"),
    },
    {
      path: "edit-property/:propertyId",
      name: "lo_editProperty",
      component: () => import("@/components/lo/EditPropertyImage.vue"),
      props: true,
    },
    {
      path: "order-detail/:id",
      name: "lo_orderDetail",
      component: () => import("@/components/lo/OrderDetail.vue"),
      props: true,
    },
  ],
};

export default router;
