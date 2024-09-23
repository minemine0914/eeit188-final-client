import wuRouter from "./wu";

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
        {
            path: '/property-management',
            name: 'propertyManagement',
            component: () => import('@/components/lo/PropertyManagement.vue')
        },
        {
            path: '/reviews',
            name: 'reviews',
            component: () => import('@/components/lo/Reviews.vue')
        },
        {
            path: '/reservation-management',
            name: 'reservationManagement',
            component: () => import('@/components/lo/Reservation.vue')
        },
        {
            path: '/order-records',
            name: 'orderRecords',
            component: () => import('@/components/lo/OrderRecord.vue')
        },
        {
            path: '/add-property',
            name: 'AddProperty',
            component: () => import('@/components/lo/AddProperty.vue')
        },
        {
            path: '/edit-property/:id',
            name: 'EditProperty',
            component: () => import('@/components/lo/EditProperty.vue'),
            props: true
        },
        wuRouter,

    ],
};

export default router;
