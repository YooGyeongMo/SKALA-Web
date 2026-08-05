<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { findCityById, makeMockDetail } from '@/data/countries'
import {
  hasApiKey,
  fetchCityWeather,
  fetchForecast,
  fetchAirQuality,
  mapMainToGlyph,
  normalizeDescription,
  windDirection,
  formatVisibility,
  formatObservedAt,
} from '@/api/openWeather'
import ForecastChart from '@/components/weather/ForecastChart.vue'
import { useConfigStore } from '@/stores/configStore'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CityLandmark from '@/components/weather/CityLandmark.vue'

const route = useRoute()
const router = useRouter()
const city = ref(null)

const isLoading = ref(false)

// 키가 있으면 목데이터를 깜빡이는 대신 스켈레톤을 보여주고, 실측값으로 바로 그린다
const showSkeleton = ref(hasApiKey)

// Mount 시점에 동적 경로 파라미터(:cityId)로 단일 출처에서 도시 객체를 선택하고,
// 키가 있으면 OpenWeather 실시간 관측값으로 교체한다 (실패 시 목데이터 폴백)
onMounted(async () => {
  const base = findCityById(route.params.cityId)
  if (!base) {
    city.value = null
    showSkeleton.value = false
    return
  }
  if (!hasApiKey) {
    city.value = { ...base, temp: base.mockTemp, status: base.mockStatus, detail: makeMockDetail(base.mockTemp) }
    return
  }

  isLoading.value = true
  try {
    const raw = await fetchCityWeather(base.english)
    city.value = {
      ...base,
      temp: raw.main.temp,
      status: normalizeDescription(raw.weather[0].description),
      glyph: mapMainToGlyph(raw.weather[0].main),
      detail: {
        feels: raw.main.feels_like,
        humidity: raw.main.humidity,
        wind: raw.wind.speed,
        windDir: windDirection(raw.wind.deg),
        clouds: raw.clouds.all,
        pressure: raw.main.pressure,
        visibility: formatVisibility(raw.visibility),
        sunrise: formatObservedAt(raw.sys.sunrise),
        sunset: formatObservedAt(raw.sys.sunset),
        observedAt: formatObservedAt(raw.dt),
      },
    }
    coord.value = raw.coord
    console.log('[Axios] 상세 페이지 실시간 데이터 동기화 완료:', city.value)
    initMap()
    loadExtras(base, raw.timezone)
  } catch (error) {
    console.error('[Axios] 상세 정보 연동 실패, 목데이터로 표시합니다:', error)
    city.value = { ...base, temp: base.mockTemp, status: base.mockStatus, detail: makeMockDetail(base.mockTemp) }
  } finally {
    isLoading.value = false
    showSkeleton.value = false
  }
})

// 아카이브 데모처럼 다른 화면에서 넘어왔다면 그 자리(스크롤 위치까지)로 되돌아간다.
// 주소를 직접 열어 히스토리가 없을 때만 홈으로 보낸다.
// 확장 데이터 — 지도 좌표, 24시간 예보, 대기질
const coord = ref(null)
const forecast = ref([])
const air = ref(null)
const mapEl = ref(null)
let map = null

const AQI_LABEL = { 1: '좋음', 2: '보통', 3: '민감군 주의', 4: '나쁨', 5: '매우 나쁨' }
const AQI_COLOR = {
  1: 'var(--ok)',
  2: 'var(--mild)',
  3: 'var(--sun)',
  4: 'var(--hot)',
  5: 'var(--hot)',
}

const pmColor = (value, badAt) => (value >= badAt ? 'var(--hot)' : value >= badAt / 2 ? 'var(--sun)' : 'var(--ok)')

// 미니멀 흑백 타일(CARTO Positron) 위에 잉크 점 하나
const initMap = async () => {
  await nextTick()
  if (!mapEl.value || map) return
  map = L.map(mapEl.value, {
    center: [coord.value.lat, coord.value.lon],
    zoom: 10,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false,
    attributionControl: true,
  })
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
  }).addTo(map)
  L.circleMarker([coord.value.lat, coord.value.lon], {
    radius: 7,
    color: '#111111',
    weight: 2,
    fillColor: '#111111',
    fillOpacity: 0.9,
  }).addTo(map)
}

