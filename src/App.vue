<script setup>
// App은 내비게이션 바(RouterLink)와 메인 콘텐츠 영역(RouterView)만 담당한다.
// 실제 페이지 내용은 views/ 아래 페이지 컴포넌트가 맡는다.
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'
import UnitToggler from '@/components/weather/UnitToggler.vue'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'

// 실습이 Day 단위로 계속 늘어나므로 내비에는 기간을 표기하지 않는다
const links = [
  { to: '/', label: '홈' },
  { to: '/about', label: '소개' },
  { to: '/lessons', label: '실습 아카이브' },
  { to: '/troubleshooting', label: '트러블슈팅' },
]

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
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

// ── 첫 진입 인트로 = 로딩 화면 ────────────────────────────
// loading: 워드마크와 선이 뜨고 해가 돌며 데이터를 기다린다
// leaving: 데이터가 준비되면 위로 상승하며 본문에 자리를 넘긴다
// done:    오버레이가 DOM에서 제거된 상태
const introState = ref('loading')

// 홈이 실황 로딩을 마치면 uiStore.dataReady가 켜진다.
// 너무 오래 걸리면 6초 뒤 강제로 해제한다 (안전장치)
const waitDataReady = () =>
  new Promise((resolve) => {
    if (uiStore.dataReady) return resolve()
    const stop = watch(
      () => uiStore.dataReady,
      (ready) => {
        if (ready) {
          stop()
          resolve()
        }
      },
    )
    setTimeout(() => {
      stop()
      resolve()
    }, 6000)
  })

const runIntro = async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    introState.value = 'done'
    uiStore.markReady()
    return
  }
  // 홈이 아닌 경로로 직접 들어온 경우에는 데이터 신호 없이 바로 준비 완료로 본다
  router.isReady().then(() => {
    if (route.path !== '/') uiStore.markReady()
  })
  // 최소 2.3초는 보여주고, 데이터가 준비되는 시점과 늦은 쪽에 맞춘다
  await Promise.all([new Promise((r) => setTimeout(r, 2300)), waitDataReady()])
  introState.value = 'leaving'
  setTimeout(() => {
    introState.value = 'done'
  }, 950)
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
  runIntro()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', moveIndicator)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div
    class="app"
    :class="{ pre: introState === 'loading', entered: introState !== 'loading' }"
  >
    <!-- 첫 진입 인트로 겸 로딩 화면: 선이 그어지고 워드마크가 뜬 뒤,
         해가 돌며 데이터를 기다리다가 준비되면 위로 올라간다 -->
    <div
      v-if="introState !== 'done'"
      class="intro"
      :class="{ leaving: introState === 'leaving' }"
      aria-hidden="true"
    >
      <div class="intro-inner">
        <p class="intro-brand">SKALA WEATHER</p>
        <span class="intro-line"></span>
        <div class="intro-sun">
          <WeatherGlyph status="맑음" :size="76" />
          <p class="intro-loading">실시간 날씨를 불러오는 중</p>
        </div>
      </div>
    </div>

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
  /* 필 모드에서 좌우 투명 영역이 아래 콘텐츠의 클릭을 가로채지 않게 한다 */
  pointer-events: none;
}

.global-nav {
  pointer-events: auto;
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

/* ── 첫 진입 인트로 오버레이 (로딩 화면) ───────────────── */
.intro {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper);
  pointer-events: none;
}

.intro-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.intro-brand {
  font-size: clamp(40px, 7vw, 88px);
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--ink);
  white-space: nowrap;
  animation: rise-in 0.7s ease 0.55s backwards;
}

/* 정중앙에서 화면 폭 70%까지 길게 그어지는 선 */
.intro-line {
  display: block;
  width: min(70vw, 920px);
  height: 2px;
  background: var(--ink);
  transform-origin: center;
  animation: line-draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

/* 해 스피너 — 광선이 돌며 로딩 중임을 알린다 */
.intro-sun {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: rise-in 0.5s ease 1s backwards;
}

.intro-sun :deep(.sun-rays) {
  animation-duration: 2.2s;
}

.intro-sun :deep(.glyph) {
  filter: drop-shadow(0 4px 10px rgba(208, 138, 46, 0.25));
}

.intro-loading {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--muted);
}

/* 데이터가 준비되면 전체가 위로 상승하며 배경이 걷힌다 */
.intro.leaving .intro-inner {
  animation: intro-ascend 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.intro.leaving {
  animation: intro-bg-out 0.55s ease 0.3s forwards;
}

@keyframes intro-ascend {
  to {
    transform: translateY(-42vh) scale(0.32);
    opacity: 0;
  }
}

@keyframes intro-bg-out {
  to {
    opacity: 0;
  }
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

/* ── 본문 등장 시퀀스 ─────────────────────────────────
   인트로가 상승을 시작하는 순간(entered) 헤더와 본문이 넘겨받는다.
   로딩 중(pre)에는 모두 숨겨 둔다 */
.app.pre .brand,
.app.pre .nav-links a,
.app.pre .nav-right :deep(.unit-toggler),
.app.pre .app-main {
  opacity: 0;
}

.app.pre .nav-indicator {
  visibility: hidden;
}

.app.pre .global-nav::after {
  transform: scaleX(0);
}

.app.entered .global-nav::after {
  animation: line-draw 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.05s backwards;
}

.app.entered .brand {
  animation: rise-in 0.5s ease 0.3s backwards;
}

.app.entered .nav-links a {
  animation: rise-in 0.45s ease backwards;
}

.app.entered .nav-links a:nth-child(1) {
  animation-delay: 0.45s;
}

.app.entered .nav-links a:nth-child(2) {
  animation-delay: 0.55s;
}

.app.entered .nav-links a:nth-child(3) {
  animation-delay: 0.65s;
}

.app.entered .nav-links a:nth-child(4) {
  animation-delay: 0.75s;
}

.app.entered .nav-right :deep(.unit-toggler) {
  animation: rise-in 0.45s ease 0.75s backwards;
}

.app.entered .nav-indicator {
  animation: fade-in 0.3s ease 0.8s backwards;
}

.app.entered .app-main {
  animation: content-rise 0.7s ease 0.55s backwards;
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

/* 모션을 줄이고 싶은 사용자에게는 인트로와 등장 모션을 생략한다 */
@media (prefers-reduced-motion: reduce) {
  .intro,
  .intro-inner,
  .intro-brand,
  .intro-line,
  .intro-sun,
  .global-nav::after,
  .app.entered .global-nav::after,
  .app.entered .brand,
  .app.entered .nav-links a,
  .app.entered .nav-right :deep(.unit-toggler),
  .app.entered .nav-indicator,
  .app.entered .app-main {
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

  .nav-right :deep(.unit-toggler button) {
    padding: 3px 8px;
    font-size: 11px;
  }
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
