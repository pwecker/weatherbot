import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/Home.vue')
    },
    {
      path: '/:404(.*)*',
      name: '404',
      component: () => import('@/components/404.vue')
    }
  ],
})

export default router
