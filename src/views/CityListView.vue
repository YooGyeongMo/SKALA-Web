<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCountryByCode } from '@/data/countries'
import { hasApiKey, fetchCityWeather, mapMainToGlyph, normalizeDescription } from '@/api/openWeather'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import BaseDashboardCard from '@/practices/component/BaseDashboardCard.vue'
import SearchBar from '@/practices/component/SearchBar.vue'
import WeatherCard from '@/practices/component/WeatherCard.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'

const route = useRoute()
const router = useRouter()

// 동적 파라미터로 나라를 찾는다. 없는 코드는 안내 화면으로 처리한다
const country = findCountryByCode(route.params.countryCode)

// 목데이터로 먼저 그리고, 키가 있으면 실측값으로 교체한다
const weatherList = ref(
  country
    ? country.cities.map((c) => ({ ...c, temp: c.mockTemp, status: c.mockStatus, glyph: null }))
    : [],
)

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

const isLoading = ref(false)
const dataSource = ref('mock')

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
    }))
    dataSource.value = 'live'
  } catch (error) {
    console.error('[Axios] 도시 실황 연동 실패, 목데이터로 표시합니다:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(loadCities)

const goDetail = (cityId) => {
  router.push('/weather/' + cityId)
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="cities">
    <template v-if="country">
      <header class="cities-head">
        <CountryEmblem :country-code="country.code" class="head-emblem" />
        <p class="head-en">{{ country.english }}</p>
        <h1 class="head-title">{{ country.name }} 대표 도시</h1>
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

      <BaseDashboardCard>
        <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
      </BaseDashboardCard>

      <BaseDashboardCard>
        <template #header>도시별 날씨 현황</template>

        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
        >
          <template #actions="{ city }">
            <button class="btn-detail" @click="goDetail(city.id)">상세보기</button>
          </template>
        </WeatherCard>

        <p v-if="filteredWeatherList.length === 0" class="empty-result">
          검색 결과와 일치하는 도시가 없습니다.
        </p>

        <template #footer>총 {{ filteredWeatherList.length }}개 도시 표시 중</template>
      </BaseDashboardCard>

      <div class="status-bar">
        <span class="status-label">Status</span>
        <span class="status-text">{{ selectedCityInfo }}</span>
      </div>
    </template>

    <div v-else class="cities-empty">
      <p>등록되지 않은 나라 코드입니다.</p>
      <button class="btn-back" @click="goHome">← 나라 선택으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.cities {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
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
  opacity: 0.55;
  pointer-events: none;
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

.btn-detail {
  padding: 4px 12px;
  font-size: 12px;
  background: var(--paper);
  border: 1px solid var(--line-strong);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-detail:hover {
  background: var(--ink);
  color: var(--paper);
}

.empty-result {
  border: 1px dashed var(--line);
  padding: var(--s2);
  text-align: center;
  font-size: 13px;
  color: var(--hot);
}

.status-bar {
  display: flex;
  align-items: center;
  gap: var(--s2);
  background: linear-gradient(180deg, rgba(38, 38, 38, 0.92), rgba(12, 12, 12, 0.94));
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  border-radius: 10px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4),
    0 6px 18px rgba(17, 17, 17, 0.18);
  color: var(--paper);
  padding: 11px var(--s2);
  font-size: 13px;
}

.status-label {
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.45);
}

.status-text {
  color: #ffffff;
  font-weight: 700;
  letter-spacing: -0.01em;
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
