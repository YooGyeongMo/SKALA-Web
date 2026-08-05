<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import { countries } from '@/data/countries'
import {
  hasApiKey,
  hasCachedCity,
  fetchCityWeather,
  fetchWeatherByCoords,
  fetchPlaceName,
  mapMainToGlyph,
  normalizeDescription,
} from '@/api/openWeather'
import { tzClock, MOCK_TZ } from '@/utils/time'
import { useUiStore } from '@/stores/uiStore'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'

// three.js 지구본은 무거워서 비동기로만 불러온다
const EarthGlobe = defineAsyncComponent(() => import('@/components/space/EarthGlobe.vue'))
import { MapPin } from 'lucide-vue-next'

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
    tz: MOCK_TZ[country.code],
  })),
)

const isLoading = ref(false)
const dataSource = ref('mock')

// 스켈레톤 원칙: 기다림이 실재할 때만 보여준다.
// 캐시가 전부 따뜻하면(재방문) 스켈레톤 없이 즉시 렌더하고,
// 첫 로딩이면 최소 1.3초와 실제 로딩 중 늦은 쪽까지 보여준다
const cacheWarm = hasApiKey && countries.every((c) => hasCachedCity(c.cities[0].english))
const fetchDone = ref(!hasApiKey)
const minDone = ref(cacheWarm)
const loaded = computed(() => fetchDone.value && minDone.value)

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
      tz: results[i].timezone,
    }))
    dataSource.value = 'live'
  } catch (error) {
    console.error('[Axios] 수도 실황 연동 실패, 목데이터로 표시합니다:', error)
  } finally {
    isLoading.value = false
    fetchDone.value = true
    // 성공이든 실패든 첫 로딩이 끝났음을 알려 인트로를 해제한다
    uiStore.markReady()
  }
}

// 24시간제 현재 시각 — 콜론이 1초 간격으로 깜빡인다
const now = ref(new Date())
let clockTimer = null

// 위치 권한을 허용하면 내 위치의 도시명을 시계 옆에 보여준다
const myPlace = ref('')

const loadMyPlace = () => {
  // 우선 브라우저 타임존에서 도시명을 뽑아 폴백으로 보여준다 (예: Asia/Seoul → Seoul)
  const tzCity = Intl.DateTimeFormat().resolvedOptions().timeZone?.split('/').pop()
  if (tzCity) myPlace.value = tzCity.replaceAll('_', ' ')

  if (!hasApiKey || !navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        // 1순위: 역지오코딩 한글 지명 (판교 → 성남시)
        const place = await fetchPlaceName(latitude, longitude)
        if (place) {
          myPlace.value = place
          return
        }
      } catch (error) {
        console.warn('[내 위치] 역지오코딩 실패, 날씨 지점명으로 폴백:', error)
      }
      try {
        // 2순위: 좌표 날씨 응답의 지점명
        const data = await fetchWeatherByCoords(latitude, longitude)
        if (data.name) myPlace.value = data.name
      } catch (error) {
        console.error('[내 위치] 좌표 날씨 조회 실패, 타임존 폴백 유지:', error)
      }
    },
    (error) => {
      console.warn('[내 위치] 위치 권한 거부 또는 실패, 타임존 폴백 유지:', error.message)
    },
    { timeout: 8000 },
  )
}

const hours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))

onMounted(() => {
  loadCapitals()
  loadMyPlace()
  if (!cacheWarm) {
    setTimeout(() => {
      minDone.value = true
    }, 1300)
  }
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
  <div class="world-page">
    <!-- 풀블리드 히어로 — 지구본이 화면을 채우고 그 위에 타이포가 올라간다 -->
    <section class="world-hero">
      <EarthGlobe :countries="countryCards" @select="goCountry" />

      <div class="hero-copy">
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
      </div>

      <div class="clock-wrap">
        <div class="clock" aria-label="현재 시각">
          <span class="clock-digits">{{ hours }}</span>
          <span class="clock-colon">:</span>
          <span class="clock-digits">{{ minutes }}</span>
        </div>
        <p v-if="myPlace" class="clock-place">
          <MapPin class="place-pin" :size="14" :stroke-width="2.2" />{{ myPlace }}
        </p>
      </div>
    </section>

    <div class="world">
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
  </div>
</template>

<style scoped>
/* 풀블리드 히어로 */
.world-hero {
  position: relative;
  height: calc(100vh - 140px);
  min-height: 540px;
  background:
    radial-gradient(1100px 620px at 60% 44%, rgba(64, 110, 190, 0.22), transparent 62%),
    #05070d;
  border-bottom: 1px solid var(--line-strong);
  overflow: hidden;
}

.hero-copy {
  position: absolute;
  left: clamp(20px, 6vw, 72px);
  top: clamp(28px, 6vh, 56px);
  color: #fff;
  pointer-events: none;
}

.world {
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--s4) var(--s3) var(--s6) var(--s3);
}

/* 24시간 시계 — 히어로 우측 상단, 콜론이 1초마다 깜빡인다 */
.clock-wrap {
  position: absolute;
  right: clamp(20px, 5vw, 64px);
  top: clamp(28px, 6vh, 56px);
  text-align: right;
  pointer-events: none;
}

.clock {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
  font-variant-numeric: tabular-nums;
}

.clock-place {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 3px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
}

/* 위치 핀 — 은은한 파랑 */
.place-pin {
  color: rgba(42, 92, 168, 0.65);
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

@media (max-width: 640px) {
  .world-hero {
    height: 66vh;
    min-height: 460px;
  }

  .clock {
    font-size: 22px;
  }

  .clock-place {
    font-size: 12px;
  }
}

.world-title {
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.world-sub {
  margin-top: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.data-source {
  margin-top: var(--s2);
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.6);
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

.country-card:hover .country-emblem :deep(.seq1) {
  animation-delay: 0.25s;
}

.country-card:hover .country-emblem :deep(.seq2) {
  animation-delay: 0.5s;
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
</style>
