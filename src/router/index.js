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
    // 동적 경로 매칭 — :cityId 파라미터를 상세 페이지가 수신한다
    {
      path: '/weather/:cityId',
      name: 'weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
  ],
})

export default router
