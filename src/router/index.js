import { createRouter, createWebHistory } from 'vue-router'
import CountryHomeView from '@/views/CountryHomeView.vue'
import WeatherHomeView from '@/views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 뒤로가기로 돌아오면 떠났던 스크롤 위치를 그대로 복원한다.
  // 아카이브 04에서 데모를 눌러 다녀와도 그 자리로 되돌아온다.
  scrollBehavior(to, from, savedPosition) {
    // 소개 안에서 탭만 바꿀 때는 보던 자리를 그대로 둔다
    if (to.path.startsWith('/about') && from.path.startsWith('/about')) return false
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    // 첫 화면(홈)은 나라 선택 대시보드 — 즉시 로딩한다
    { path: '/', name: 'home', component: CountryHomeView },
    // 접근성 홈 — 모션과 깜빡임 없이 같은 데이터를 제공한다
    {
      path: '/accessible',
      name: 'accessible-home',
      component: () => import('@/views/AccessibleHomeView.vue'),
    },
    // 나라별 대표 도시 10곳 목록
    {
      path: '/country/:countryCode',
      name: 'country-cities',
      component: () => import('@/views/CityListView.vue'),
    },
    // 접근성 홈 동선 — 같은 화면이지만 /accessible 아래로 깊어지는 뎁스를 URL로 표현한다.
    // 내비게이션이 현재 위치를 홈 2로 계속 가리킬 수 있다
    {
      path: '/accessible/country/:countryCode',
      name: 'accessible-country-cities',
      component: () => import('@/views/CityListView.vue'),
    },
    {
      path: '/accessible/weather/:cityId',
      name: 'accessible-weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
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
    // 05 스토어 데모 경로 — Day별로 자기 프리픽스를 갖고 깊어진다
    // /lessons → /lessons/store/home → /lessons/store/weather/city_01
    {
      path: '/lessons/store/home',
      name: 'lessons-store-home',
      component: WeatherHomeView,
    },
    {
      path: '/lessons/store/weather/:cityId',
      name: 'lessons-store-weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    // 06 Axios 데모 경로
    {
      path: '/lessons/api/home',
      name: 'lessons-api-home',
      component: WeatherHomeView,
    },
    {
      path: '/lessons/api/weather/:cityId',
      name: 'lessons-api-weather-detail',
      component: () => import('@/views/WeatherDetailView.vue'),
    },
    // 소개 — 부모는 히어로와 탭 레이아웃, 자식이 탭 내용을 채우는 중첩 라우트
    {
      path: '/about',
      component: () => import('@/views/WeatherAboutView.vue'),
      children: [
        {
          path: '',
          name: 'about',
          component: () => import('@/views/AboutIntroView.vue'),
        },
        {
          path: 'philosophy',
          name: 'about-philosophy',
          component: () => import('@/views/AboutPhilosophyView.vue'),
        },
      ],
    },
    // 트러블슈팅 게시판 — 실습 중 만난 문제와 해결 기록
    {
      path: '/troubleshooting',
      name: 'troubleshooting',
      component: () => import('@/views/TroubleshootingView.vue'),
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
