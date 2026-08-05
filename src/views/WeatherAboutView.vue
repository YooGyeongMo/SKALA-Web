<script setup>
import EarthHero from '@/components/space/EarthHero.vue'
</script>

<template>
  <div class="about-page">
    <!-- 우주에서 본 지구 — three.js 실시간 렌더링 히어로 -->
    <EarthHero />

    <div class="about">

    <div class="about-body">
      <p>
        SKALA Weather는 Vue 3 실습으로 만든 지역별 날씨 대시보드입니다. 도시별 현재 기온과 날씨
        상태를 카드로 보여주고, 상세 페이지에서는 체감 온도, 습도, 바람 같은 관측 정보를 확인할
        수 있습니다.
      </p>
      <p>
        Day 1부터 3까지 만든 대시보드 컴포넌트(BaseDashboardCard, SearchBar, WeatherCard)를
        그대로 재사용했고, Day 4에서 Vue Router로 내비게이션과 동적 경로 매칭, 지연 로딩,
        Catch-all까지 페이지 전환 구조를 얹었습니다.
      </p>
      <ul class="about-stack">
        <li>Vue 3 기반 Composition API</li>
        <li>Vue Router의 동적 매칭과 지연 로딩</li>
        <li>props, emits, slot을 활용한 컴포넌트 재사용</li>
      </ul>
    </div>

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

.about-body p {
  font-size: 16.5px;
  line-height: 1.9;
  margin-bottom: var(--s2);
}

.about-stack {
  list-style: none;
  display: grid;
  gap: var(--s1);
  margin: var(--s3) 0 var(--s4) 0;
  font-size: 15px;
}

.about-stack li {
  border: 1px solid var(--line);
  background: var(--paper);
  padding: 12px var(--s2);
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
