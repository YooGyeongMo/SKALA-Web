<script setup>
import { ref, watch } from 'vue'
import { useWeatherSearch } from '@/composables/useWeatherSearch'

// [1일차 동일] 가상의 백엔드 날씨 데이터
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 18, status: '흐림' },
])

// [1일차 동일] 상태바 문구
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// [튜닝] 검색어 + computed 필터 + watchEffect 추적을 컴포저블로 추출해 재사용
const { searchQuery, filteredWeatherList } = useWeatherSearch(weatherList)

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// watch: 감시 대상을 명시하고, 바뀌기 전/후 값을 함께 받는다
// [튜닝] immediate: true — 최초 마운트 시점에도 콜백이 1회 실행된다 (콘솔로 확인)
watch(
  selectedCityInfo,
  (newInfo, oldInfo) => {
    console.log(`[watch] 상태 바 문구 변경: "${oldInfo ?? '(최초 마운트)'}" → "${newInfo}"`)
  },
  { immediate: true },
)

</script>

<template>
  <div class="composition">
    <section class="search-box">
      <h3 class="box-title">도시 검색</h3>
      <input
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        class="search-input"
        @input="(e) => (searchQuery = e.target.value)"
      />
      <p class="search-echo">
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3 class="box-title">지역별 날씨 현황</h3>

      <!-- 원본 대신 computed 결과를 렌더링한다
           빈 검색어 → 원본 전체 / 일치 → 해당 데이터만 -->
      <article
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <div class="card-main">
          <h4 class="city-name">
            {{ item.name }} <span class="city-status">{{ item.status }}</span>
          </h4>
          <p class="city-temp">{{ item.temp }}°C</p>
        </div>

        <span v-if="item.temp >= 25" class="chip hot">🔥 더움 (25도 이상)</span>
        <span v-else-if="item.temp >= 20" class="chip mild">🌤 보통 (20~24도)</span>
        <span v-else class="chip cool">❄️ 선선함 (20도 미만)</span>

        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </article>

      <!-- 불일치: 검색 결과가 없을 때 안내 -->
      <p v-if="filteredWeatherList.length === 0" class="empty-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.composition {
  display: grid;
  gap: var(--s3);
  max-width: 560px;
}

.box-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: var(--s2);
  padding-bottom: var(--s1);
  border-bottom: 1px solid var(--line-strong);
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line-strong);
  background: var(--paper);
  outline: none;
}

.search-input:focus {
  box-shadow: 2px 2px 0 var(--line-strong);
}

.search-echo {
  margin-top: var(--s1);
  font-size: 13px;
  color: var(--muted);
}

.search-echo strong {
  color: var(--ink);
}

.weather-card {
  position: relative;
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s2);
  margin-bottom: var(--s1);
  cursor: pointer;
  transition: border-color 0.15s;
}

.weather-card:hover {
  border-color: var(--line-strong);
}

.card-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.city-name {
  font-size: 15px;
  font-weight: 700;
}

.city-status {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
  margin-left: 6px;
}

.city-temp {
  font-size: 20px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

.chip {
  display: inline-block;
  margin-top: var(--s1);
  padding: 2px 10px;
  font-size: 12px;
  border: 1px solid currentColor;
}

.chip.hot {
  color: var(--hot);
}

.chip.mild {
  color: var(--mild);
}

.chip.cool {
  color: var(--cool);
}

.btn-detail {
  position: absolute;
  right: var(--s2);
  bottom: var(--s2);
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

.status-bar {
  border: 1px solid var(--line-strong);
  border-left: 6px solid var(--line-strong);
  padding: 10px var(--s2);
  font-size: 13px;
  font-weight: 500;
}

.empty-result {
  border: 1px dashed var(--line);
  padding: var(--s2);
  text-align: center;
  font-size: 13px;
  color: var(--hot);
}
</style>
