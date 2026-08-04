<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import BaseDashboardCard from '@/practices/component/BaseDashboardCard.vue'
import SearchBar from '@/practices/component/SearchBar.vue'
import WeatherCard from '@/practices/component/WeatherCard.vue'

// WeatherParent를 페이지(View)로 옮긴 메인 대시보드.
// 부품 컴포넌트(BaseDashboardCard/SearchBar/WeatherCard)는 과제3 것을 그대로 재사용한다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 18, status: '흐림' },
])

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

// 상세보기: window.alert 대신 Programmatic Navigation으로 상세 페이지 이동
const router = useRouter()
const goDetail = (cityId) => {
  router.push('/weather/' + cityId)
}
</script>

<template>
  <div class="home">
    <header class="home-head">
      <h1 class="home-title">날씨 대시보드</h1>
      <p class="home-sub">지역별 실시간 날씨 현황 · 카드의 상세보기로 관측 정보 확인</p>
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

.status-bar {
  display: flex;
  align-items: center;
  gap: var(--s2);
  background: var(--ink);
  color: var(--paper);
  padding: 10px var(--s2);
  font-size: 13px;
}

.status-label {
  flex-shrink: 0;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.35);
}

.status-text {
  font-weight: 500;
}
</style>
