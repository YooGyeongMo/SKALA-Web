<script setup>
// App은 내비게이션 바(RouterLink)와 메인 콘텐츠 영역(RouterView)만 담당한다.
// 실제 페이지 내용은 views/ 아래 페이지 컴포넌트가 맡는다.
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const links = [
  { to: '/', label: '홈' },
  { to: '/about', label: '소개' },
  { to: '/lessons', label: 'Day 1–3 실습' },
]

const route = useRoute()
const linkEls = ref([])

// 현재 경로에 해당하는 링크 밑으로 미끄러져 이동하는 인디케이터
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

watch(() => route.path, moveIndicator)

onMounted(() => {
  moveIndicator()
  window.addEventListener('resize', moveIndicator)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', moveIndicator)
})
</script>

<template>
  <div class="app">
    <!-- 스크롤을 따라 떠 있는 글래스 내비 — 배경 그라데이션이 블러로 비쳐 보인다 -->
    <header class="nav-wrap">
      <div class="global-nav">
        <RouterLink to="/" class="brand">SKALA<span class="dot">·</span>WEATHER</RouterLink>

        <nav class="nav-links">
        <RouterLink
          v-for="(link, i) in links"
          :key="link.to"
          :ref="(el) => setLinkEl(el, i)"
          :to="link.to"
        >
          {{ link.label }}
        </RouterLink>

          <!-- 슬라이딩 인디케이터 — 활성 링크 아래로 이동한다 -->
          <span
            class="nav-indicator"
            :style="{
              left: indicator.left + 'px',
              width: indicator.width + 'px',
              opacity: indicator.opacity,
            }"
          ></span>
        </nav>
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
  top: 14px;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: var(--s2) var(--s2) 0 var(--s2);
}

.app-main {
  margin-top: var(--s2);
}

/* 리퀴드 글래스 필 — 반투명 흰색 + 블러, 아래 콘텐츠가 은은히 비친다 */
.global-nav {
  display: flex;
  align-items: center;
  gap: var(--s4);
  padding: 11px 24px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(17, 17, 17, 0.06);
}

.brand {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--ink);
  text-decoration: none;
}

.brand .dot {
  color: var(--muted);
  margin: 0 2px;
}

.nav-links {
  position: relative;
  display: flex;
  gap: var(--s3);
  padding-bottom: 4px;
}

.nav-links a {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;
}

.nav-links a:hover {
  color: var(--ink);
}

.nav-links a.router-link-exact-active {
  color: var(--ink);
  font-weight: 700;
}

/* 활성 링크를 따라 좌우로 미끄러지는 검정 바 */
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
