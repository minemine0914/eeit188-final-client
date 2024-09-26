import wuRouter from "./wu_host";

const router = {
    path: '/lo',
    name: 'Lo',
    component: () => import("@/views/HostView.vue"),
    children: [
        {
            path: '',
            name: 'propertyManagement',
            component: () => import('@/components/lo/PropertyManagement.vue')
        },
        {
            path: 'property-management',
            name: 'propertyManagement',
            component: () => import('@/components/lo/PropertyManagement.vue')
        },
        {
            path: 'reviews',
            name: 'reviews',
            component: () => import('@/components/lo/Reviews.vue')
        },
        {
            path: 'reservation-management',
            name: 'reservationManagement',
            component: () => import('@/components/lo/Reservation.vue')
        },
        {
            path: 'order-records',
            name: 'orderRecords',
            component: () => import('@/components/lo/OrderRecord.vue')
        },
        {
            path: 'reports',
            name: 'reports',
            component: () => import('@/components/lo/Reports.vue')
        },
        {
            path: 'add-property',
            name: 'addProperty',
            component: () => import('@/components/lo/AddProperty.vue')
        },
        {
            path: 'edit-property/:id',
            name: 'editProperty',
            component: () => import('@/components/lo/EditProperty.vue'),
            props: true
        },
        {
            path: 'order-detail/:id',
            name: 'orderDetail',
            component: () => import('@/components/lo/OrderDetail.vue'),
            props: true
        },
        // wuRouter,
    ],
};

export default router;
