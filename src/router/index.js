import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '@/views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 뒤로가기로 돌아오면 떠났던 스크롤 위치를 그대로 복원한다.
  // 아카이브 04에서 데모를 눌러 다녀와도 그 자리로 되돌아온다.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
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
    // 아카이브 데모 경로 — 아카이브(/lessons) 아래로 깊어지는 뎁스를 URL로 표현한다.
    // /lessons → /lessons/home → /lessons/weather/city_01 처럼 공통 프리픽스가 이어진다
    {
      path: '/lessons/home',
      name: 'lessons-home',
      component: WeatherHomeView,
    },
    {
      path: '/lessons/weather/:cityId',
      name: 'lessons-weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/WeatherAboutView.vue'),
    },
    // Catch-all Route — 위 규칙에 걸리지 않는 모든 경로는 404 페이지로
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