// 예보(3시간 간격 8구간)와 대기질을 함께 불러온다
const loadExtras = async (base, tzOffset) => {
  try {
    const data = await fetchForecast(base.english)
    forecast.value = data.list.map((slot) => ({
      label: `${new Date((slot.dt + tzOffset) * 1000).getUTCHours()}시`,
      temp: Math.round(slot.main.temp),
      pop: Math.round((slot.pop ?? 0) * 100),
    }))
  } catch (error) {
    console.error('[Axios] 예보 조회 실패:', error)
  }
  try {
    if (coord.value) {
      const data = await fetchAirQuality(coord.value.lat, coord.value.lon)
      const row = data.list?.[0]
      if (row) {
        air.value = {
          aqi: row.main.aqi,
          pm25: Math.round(row.components.pm2_5),
          pm10: Math.round(row.components.pm10),
        }
      }
    }
  } catch (error) {
    console.error('[Axios] 대기질 조회 실패:', error)
  }
}

onBeforeUnmount(() => {
  map?.remove()
})

const goBack = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    // 직접 진입이면 자기 동선의 홈으로 돌아간다
    router.push(route.path.startsWith('/accessible') ? '/accessible' : '/')
  }
}

// 전역 단위 설정 — 원본은 섭씨로 두고 표시할 때만 변환한다
const configStore = useConfigStore()
const toDisplay = (celsius) =>
  configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius)

const displayTemp = computed(() => (city.value ? toDisplay(city.value.temp) : 0))
const displayFeels = computed(() => (city.value ? toDisplay(city.value.detail.feels) : 0))

// 기온 게이지 — 단위와 무관하게 섭씨 원본 기준 0~50도 비율로 환산한다
const gaugePercent = computed(() => {
  if (!city.value) return 0
  return Math.min(100, Math.max(0, (city.value.temp / 50) * 100))
})

// 기온 구간에 따라 게이지 색을 맞춘다
const gaugeColor = computed(() => {
  if (!city.value) return 'var(--mild)'
  if (city.value.temp >= 25) return 'var(--hot)'
  if (city.value.temp >= 20) return 'var(--mild)'
  return 'var(--cool)'
})
</script>

<template>
  <div class="detail">
    <!-- 존재하는 도시: 상세 관측 정보 -->
    <template v-if="city">
      <header class="detail-head">
        <!-- 도시 랜드마크가 낮은 알파로 헤더 뒤에 깔린다 -->
        <CityLandmark :city-id="city.id" class="landmark-bg" />

        <p class="detail-code">{{ city.id }} 기준 {{ city.detail.observedAt }} 관측</p>
        <h1 class="detail-title">
          {{ city.name }} <span class="detail-status">{{ city.status }}</span>
        </h1>

        <div class="temp-row">
          <WeatherGlyph :status="city.glyph || city.status" :size="56" />
          <p class="detail-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
        </div>

        <!-- 기온 게이지: 0~50도 범위에서 현재 기온 위치를 보여준다 -->
        <div class="temp-gauge">
          <el-progress
            class="gauge"
            :percentage="gaugePercent"
            :color="gaugeColor"
            :stroke-width="6"
            :show-text="false"
          />
          <div class="gauge-scale">
            <span>0°</span>
            <span>25°</span>
            <span>50°</span>
          </div>
        </div>
      </header>

      <ul class="obs-grid">
        <li class="obs-item">
          <span class="obs-label">체감 온도</span>
          <span class="obs-value">{{ displayFeels }}{{ configStore.unitSymbol }}</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">습도</span>
          <span class="obs-value">{{ city.detail.humidity }}%</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">바람</span>
          <span class="obs-value">{{ city.detail.wind }}m/s {{ city.detail.windDir }}</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">구름량</span>
          <span class="obs-value">{{ city.detail.clouds }}%</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">기압</span>
          <span class="obs-value">{{ city.detail.pressure }}hPa</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">가시거리</span>
          <span class="obs-value">{{ city.detail.visibility }}</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">일출</span>
          <span class="obs-value">{{ city.detail.sunrise }}</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">일몰</span>
          <span class="obs-value">{{ city.detail.sunset }}</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">날씨 상태</span>
          <span class="obs-value">{{ city.status }}</span>
        </li>
      </ul>

      <!-- 앞으로 24시간 — 기온 라인과 강수확률 바 -->
      <section v-if="forecast.length" class="extra">
        <p class="extra-title">앞으로 24시간</p>
        <ForecastChart :points="forecast" />
      </section>

      <!-- 대기질 — Air Pollution API -->
      <section v-if="air" class="extra">
        <p class="extra-title">
          대기질
          <span class="aqi-badge" :style="{ color: AQI_COLOR[air.aqi] }">{{ AQI_LABEL[air.aqi] }}</span>
        </p>
        <div class="air-row">
          <span class="air-label">미세먼지 PM10</span>
          <el-progress
            class="air-bar"
            :percentage="Math.min(100, (air.pm10 / 150) * 100)"
            :color="pmColor(air.pm10, 150)"
            :stroke-width="6"
            :show-text="false"
          />
          <span class="air-value">{{ air.pm10 }}㎍/㎥</span>
        </div>
        <div class="air-row">
          <span class="air-label">초미세먼지 PM2.5</span>
          <el-progress
            class="air-bar"
            :percentage="Math.min(100, (air.pm25 / 75) * 100)"
            :color="pmColor(air.pm25, 75)"
            :stroke-width="6"
            :show-text="false"
          />
          <span class="air-value">{{ air.pm25 }}㎍/㎥</span>
        </div>
      </section>

      <!-- 위치 — 미니멀 흑백 지도 -->
      <section v-if="coord" class="extra">
        <p class="extra-title">위치</p>
        <div ref="mapEl" class="map"></div>
      </section>
    </template>

    <!-- 로딩 중 스켈레톤 -->
    <el-skeleton v-else-if="showSkeleton" class="detail-sk" animated :rows="7" />

    <!-- 존재하지 않는 도시 코드로 접근한 경우 -->
    <div v-else class="detail-empty">
      <p class="empty-code">{{ route.params.cityId }}</p>
      <p>해당 도시의 관측 정보를 찾을 수 없습니다.</p>
    </div>

    <el-button type="primary" size="large" class="btn-back" @click="goBack">
      ← 이전 화면으로 돌아가기
    </el-button>
  </div>
