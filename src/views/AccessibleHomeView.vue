<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { tzClock } from '@/utils/time'
import { useCapitalWeather } from '@/composables/useCapitalWeather'
import { useMyPlace } from '@/composables/useMyPlace'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'
import { MapPin, MousePointer2 } from 'lucide-vue-next'

// 홈 2 — 접근성 버전. 지구본 없이 나라 카드 그리드로 같은 데이터를 제공한다.
// 카드의 엠블럼 드로잉, 현지 시간, 플로팅 등 기존 인터랙션은 그대로 유지한다.
const router = useRouter()
const { countryCards, isLoading, dataSource, loaded } = useCapitalWeather()

// 위치 권한을 허용하면 내 위치의 도시명을 시계 아래에 보여준다
const { myPlace } = useMyPlace()

// 24시간제 현재 시각 — 콜론이 1초 간격으로 깜빡인다
const now = ref(new Date())
let clockTimer = null

const hours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))

onMounted(() => {
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
})

const goCountry = (code) => {
  // 접근성 동선은 /accessible 아래로 깊어진다 — 내비가 홈 2를 계속 가리킨다
  router.push('/accessible/country/' + code)
}
</script>

<template>
  <div class="world">
    <header class="world-head">
      <div class="clock-wrap">
        <div class="clock" aria-label="현재 시각">
          <span class="clock-digits">{{ hours }}</span>
          <span class="clock-colon">:</span>
          <span class="clock-digits">{{ minutes }}</span>
        </div>
        <p v-if="myPlace" class="clock-place">
          <MapPin class="place-pin" :size="14" :stroke-width="2.2" />{{ myPlace }}
        </p>
        <RouterLink to="/" class="switch-link">3D 지구본 버전으로 보기</RouterLink>
      </div>
      <p class="section-label">Accessible Home</p>
      <h1 class="world-title">세계 날씨 대시보드</h1>
      <p class="world-sub">나라를 고르면 대표 도시 10곳의 실시간 날씨를 볼 수 있습니다.</p>
      <p class="data-source" :class="dataSource">
        {{
          isLoading
            ? '수도 실황을 불러오는 중...'
            : dataSource === 'live'
              ? 'OpenWeather 실시간 관측 데이터'
              : '목데이터 표시 중 (API 키 미설정 또는 통신 실패)'
        }}
      </p>
    </header>

    <!-- 카드가 다 뜬 뒤에야 조용히 드러나는 안내 — 숨은 인터랙션을 슬쩍 알려준다.
         자리는 항상 차지해서 등장할 때 그리드가 밀리지 않는다 -->
    <p class="hover-guide" :class="{ shown: loaded }" :aria-hidden="!loaded">
      <MousePointer2 class="guide-icon" :size="13" :stroke-width="2" />
      카드에 마우스를 올리거나 키보드로 포커스를 주면 국기의 선이 그려지고 색이 차오릅니다
    </p>

    <!-- 로딩 중에는 같은 톤의 스켈레톤이 자리를 지킨다 -->
    <div v-if="!loaded" class="country-grid">
      <div v-for="n in 5" :key="n" class="sk-card">
        <el-skeleton animated>
          <template #template>
            <div class="skt">
              <el-skeleton-item variant="image" class="skt-emblem" />
              <el-skeleton-item variant="text" style="width: 40%" />
              <el-skeleton-item variant="text" style="width: 62%" />
              <el-skeleton-item variant="text" style="width: 48%" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <div v-if="loaded" class="country-grid">
      <button
        v-for="card in countryCards"
        :key="card.code"
        class="country-card"
        @click="goCountry(card.code)"
      >
        <CountryEmblem :country-code="card.code" class="country-emblem" />
        <div class="country-meta">
          <p class="country-en">{{ card.english }}</p>
          <h2 class="country-name">{{ card.name }}</h2>
          <div class="capital-row">
            <WeatherGlyph :status="card.glyph || card.status" :size="22" />
            <span class="capital-temp">{{ Math.round(card.temp) }}°</span>
            <span class="capital-name">{{ card.capital }}</span>
            <span class="capital-time">
              {{ tzClock(now.getTime(), card.tz).slice(0, 2)
              }}<i class="tick">:</i>{{ tzClock(now.getTime(), card.tz).slice(3) }}
            </span>
          </div>
        </div>
        <span class="country-cta">대표 도시 10곳 →</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.world {
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.world-head {
  position: relative;
  margin-bottom: var(--s4);
}

.world-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-top: var(--s1);
}

.world-sub {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}

.data-source {
  margin-top: var(--s1);
  font-size: 11.5px;
  color: var(--muted);
}

.data-source::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  margin-right: 6px;
  vertical-align: 1px;
}

.data-source.live::before {
  background: var(--ok);
}

