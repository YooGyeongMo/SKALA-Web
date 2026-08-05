<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCountryByCode } from '@/data/countries'
import {
  hasApiKey,
  hasCachedCity,
  fetchCityWeather,
  mapMainToGlyph,
  normalizeDescription,
} from '@/api/openWeather'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import { tzClock, MOCK_TZ } from '@/utils/time'
import { ElMessage } from 'element-plus'
import WeatherCard from '@/practices/component/WeatherCard.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'

const route = useRoute()
const router = useRouter()

// 동적 파라미터로 나라를 찾는다. 없는 코드는 안내 화면으로 처리한다
const country = findCountryByCode(route.params.countryCode)

// 목데이터로 먼저 그리고, 키가 있으면 실측값으로 교체한다
const weatherList = ref(
  country
    ? country.cities.map((c) => ({
        ...c,
        temp: c.mockTemp,
        status: c.mockStatus,
        glyph: null,
        tz: MOCK_TZ[country.code],
      }))
    : [],
)

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

const isLoading = ref(false)
const dataSource = ref('mock')

// 스켈레톤 원칙: 캐시가 전부 따뜻하면 즉시 렌더, 첫 로딩이면 최소 1.3초
const cacheWarm =
  Boolean(country) && hasApiKey && country.cities.every((c) => hasCachedCity(c.english))
const fetchDone = ref(!hasApiKey || !country)
const minDone = ref(cacheWarm)
const loaded = computed(() => fetchDone.value && minDone.value)

// 도시 10곳의 실황을 병렬로 받아온다
const loadCities = async () => {
  if (!country || !hasApiKey) return
  isLoading.value = true
  try {
    const results = await Promise.all(country.cities.map((c) => fetchCityWeather(c.english)))
    weatherList.value = country.cities.map((c, i) => ({
      ...c,
      temp: results[i].main.temp,
      status: normalizeDescription(results[i].weather[0].description),
      glyph: mapMainToGlyph(results[i].weather[0].main),
      tz: results[i].timezone,
    }))
    dataSource.value = 'live'
  } catch (error) {
    console.error('[Axios] 도시 실황 연동 실패, 목데이터로 표시합니다:', error)
  } finally {
    isLoading.value = false
    fetchDone.value = true
  }
}

// 도시별 현지 시간 — 30초마다 갱신한다 (미국처럼 한 나라 안에서도 시간대가 갈린다)
const now = ref(Date.now())
let timeTimer = null

// 헤더에 보여줄 나라 현지 시간 — 수도(첫 도시) 기준
const headTime = computed(() => {
  const tz = weatherList.value[0]?.tz ?? 0
  return tzClock(now.value, tz)
})

const displayList = computed(() =>
  filteredWeatherList.value.map((c) => ({ ...c, localTime: tzClock(now.value, c.tz) })),
)

// 카드를 클릭하면 선택 상태를 유지한다 (호버와 같은 강조)
const selectedId = ref(null)

const selectCity = (item, msg) => {
  selectedId.value = item.id
  selectedCityInfo.value = msg
  // ElMessage 토스트로도 알려준다 — 아카이브 07 실습과 같은 기본 동작
  ElMessage({ message: msg, type: 'success', duration: 1500 })
}

