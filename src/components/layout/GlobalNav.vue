<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import UnitToggler from '@/components/weather/UnitToggler.vue'

// 전역 내비게이션 — 풀폭 헤더 ↔ 스크롤 시 리퀴드 필 변형,
// 활성 링크를 따라가는 선 인디케이터, 모바일 대응까지 담당한다.
// stage(pre/entered)는 인트로 시퀀스에 맞춘 등장 타이밍 제어용이다.
defineProps({
  stage: {
    type: String,
    default: 'entered', // pre · entered
  },
})

// 실습이 Day 단위로 계속 늘어나므로 내비에는 기간을 표기하지 않는다
const links = [
  { to: '/', label: '홈' },
  { to: '/accessible', label: '홈 2' },
  { to: '/about', label: '소개' },
  { to: '/lessons', label: '실습 아카이브' },
  { to: '/troubleshooting', label: '트러블슈팅' },
]

const route = useRoute()
const linkEls = ref([])

// 홈은 다크 히어로가 내비 뒤까지 차오르므로 내비를 흰 타이포로 뒤집는다.
// 스크롤로 필이 되면 흰 글래스라 원래 톤으로 돌아온다
const onDark = computed(() => route.path === '/')

// 현재 경로에 해당하는 링크 밑으로 미끄러져 이동하는 선 인디케이터
const indicator = ref({ left: 0, width: 0, opacity: 0 })

const setLinkEl = (el, index) => {
  // RouterLink는 컴포넌트라 실제 DOM은 $el에서 꺼낸다
  if (el) linkEls.value[index] = el.$el ?? el
}

// 하위 경로에서도 상위 링크를 현재 위치로 인정한다.
// 지구본 홈 동선은 /country와 /weather로 깊어지고,
// 접근성 홈 동선은 /accessible 아래로 깊어져 각자 자기 탭을 가리킨다
const isCurrent = (link) => {
  // 404 화면에서는 경로가 무엇이든 어떤 탭도 현재 위치가 아니다
  if (route.name === 'not-found') return false
  if (link.to === '/') {
    return (
      route.path === '/' ||
      route.path.startsWith('/country/') ||
      route.path.startsWith('/weather/')
    )
  }
  return link.to === route.path || route.path.startsWith(link.to + '/')
}

const moveIndicator = async () => {
  await nextTick()
  const activeIndex = links.findIndex(isCurrent)
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
let indicatorTimer = null

watch(isScrolled, () => {
  clearTimeout(indicatorTimer)
  indicatorTimer = setTimeout(moveIndicator, 380)
})

watch(() => route.path, moveIndicator)

onMounted(() => {
  moveIndicator()
  onScroll()
  window.addEventListener('resize', moveIndicator)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  clearTimeout(indicatorTimer)
  window.removeEventListener('resize', moveIndicator)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="nav-wrap" :class="[stage, { 'on-dark': onDark && !isScrolled }]">
    <div class="global-nav" :class="{ scrolled: isScrolled }">
      <RouterLink to="/" class="brand">SKALA WEATHER</RouterLink>

      <div class="nav-right">
        <nav class="nav-links">
          <RouterLink
            v-for="(link, i) in links"
            :key="link.to"
            :ref="(el) => setLinkEl(el, i)"
            :to="link.to"
            :class="{ current: isCurrent(link) }"
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
</template>

<style scoped>
.nav-wrap {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  /* 필 모드에서 좌우 투명 영역이 아래 콘텐츠의 클릭을 가로채지 않게 한다 */
  pointer-events: none;
}

.global-nav {
  pointer-events: auto;
}

/* 기본 상태: 풀폭 헤더 — 배경은 투명하게 두고 하단에 가는 잉크 선 하나만 남긴다 */
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

/* 하단 잉크 선 — 본문 등장 시 중앙에서 양쪽으로 그어진다 */
.global-nav::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: var(--line-strong);
  transform-origin: center;
  transition: opacity 0.35s ease;
}

.global-nav.scrolled::after {
  opacity: 0;
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

/* ── 등장 시퀀스: 인트로가 자리를 넘기는 순간(entered) 순차로 떠오른다 ── */
.nav-wrap.pre .brand,
.nav-wrap.pre .nav-links a,
.nav-wrap.pre :deep(.unit-toggler) {
  opacity: 0;
}

.nav-wrap.pre .nav-indicator {
  visibility: hidden;
}

.nav-wrap.pre .global-nav::after {
  transform: scaleX(0);
}

.nav-wrap.entered .global-nav::after {
  animation: line-draw 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.05s backwards;
}

.nav-wrap.entered .brand {
  animation: rise-in 0.5s ease 0.3s backwards;
}

.nav-wrap.entered .nav-links a {
  animation: rise-in 0.45s ease backwards;
}

.nav-wrap.entered .nav-links a:nth-child(1) {
  animation-delay: 0.45s;
}

.nav-wrap.entered .nav-links a:nth-child(2) {
  animation-delay: 0.55s;
}

.nav-wrap.entered .nav-links a:nth-child(3) {
  animation-delay: 0.65s;
}

.nav-wrap.entered .nav-links a:nth-child(4) {
  animation-delay: 0.75s;
}

.nav-wrap.entered .nav-links a:nth-child(5) {
  animation-delay: 0.85s;
}

.nav-wrap.entered :deep(.unit-toggler) {
  animation: rise-in 0.45s ease 0.85s backwards;
}

.nav-wrap.entered .nav-indicator {
  animation: fade-in 0.3s ease 0.9s backwards;
}

@keyframes line-draw {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
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

@keyframes fade-in {
  from {
    opacity: 0;
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

.nav-links a.current {
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

/* 다크 히어로 위 — 흰 타이포로 반전 */
.nav-wrap.on-dark .brand {
  color: #fff;
}

.nav-wrap.on-dark .nav-links a {
  color: rgba(255, 255, 255, 0.55);
}

.nav-wrap.on-dark .nav-links a:hover,
.nav-wrap.on-dark .nav-links a.current {
  color: #fff;
}

.nav-wrap.on-dark .nav-indicator {
  background: #fff;
}

/* 다크 히어로에서는 헤더 밑 선을 긋지 않는다 — 화면 전체가 한 장의 우주가 되도록 */
.nav-wrap.on-dark .global-nav::after {
  background: transparent;
}

.nav-wrap.on-dark :deep(.unit-toggler) {
  border-color: rgba(255, 255, 255, 0.55);
}

.nav-wrap.on-dark :deep(.unit-toggler button) {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
}

.nav-wrap.on-dark :deep(.unit-toggler button.active) {
  background: #fff;
  color: #111;
}

/* 모바일 — 브랜드·링크·토글을 한 줄에 눌러 담는다 */
@media (max-width: 640px) {
  .global-nav {
    padding: 12px 16px;
  }

  .global-nav.scrolled {
    max-width: calc(100% - 24px);
    padding: 9px 16px;
  }

  .brand {
    font-size: 12px;
    letter-spacing: 0.1em;
  }

  .nav-right {
    gap: 12px;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-links a {
    font-size: 12px;
  }

  :deep(.unit-toggler button) {
    padding: 3px 8px;
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .global-nav::after,
  .nav-wrap.entered .global-nav::after,
  .nav-wrap.entered .brand,
  .nav-wrap.entered .nav-links a,
  .nav-wrap.entered :deep(.unit-toggler),
  .nav-wrap.entered .nav-indicator {
    animation: none;
  }
}
</style>
