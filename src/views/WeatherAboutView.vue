<script setup>
import EarthHero from '@/components/space/EarthHero.vue'

// 소개 레이아웃 — 지구 히어로와 탭은 여기 남고,
// 탭 아래 내용만 중첩 라우트(RouterView)로 갈아 끼운다.
// 부모가 유지되므로 탭을 오가도 three.js 히어로는 다시 초기화되지 않는다.
</script>

<template>
  <div class="about-page">
    <!-- 우주에서 본 지구 — three.js 실시간 렌더링 히어로 -->
    <EarthHero />

    <div class="about">
      <!-- 소개와 디자인 철학을 나누는 탭 — 각 탭이 자기 주소를 가진다 -->
      <nav class="about-tabs" aria-label="소개 하위 메뉴">
        <RouterLink to="/about" class="tab">소개</RouterLink>
        <RouterLink to="/about/philosophy" class="tab">디자인 철학</RouterLink>
      </nav>

      <RouterView v-slot="{ Component }">
        <Transition name="tab-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>

      <!-- 메인 대시보드로 돌아가기 -->
      <RouterLink to="/" class="btn-home">← 메인 대시보드로 돌아가기</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 760px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

/* 하위 탭 — 헤어라인 위에 활성 잉크 선이 얹힌다 */
.about-tabs {
  display: flex;
  gap: var(--s3);
  border-bottom: 1px solid var(--line);
  margin-bottom: var(--s4);
}

.about-tabs .tab {
  padding: 0 2px 10px 2px;
  margin-bottom: -1px;
  font-size: 15px;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.about-tabs .tab:hover {
  color: var(--ink);
}

.about-tabs .tab.router-link-exact-active {
  color: var(--ink);
  font-weight: 700;
  border-bottom-color: var(--ink);
}

/* 탭 내용 교체 — 짧은 페이드로만 잇는다 */
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}

.btn-home {
  display: inline-block;
  padding: 12px var(--s4);
  font-size: 14px;
  font-weight: 600;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--line-strong);
  text-decoration: none;
  transition: all 0.15s;
}

.btn-home:hover {
  background: var(--paper);
  color: var(--ink);
}
</style>
