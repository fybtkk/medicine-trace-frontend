import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Index.vue')
      },
      {
        path: 'medicine',
        name: 'Medicine',
        component: () => import('@/views/medicine/Index.vue')
      },
      {
        path: 'batch',
        name: 'Batch',
        component: () => import('@/views/batch/Index.vue')
      },
      {
        path: 'flow',
        name: 'Flow',
        component: () => import('@/views/flow/UnifiedFlow.vue')
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/inventory/Index.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/Index.vue')
      },
      {
        path: 'node',
        name: 'Node',
        component: () => import('@/views/node/Index.vue')
      },
      {
        path: 'consumer-purchase',
        name: 'ConsumerPurchase',
        component: () => import('@/views/consumerPurchase/Index.vue')
      },
      {
        path: 'trace',
        name: 'Trace',
        component: () => import('@/views/consumer/Trace.vue')
      }
    ]
  },
  {
    path: '/qr',
    name: 'QrDisplay',
    component: () => import('@/views/consumer/QrDisplay.vue')
  },
  {
    path: '/consumer',
    component: () => import('@/layout/ConsumerLayout.vue'),
    children: [
      {
        path: 'trace',
        name: 'ConsumerTrace',
        component: () => import('@/views/consumer/Trace.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token && to.path !== '/qr' && !to.path.startsWith('/consumer')) {
    next('/login')
  } else {
    next()
  }
})

export default router
