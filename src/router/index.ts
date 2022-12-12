import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/Page/PHome.vue'),
      props: {
        modelUrl: '/models/monica_lubenau/monica_lubenau.gltf',
        elementsToInspect: [
          'top_floor',
          'bottom_floor',
          'roof'
        ]
      }
    }
  ]
})

export default router
