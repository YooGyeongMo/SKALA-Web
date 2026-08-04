import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '@/views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 첫 화면(홈)은 즉시 로딩한다
    { path: '/', name: 'home', component: WeatherHomeView },
    // 나머지 페이지는 방문하는 시점에 코드가 로딩되도록 Lazy Loading 처리
    {
      path: '/lessons',
      name: 'lessons',
      component: () => import('@/views/PracticeLabView.vue'),
    },
  ],
})

export default router
