<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityById, makeMockDetail } from '@/data/countries'
import {
  hasApiKey,
  fetchCityWeather,
  mapMainToGlyph,
  normalizeDescription,
  windDirection,
  formatVisibility,
  formatObservedAt,
} from '@/api/openWeather'
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
    console.log('[Axios] 상세 페이지 실시간 데이터 동기화 완료:', city.value)
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
const goBack = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
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