</template>

<style scoped>
.detail {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.detail-head {
  position: relative;
  border-bottom: 2px solid var(--line-strong);
  padding-bottom: var(--s3);
  margin-bottom: var(--s3);
}

/* 랜드마크 라인 드로잉 — 잉크색을 낮은 알파로 */
.landmark-bg {
  position: absolute;
  right: -8px;
  bottom: var(--s3);
  width: 300px;
  color: var(--ink);
  opacity: 0.12;
  pointer-events: none;
}

/* 페이지에 들어오면 랜드마크가 한 번 그려진다 */
.landmark-bg :deep(path) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: detail-draw 1.6s ease 0.2s forwards;
}

@keyframes detail-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.detail-code {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--s1);
}

.detail-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.detail-status {
  font-size: 15px;
  font-weight: 400;
  color: var(--muted);
  margin-left: 8px;
}

.temp-row {
  display: flex;
  align-items: center;
  gap: var(--s2);
}

.detail-temp {
  font-size: 64px;
  font-weight: 200;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

/* 기온 게이지 */
.temp-gauge {
  margin-top: var(--s2);
  max-width: 320px;
}

/* el-progress를 기존 게이지 톤에 맞춘다 */
.gauge :deep(.el-progress-bar__outer) {
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: 0;
}

.gauge :deep(.el-progress-bar__inner) {
  border-radius: 0;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.gauge-scale {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 10.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.obs-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--s1);
  margin-bottom: var(--s4);
}

.obs-item {
  border: 1px solid var(--line);
  background: var(--paper);
  padding: var(--s2);
  display: grid;
  gap: 4px;
}

.obs-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-transform: uppercase;
}

.obs-value {
  font-size: 20px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* 스켈레톤 */
.detail-sk {
  margin-bottom: var(--s4);
}

/* 확장 섹션 공통 */
.extra {
  margin-bottom: var(--s4);
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s2);
}

.extra-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding-bottom: var(--s1);
  margin-bottom: var(--s2);
  border-bottom: 1px solid var(--line-strong);
}

.aqi-badge {
  margin-left: 8px;
  font-size: 12px;
}

.air-row {
  display: grid;
  grid-template-columns: 120px 1fr 76px;
  align-items: center;
  gap: var(--s2);
  margin-bottom: 10px;
}

.air-label {
  font-size: 12px;
  color: var(--muted);
}

.air-value {
  font-size: 12.5px;
  font-weight: 600;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.air-bar :deep(.el-progress-bar__outer) {
  background: var(--canvas);
  border: 1px solid var(--line);
  border-radius: 0;
}

.air-bar :deep(.el-progress-bar__inner) {
  border-radius: 0;
}

.map {
  height: 240px;
  border: 1px solid var(--line);
}

.map :deep(.leaflet-container) {
  font-family: var(--font-sans);
}

.detail-empty {
  border: 1px dashed var(--line);
  padding: var(--s6) var(--s3);
  text-align: center;
  font-size: 14px;
  margin-bottom: var(--s4);
}

.empty-code {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--hot);
  margin-bottom: var(--s1);
}

.btn-back {
  font-weight: 600;
}

@media (max-width: 560px) {
  .obs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
