<script setup>
import EarthHero from '@/components/space/EarthHero.vue'
import WeatherCard from '@/practices/component/WeatherCard.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'

// 디자인 철학 전시용 표본 — 실제 서비스에서 쓰는 부품을 그대로 세운다
const sampleCity = { id: 'city_01', name: '서울', temp: 28, status: '맑음' }
const emblemCodes = ['kr', 'us', 'de', 'jp', 'cn']
const glyphStates = ['맑음', '비', '구름', '흐림']
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

      <!-- 디자인 철학 — 원칙과 실물 부품 전시 -->
      <section class="philosophy">
        <p class="section-label">Design Principles</p>
        <h2 class="ph-title">디자인 철학</h2>

        <div class="ph-item">
          <h3 class="ph-head">1. 선 하나로 말한다</h3>
          <p class="ph-text">
            사진과 장식 대신 가는 잉크 선으로 도시의 정체성을 그립니다. 경복궁의 처마, 광안대교의
            케이블, 돌하르방의 둥근 모자까지 모두 같은 굵기의 선입니다. 정보를 가리지 않도록
            낮은 알파로 바닥에 깔리고, 관심을 주면(호버) 그제야 선이 처음부터 다시 그려집니다.
          </p>
          <div class="ph-stage">
            <WeatherCard :city-item="sampleCity" class="ph-card" />
          </div>
        </div>

        <div class="ph-item">
          <h3 class="ph-head">2. 색은 데이터에만 쓴다</h3>
          <p class="ph-text">
            바탕은 흰색과 잉크뿐입니다. 색이 등장하는 순간은 의미가 있을 때뿐 — 기온 구간의
            빨강과 파랑, 국기의 홍청과 골드처럼 데이터가 색을 가질 때만 화면에 색이 생깁니다.
          </p>
          <div class="ph-stage ph-row">
            <CountryEmblem
              v-for="code in emblemCodes"
              :key="code"
              :country-code="code"
              class="ph-emblem colored"
            />
          </div>
          <div class="ph-stage ph-row">
            <span v-for="state in glyphStates" :key="state" class="ph-glyph">
              <WeatherGlyph :status="state" :size="34" />
              <em>{{ state }}</em>
            </span>
          </div>
        </div>

        <div class="ph-item">
          <h3 class="ph-head">3. 기다림이 실재할 때만 보여준다</h3>
          <p class="ph-text">
            로딩 표시는 기다림이 진짜일 때만 등장합니다. 캐시가 따뜻한 재방문에는 스켈레톤 없이
            즉시 그리고, 첫 로딩에만 최소 1.3초의 스켈레톤이 자리를 지킵니다. 인트로 화면도
            타이머가 아니라 실제 데이터 도착 신호에 맞춰 걷힙니다.
          </p>
        </div>

        <div class="ph-item">
          <h3 class="ph-head">4. 모션은 의미를 나를 때만</h3>
          <p class="ph-text">
            선이 그려지는 모션은 정체성의 등장이고, 지구본 핀의 광륜은 위치의 신호입니다. 장식을
            위한 움직임은 넣지 않으며, 모션을 줄이고 싶은 사용자에게는 전부 생략됩니다. 같은
            데이터를 모션 없이 보는 접근성 홈도 따로 준비했습니다.
          </p>
        </div>
      </section>

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

/* 디자인 철학 */
.philosophy {
  margin: var(--s6) 0 var(--s4) 0;
  border-top: 2px solid var(--line-strong);
  padding-top: var(--s3);
}

.ph-title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: var(--s1) 0 var(--s3) 0;
}

.ph-item {
  margin-bottom: var(--s4);
}

.ph-head {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: var(--s1);
}

.ph-text {
  font-size: 15px;
  line-height: 1.85;
  margin-bottom: var(--s2);
}

/* 실물 부품 전시 무대 */
.ph-stage {
  background: var(--canvas);
  border: 1px solid var(--line);
  padding: var(--s3);
  margin-bottom: var(--s1);
}

.ph-card {
  max-width: 460px;
  pointer-events: auto;
}

.ph-row {
  display: flex;
  align-items: center;
  gap: var(--s4);
  flex-wrap: wrap;
}

.ph-emblem {
  width: 72px;
}

.ph-glyph {
  display: grid;
  justify-items: center;
  gap: 6px;
}

.ph-glyph em {
  font-style: normal;
  font-size: 11px;
  color: var(--muted);
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