onMounted(() => {
  loadCities()
  if (!cacheWarm) {
    setTimeout(() => {
      minDone.value = true
    }, 1300)
  }
  timeTimer = setInterval(() => {
    now.value = Date.now()
  }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(timeTimer)
})

// 접근성 홈에서 들어왔으면 /accessible 프리픽스를 이어가 뎁스를 유지한다
const base = route.path.startsWith('/accessible') ? '/accessible' : ''

const goDetail = (cityId) => {
  router.push(base + '/weather/' + cityId)
}

const goHome = () => {
  router.push(base || '/')
}
</script>

<template>
  <div class="cities">
    <template v-if="country">
      <header class="cities-head">
        <CountryEmblem :country-code="country.code" class="head-emblem colored" />
        <p class="head-en">{{ country.english }}</p>
        <h1 class="head-title">
          {{ country.name }} 대표 도시
          <span class="head-time">
            {{ headTime.slice(0, 2) }}<i class="tick">:</i>{{ headTime.slice(3) }}
          </span>
        </h1>
        <p class="data-source" :class="dataSource">
          {{
            isLoading
              ? '실시간 날씨를 불러오는 중...'
              : dataSource === 'live'
                ? 'OpenWeather 실시간 관측 데이터'
                : '목데이터 표시 중 (API 키 미설정 또는 통신 실패)'
          }}
        </p>
      </header>

      <el-alert
        class="status-alert"
        :title="selectedCityInfo"
        type="success"
        show-icon
        :closable="false"
      />

      <el-card shadow="never" class="panel">
        <template #header>도시 검색</template>
        <el-input v-model="searchQuery" size="large" clearable placeholder="검색할 도시 이름 입력" />
        <p class="search-echo">
          검색 중인 도시: <strong>{{ searchQuery }}</strong>
        </p>
      </el-card>

      <el-card shadow="never" class="panel">
        <template #header>도시별 날씨 현황</template>

        <div v-if="!loaded" class="city-grid">
          <div v-for="n in 6" :key="n" class="sk-cell">
            <el-skeleton animated :rows="2" />
          </div>
        </div>

        <div v-else class="city-grid">
        <WeatherCard
          v-for="(item, i) in displayList"
          :key="item.id"
          :city-item="item"
          :style="{ '--i': i }"
          :class="{ selected: selectedId === item.id }"
          @select-card="(msg) => selectCity(item, msg)"
        >
          <template #actions="{ city }">
            <el-button size="small" @click="goDetail(city.id)">상세보기</el-button>
          </template>
        </WeatherCard>
        </div>

        <el-empty
          v-if="loaded && filteredWeatherList.length === 0"
          description="검색 결과와 일치하는 도시가 없습니다"
          :image-size="60"
        />

        <div class="panel-footer">총 {{ filteredWeatherList.length }}개 도시 표시 중</div>
      </el-card>
    </template>

    <div v-else class="cities-empty">
      <p>등록되지 않은 나라 코드입니다.</p>
      <button class="btn-back" @click="goHome">← 나라 선택으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.cities {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

/* 도시 카드를 가로 그리드로 — 좁은 화면에서는 자동으로 1열이 된다 */
.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--s1);
}

.city-grid :deep(.weather-card) {
  margin-bottom: 0;
  animation: card-rise 0.45s ease backwards;
  animation-delay: calc(var(--i, 0) * 55ms);
}

/* 선택된 카드 — 호버와 같은 강조가 유지된다 */
.city-grid :deep(.weather-card.selected) {
  border-color: var(--line-strong);
  box-shadow: 3px 3px 0 rgba(17, 17, 17, 0.08);
}

.city-grid :deep(.weather-card.selected .card-landmark) {
  opacity: 0.24;
}

@keyframes card-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

.cities-head {
  position: relative;
  margin-bottom: var(--s4);
}

/* 나라 엠블럼이 헤더 우측에 은은하게 자리한다 */
.head-emblem {
  position: absolute;
  right: 0;
  top: -18px;
  width: 92px;
  pointer-events: none;
}

/* 나라 현지 시간 — 제목 옆에 작게, 콜론이 깜빡인다 */
.head-time {
  margin-left: 10px;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 400;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  vertical-align: 2px;
}

.head-time .tick {
  font-style: normal;
  animation: colon-blink 1s steps(1) infinite;
}

@keyframes colon-blink {
  50% {
    opacity: 0;
  }
}

.head-en {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.head-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
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

/* 패널 — el-card를 기존 흰 패널 톤에 맞춘다 */
.panel {
  border-color: var(--line);
  margin-bottom: var(--s2);
}

.panel :deep(.el-card__header) {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.search-echo {
  margin-top: var(--s1);
  font-size: 13px;
  color: var(--muted);
}

.search-echo strong {
  color: var(--ink);
}

.panel-footer {
  margin-top: var(--s2);
  padding-top: var(--s1);
  border-top: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
}

.sk-cell {
  padding: var(--s2);
  background: var(--paper);
  border: 1px solid var(--line);
}

/* Element Plus 기본 알림 룩 */
.status-alert {
  margin-bottom: var(--s2);
}

.cities-empty {
  border: 1px dashed var(--line);
  padding: var(--s6) var(--s3);
  text-align: center;
  font-size: 14px;
  display: grid;
  gap: var(--s2);
  justify-items: center;
}

.btn-back {
  padding: 10px var(--s3);
  font-size: 13px;
  font-weight: 600;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--line-strong);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-back:hover {
  background: var(--paper);
  color: var(--ink);
}
</style>
