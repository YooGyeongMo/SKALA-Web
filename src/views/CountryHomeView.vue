<script setup>
import { ref, onMounted } from 'vue'
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
    // 성공이든 실패든 첫 로딩이 끝났음을 알려 인트로를 해제한다
    uiStore.markReady()
  }
}

onMounted(loadCapitals)

const goCountry = (code) => {
  router.push('/country/' + code)
}
</script>

<template>
  <div class="world">
    <header class="world-head">
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

    <div class="country-grid">
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
  margin-bottom: var(--s4);
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

/* 국기 엠블럼 — 밑그림이 카드별 시차로 그려지고,
   호버하면 선을 다시 그리며 국기색이 차오른다 */
.country-emblem {
  width: 112px;
  justify-self: end;
}

.country-emblem :deep(path),
.country-emblem :deep(rect),
.country-emblem :deep(circle) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: emblem-draw 1.1s cubic-bezier(0.4, 0, 0.2, 1) calc(var(--emblem-delay, 0s) + 0.1s)
    forwards;
}

.country-card:hover .country-emblem :deep(path),
.country-card:hover .country-emblem :deep(rect),
.country-card:hover .country-emblem :deep(circle) {
  animation: emblem-draw 0.85s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.country-card:hover .country-emblem :deep(.f) {
  fill-opacity: 1;
}

@keyframes emblem-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.country-card:nth-child(1) .country-emblem {
  --emblem-delay: 0s;
}
.country-card:nth-child(2) .country-emblem {
  --emblem-delay: 0.12s;
}
.country-card:nth-child(3) .country-emblem {
  --emblem-delay: 0.24s;
}
.country-card:nth-child(4) .country-emblem {
  --emblem-delay: 0.36s;
}
.country-card:nth-child(5) .country-emblem {
  --emblem-delay: 0.48s;
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