/* 24시간 시계 — 우측 상단, 콜론이 1초마다 깜빡인다 */
.clock-wrap {
  position: absolute;
  right: 0;
  top: 0;
  text-align: right;
}

.clock {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.clock-colon {
  margin: 0 2px;
  animation: colon-blink 1s steps(1) infinite;
}

/* 내 위치 — 파란 핀에 보조 색 텍스트 */
.clock-place {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 3px;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted);
}

.place-pin {
  color: var(--cool);
}

.switch-link {
  display: inline-block;
  margin-top: var(--s1);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

@keyframes colon-blink {
  50% {
    opacity: 0;
  }
}

/* 호버 가이드 — 카드가 다 뜬 뒤 조용히 드러난다. 자리는 항상 지킨다 */
.hover-guide {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--s2);
  font-size: 12.5px;
  color: var(--muted);
  opacity: 0;
  transition: opacity 0.7s ease 0.5s;
}

.hover-guide.shown {
  opacity: 1;
}

/* 포인터 아이콘이 살짝 눌렀다 떼듯 움직인다 */
.hover-guide.shown .guide-icon {
  animation: guide-nudge 2.6s ease-in-out infinite;
}

@keyframes guide-nudge {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(2px, 2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hover-guide.shown .guide-icon {
    animation: none;
  }
}

.country-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--s2);
}

/* 스켈레톤 — 흰 패널 위에 옅은 잉크가 흐른다 */
.sk-card {
  padding: var(--s3);
  background: var(--paper);
  border: 1px solid var(--line);
  border-top: 2px solid var(--line-strong);
}

.skt {
  display: grid;
  gap: 12px;
}

.skt-emblem {
  width: 96px;
  height: 96px;
  justify-self: end;
}

/* 로딩이 끝나면 카드가 차례로 떠오른다 */
.country-card {
  animation: card-rise 0.5s ease backwards;
}

.country-card:nth-child(1) {
  animation-delay: 0s;
}
.country-card:nth-child(2) {
  animation-delay: 0.08s;
}
.country-card:nth-child(3) {
  animation-delay: 0.16s;
}
.country-card:nth-child(4) {
  animation-delay: 0.24s;
}
.country-card:nth-child(5) {
  animation-delay: 0.32s;
}

@keyframes card-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

.country-card {
  position: relative;
  display: grid;
  gap: var(--s2);
  padding: var(--s3);
  background: var(--paper);
  border: 1px solid var(--line);
  border-top: 2px solid var(--line-strong);
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.country-card:hover {
  border-color: var(--line-strong);
  transform: translateY(-5px);
  box-shadow: 0 14px 28px rgba(17, 17, 17, 0.12);
}

.country-card:focus-visible {
  outline: 3px solid var(--cool);
  outline-offset: 2px;
}

/* 국기 엠블럼 — 은은한 밑그림으로 서 있다가,
   호버하면 알파가 진해지며 선이 다시 그려지고 국기색이 차오른다 */
.country-emblem {
  width: 112px;
  justify-self: end;
  opacity: 0.5;
  transition: opacity 0.35s ease;
}

.country-card:hover .country-emblem,
.country-card:focus-visible .country-emblem {
  opacity: 1;
}

.country-card:hover .country-emblem :deep(.line),
.country-card:focus-visible .country-emblem :deep(.line) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: emblem-draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.country-card:hover .country-emblem :deep(.seq1),
.country-card:focus-visible .country-emblem :deep(.seq1) {
  animation-delay: 0.25s;
}

.country-card:hover .country-emblem :deep(.seq2),
.country-card:focus-visible .country-emblem :deep(.seq2) {
  animation-delay: 0.5s;
}

.country-card:hover .country-emblem :deep(.f),
.country-card:focus-visible .country-emblem :deep(.f) {
  fill-opacity: 1;
}

.country-card:hover .country-emblem :deep(.star),
.country-card:focus-visible .country-emblem :deep(.star) {
  fill: rgba(224, 177, 62, 0.95);
}

.country-card:hover .country-emblem :deep(.cstar),
.country-card:focus-visible .country-emblem :deep(.cstar) {
  fill: rgba(255, 255, 255, 0.95);
}

@keyframes emblem-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.country-meta {
  display: grid;
  gap: 2px;
}

.country-en {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.country-name {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.capital-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: var(--s1);
}

.capital-temp {
  font-size: 20px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

.capital-name {
  font-size: 12px;
  color: var(--muted);
}

.capital-time {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.capital-time .tick {
  font-style: normal;
  animation: colon-blink 1s steps(1) infinite;
}

.country-cta {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  border-top: 1px solid var(--line);
  padding-top: var(--s1);
  transition: color 0.15s;
}

.country-card:hover .country-cta {
  color: var(--ink);
}

@media (max-width: 640px) {
  .clock {
    font-size: 22px;
  }
}
</style>
