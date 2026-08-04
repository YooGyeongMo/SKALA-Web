<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { countries } from '@/data/countries'
import { hasApiKey, fetchCityWeather, mapMainToGlyph, normalizeDescription } from '@/api/openWeather'
import { useUiStore } from '@/stores/uiStore'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'

const router = useRouter()
const uiStore = useUiStore()

// 나라 카드 목록 — 각 나라의 수도(첫 도시) 실황을 함께 보여준다
const countryCards = ref(
  countries.map((country) => ({
    code: country.code,
    name: country.name,
    english: country.english,
    capital: country.cities[0].name,
    temp: country.cities[0].mockTemp,
    status: country.cities[0].mockStatus,
    glyph: null,
  })),
)

const isLoading = ref(false)
const dataSource = ref('mock')

// 키가 있으면 목데이터를 깜빡이는 대신 스켈레톤을 보여주고, 완료 후 한 번에 등장시킨다
const loaded = ref(!hasApiKey)

// 5개국 수도 실황을 병렬로 받아온다. 실패하면 목데이터를 유지한다
const loadCapitals = async () => {
  if (!hasApiKey) {
    // 키가 없으면 목데이터 그대로 — 인트로는 바로 해제한다
    uiStore.markReady()
    return
  }
  isLoading.value = true
  try {
    const results = await Promise.all(
      countries.map((country) => fetchCityWeather(country.cities[0].english)),
    )
    countryCards.value = countryCards.value.map((card, i) => ({
      ...card,
      temp: results[i].main.temp,
      status: normalizeDescription(results[i].weather[0].description),
      glyph: mapMainToGlyph(results[i].weather[0].main),
    }))
    dataSource.value = 'live'
  } catch (error) {
    console.error('[Axios] 수도 실황 연동 실패, 목데이터로 표시합니다:', error)
  } finally {
    isLoading.value = false
    loaded.value = true
    // 성공이든 실패든 첫 로딩이 끝났음을 알려 인트로를 해제한다
    uiStore.markReady()
  }
}

// 24시간제 현재 시각 — 콜론이 1초 간격으로 깜빡인다
const now = ref(new Date())
let clockTimer = null

const hours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))

onMounted(() => {
  loadCapitals()
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
})

const goCountry = (code) => {
  router.push('/country/' + code)
}
</script>

<template>
  <div class="world">
    <header class="world-head">
      <div class="clock" aria-label="현재 시각">
        <span class="clock-digits">{{ hours }}</span>
        <span class="clock-colon">:</span>
        <span class="clock-digits">{{ minutes }}</span>
      </div>
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

    <!-- 로딩 중에는 같은 톤의 스켈레톤이 자리를 지킨다 -->
    <div v-if="!loaded" class="country-grid">
      <div v-for="n in 5" :key="n" class="sk-card">
        <span class="sk sk-emblem"></span>
        <span class="sk sk-line w40"></span>
        <span class="sk sk-line w62"></span>
        <span class="sk sk-line w48"></span>
      </div>
    </div>

    <div v-else class="country-grid">
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

/* 24시간 시계 — 우측 상단, 콜론이 1초마다 깜빡인다 */
.clock {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.clock-colon {
  margin: 0 2px;
  animation: colon-blink 1s steps(1) infinite;
}

@keyframes colon-blink {
  50% {
    opacity: 0;
  }
}

.world-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
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

.country-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--s2);
}

/* 스켈레톤 — 흰 패널 위에 옅은 잉크가 흐른다 */
.sk-card {
  display: grid;
  gap: 12px;
  padding: var(--s3);
  background: var(--paper);
  border: 1px solid var(--line);
  border-top: 2px solid var(--line-strong);
}

.sk {
  display: block;
  background: linear-gradient(
    90deg,
    rgba(17, 17, 17, 0.05) 25%,
    rgba(17, 17, 17, 0.1) 45%,
    rgba(17, 17, 17, 0.05) 65%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

.sk-emblem {
  width: 96px;
  height: 96px;
  justify-self: end;
  border-radius: 8px;
}

.sk-line {
  height: 13px;
}

.w40 {
  width: 40%;
}

.w62 {
  width: 62%;
}

.w48 {
  width: 48%;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
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

/* 국기 엠블럼 — 은은한 밑그림으로 서 있다가,
   호버하면 알파가 진해지며 선이 다시 그려지고 국기색이 차오른다 */
.country-emblem {
  width: 112px;
  justify-self: end;
  opacity: 0.5;
  transition: opacity 0.35s ease;
}

.country-card:hover .country-emblem {
  opacity: 1;
}

.country-card:hover .country-emblem :deep(.line) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: emblem-draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.country-card:hover .country-emblem :deep(.f) {
  fill-opacity: 1;
}

.country-card:hover .country-emblem :deep(.star) {
  fill: rgba(224, 177, 62, 0.95);
}

.country-card:hover .country-emblem :deep(.cstar) {
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
</style>
