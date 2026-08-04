<script setup>
// App은 내비게이션 바(RouterLink)와 메인 콘텐츠 영역(RouterView)만 담당한다.
// 실제 페이지 내용은 views/ 아래 페이지 컴포넌트가 맡는다.
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from '@/components/weather/UnitToggler.vue'

// 실습이 Day 단위로 계속 늘어나므로 내비에는 기간을 표기하지 않는다
const links = [
  { to: '/', label: '홈' },
  { to: '/about', label: '소개' },
  { to: '/lessons', label: '실습 아카이브' },
]

const route = useRoute()
const linkEls = ref([])

// 현재 경로에 해당하는 링크 밑으로 미끄러져 이동하는 선 인디케이터
const indicator = ref({ left: 0, width: 0, opacity: 0 })

const setLinkEl = (el, index) => {
  // RouterLink는 컴포넌트라 실제 DOM은 $el에서 꺼낸다
  if (el) linkEls.value[index] = el.$el ?? el
}

const moveIndicator = async () => {
  await nextTick()
  const activeIndex = links.findIndex((link) => link.to === route.path)
  const el = linkEls.value[activeIndex]

  // 내비 항목이 없는 경로(상세 페이지, 404 등)에서는 부드럽게 사라진다
  if (!el) {
    indicator.value = { ...indicator.value, opacity: 0 }
    return
  }
  indicator.value = { left: el.offsetLeft, width: el.offsetWidth, opacity: 1 }
}

// 기본은 풀폭 헤더, 스크롤을 내리면 둥근 리퀴드 필로 변형된다
const isScrolled = ref(false)

const onScroll = () => {
  isScrolled.value = window.scrollY > 60
}

// 형태가 바뀌면 링크 위치도 바뀌므로, 변형이 끝난 뒤 인디케이터를 다시 잰다
watch(isScrolled, () => {
  setTimeout(moveIndicator, 380)
})

watch(() => route.path, moveIndicator)

onMounted(() => {
  moveIndicator()
  onScroll()
  window.addEventListener('resize', moveIndicator)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', moveIndicator)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="app">
    <header class="nav-wrap">
      <div class="global-nav" :class="{ scrolled: isScrolled }">
        <RouterLink to="/" class="brand">SKALA WEATHER</RouterLink>

        <div class="nav-right">
          <nav class="nav-links">
          <RouterLink
            v-for="(link, i) in links"
            :key="link.to"
            :ref="(el) => setLinkEl(el, i)"
            :to="link.to"
          >
            {{ link.label }}
          </RouterLink>

            <!-- 활성 링크를 따라 미끄러지는 선 -->
            <span
              class="nav-indicator"
              :style="{
                left: indicator.left + 'px',
                width: indicator.width + 'px',
                opacity: indicator.opacity,
              }"
            ></span>
          </nav>

          <!-- 전역 스토어와 연결된 온도 단위 토글 -->
          <UnitToggler />
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
.nav-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
}

/* 기본 상태: 풀폭 헤더 — 배경은 투명하게 두고 하단에 가는 잉크 선 하나만 남긴다.
   배경색을 깔면 그라데이션과 색이 달라 띠처럼 분리되어 보인다 */
.global-nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1600px;
  margin-top: 0;
  padding: 18px 32px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 0;
  box-shadow: none;
  transition:
    max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    margin-top 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.35s ease,
    background 0.35s ease,
    box-shadow 0.35s ease;
}

/* 하단 잉크 선 — 첫 진입 때 중앙에서 양쪽으로 그어진다 */
.global-nav::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--line-strong);
  transform-origin: center;
  animation: line-draw 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s backwards;
  transition: opacity 0.35s ease;
}

.global-nav.scrolled::after {
  opacity: 0;
}

@keyframes line-draw {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* 스크롤 상태: 가장자리가 둥글게 말리며 리퀴드 글래스 필로 */
.global-nav.scrolled {
  max-width: 640px;
  margin-top: 12px;
  padding: 11px 26px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-color: rgba(17, 17, 17, 0.08);
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(17, 17, 17, 0.08);
}

/* 첫 진입 순차 등장 — 선(0.15s) → 브랜드(0.55s) → 링크들(0.75s~) → 토글 → 본문 */
.brand {
  animation: rise-in 0.5s ease 0.55s backwards;
}

.nav-links a {
  animation: rise-in 0.45s ease backwards;
}

.nav-links a:nth-child(1) {
  animation-delay: 0.75s;
}

.nav-links a:nth-child(2) {
  animation-delay: 0.85s;
}

.nav-links a:nth-child(3) {
  animation-delay: 0.95s;
}

.nav-right :deep(.unit-toggler) {
  animation: rise-in 0.45s ease 1.05s backwards;
}

.nav-indicator {
  animation: fade-in 0.3s ease 1.1s backwards;
}

.app-main {
  animation: content-rise 0.65s ease 1.15s backwards;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes content-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

/* 모션을 줄이고 싶은 사용자에게는 인트로를 생략한다 */
@media (prefers-reduced-motion: reduce) {
  .global-nav::after,
  .brand,
  .nav-links a,
  .nav-right :deep(.unit-toggler),
  .nav-indicator,
  .app-main {
    animation: none;
  }
}

.brand {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--ink);
  text-decoration: none;
  white-space: nowrap;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: var(--s3);
}

.nav-links {
  position: relative;
  display: flex;
  gap: var(--s3);
  padding-bottom: 5px;
}

.nav-links a {
  padding: 2px;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--ink);
}

.nav-links a.router-link-exact-active {
  color: var(--ink);
  font-weight: 700;
}

/* 활성 링크를 따라 좌우로 미끄러지는 검정 선 */
.nav-indicator {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: var(--ink);
  transition:
    left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}
</style>
