const router = {
    path: '/lo',
    name: 'Lo',
    component: () => import('@/pages/user/MemberPage.vue'), // 父級頁面
    children: [
        {
            path: '',
            name: 'hostHome',
            component: () => import('@/components/lo/PropertyManagement.vue')
        },
        {
            path: 'order-detail/:id',
            name: 'orderDetail',
            component: () => import('@/components/lo/OrderDetail.vue'),
            props: true
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
            path: 'add-property',
            name: 'addProperty',
            component: () => import('@/components/lo/AddProperty.vue')
        },
        {
            path: 'edit-property/:id',
            name: 'editProperty',
            component: () => import('@/components/lo/EditProperty.vue'),
            props: true
        }
    ]
};

export default router;
