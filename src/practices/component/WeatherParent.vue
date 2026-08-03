<script setup>
import { ref, watch } from 'vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 모든 반응형 데이터의 소유권은 부모가 유지한다.
// 자식은 props로 받고 emits로 알릴 뿐, 상태를 직접 바꾸지 않는다.
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 18, status: '흐림' },
])

const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 과제2에서 추출한 컴포저블을 그대로 재사용한다
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 상태 바 문구 변경 → "${newInfo}"`)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="parent">
    <!-- [참고] slot으로 넘긴 SearchBar/WeatherCard는 시각적으로는 BaseDashboardCard
         안에 있지만, 스크립트상 부모 스코프에서 컴파일되므로
         부모의 상태·핸들러와 직접 바인딩/통신할 수 있다 -->
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <!-- [튜닝] header/footer Named Slot으로 제목과 요약을 주입한다 -->
    <BaseDashboardCard>
      <template #header>지역별 날씨 현황</template>

      <!-- [튜닝] Scoped Slot으로 상세보기 영역을 부모가 직접 구성한다.
           슬롯 내용은 부모 스코프에서 컴파일되므로 부모의 showDetail을 바로 호출할 수 있다.
           이 template 블록을 지우면 WeatherCard의 기본 상세보기 버튼이 나타난다 -->
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(msg) => (selectedCityInfo = msg)"
        @click-detail="showDetail"
      >
        <template #actions="{ city }">
          <button class="btn-report" @click="showDetail(city.name, city.status)">
            {{ city.name }} 리포트
          </button>
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
.parent {
  display: grid;
  gap: var(--s1);
  max-width: 560px;
}

/* 슬롯으로 주입한 버튼 — 부모 스코프이므로 부모의 scoped 스타일이 적용된다 */
.btn-report {
  padding: 4px 12px;
  font-size: 12px;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--line-strong);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-report:hover {
  background: var(--paper);
  color: var(--ink);
}

.empty-result {
  border: 1px dashed var(--line);
  padding: var(--s2);
  text-align: center;
  font-size: 13px;
  color: var(--hot);
}

/* 상태바 — 카드와 성격이 다른 요소라 검정 스트립으로 분리 */
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
