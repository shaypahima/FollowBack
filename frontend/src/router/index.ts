import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Profiles',
      component: () => import('@/views/ProfilesView.vue')
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('@/views/UploadView.vue')
    }
  ],
})

export default router
