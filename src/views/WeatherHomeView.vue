<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { cityList } from '@/data/cities'
import { hasApiKey, fetchCityWeather, mapMainToGlyph, normalizeDescription } from '@/api/openWeather'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import BaseDashboardCard from '@/practices/component/BaseDashboardCard.vue'
import SearchBar from '@/practices/component/SearchBar.vue'
import WeatherCard from '@/practices/component/WeatherCard.vue'

// WeatherParent를 페이지(View)로 옮긴 메인 대시보드.
// 부품 컴포넌트(BaseDashboardCard/SearchBar/WeatherCard)는 과제3 것을 그대로 재사용하고,
// 데이터는 단일 출처(data/cities.js)에서 가져와 상세 페이지와 항상 같은 값을 보게 한다.
const weatherList = ref([...cityList])

// 실시간 연동 상태 — 로딩 여부와 현재 데이터 출처(live/mock)
const isLoading = ref(false)
const dataSource = ref('mock')

// 4개 도시의 실시간 날씨를 병렬로 받아와 목데이터를 교체한다.
// 키가 없거나 통신이 실패하면 목데이터를 그대로 유지한다 (폴백)
const loadRealTimeWeather = async () => {
  if (!hasApiKey) return
  isLoading.value = true
  try {
    const results = await Promise.all(cityList.map((city) => fetchCityWeather(city.english)))
    weatherList.value = cityList.map((city, i) => ({
      ...city,
      temp: results[i].main.temp,
      status: normalizeDescription(results[i].weather[0].description),
      glyph: mapMainToGlyph(results[i].weather[0].main),
    }))
    dataSource.value = 'live'
    console.log('[Axios] 메인 대시보드 실시간 데이터 동기화 완료:', weatherList.value)
  } catch (error) {
    console.error('[Axios] 날씨 API 연동 실패, 목데이터로 표시합니다:', error)
  } finally {
    isLoading.value = false
  }
}

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

// 상세보기: window.alert 대신 Programmatic Navigation으로 상세 페이지 이동
const router = useRouter()
const route = useRoute()
const goDetail = (cityId) => {
  // 데모 맥락(/lessons/home, /lessons/store/home)에서는 상세로 들어가도
  // 현재 경로의 프리픽스를 그대로 유지해 뎁스가 이어진다
  const base = route.path.endsWith('/home') ? route.path.slice(0, -'/home'.length) : ''
  router.push(base + '/weather/' + cityId)
}

// 아카이브 데모는 /lessons/home 처럼 아카이브 하위 경로로 들어온다.
// 경로 자체가 상태라서 내비로 온 일반 홈(/)에는 절대 버튼이 뜨지 않는다
const cameFromArchive = computed(() => route.path.startsWith('/lessons/'))

const goBack = () => {
  router.back()
}

// 최초 마운트 시 주소창의 ?search= 값을 읽어 검색 상태를 복원한다
// 상세 페이지에 다녀오거나 링크를 공유해도 검색 결과가 유지된다
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  // 화면 장착 직후 실시간 데이터를 불러온다
  loadRealTimeWeather()
})

// 타이핑할 때마다 검색어를 쿼리스트링에 반영한다
// push 대신 replace를 써서 글자 하나마다 히스토리가 쌓이는 것을 막는다
watch(searchQuery, (newQuery) => {
  router.replace({
    path: route.path,
    query: { ...route.query, search: newQuery || undefined },
  })
})
</script>

<template>
  <div class="home">
    <!-- 아카이브 데모로 들어온 경우에만 보이는 복귀 버튼 -->
    <button v-if="cameFromArchive" class="btn-back" @click="goBack">
      ← 이전 화면으로 돌아가기
    </button>

    <header class="home-head">
      <h1 class="home-title">날씨 대시보드</h1>
      <p class="home-sub">지역별 실시간 날씨를 한눈에 확인하고, 상세보기를 누르면 관측 정보를 볼 수 있습니다.</p>
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
      <template #header>지역별 날씨 현황</template>

      <!-- Scoped Slot으로 상세보기 버튼을 라우터 이동 버튼으로 교체한다 -->
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
  </div>
</template>

<style scoped>
.home {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.home-head {
  margin-bottom: var(--s4);
}

/* 데이터 출처 캡션 — 실시간이면 초록 점, 목데이터면 회색 점 */
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

/* 상세/404와 같은 디자인의 검정 버튼 */
.btn-back {
  margin-bottom: var(--s3);
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

.home-title {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.home-sub {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
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

/* 은은한 반투명 검정 글래스 — 배경 그라데이션이 살짝 비친다 */
.status-bar {
  display: flex;
  align-items: center;
  gap: var(--s2);
  background: linear-gradient(180deg, rgba(38, 38, 38, 0.92), rgba(12, 12, 12, 0.94));
  backdrop-filter: blur(10px) saturate(1.2);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  border-radius: 10px;
  /* 위쪽 하이라이트와 바깥 그림자로 유리의 두께감을 만든다 */
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
</style>
