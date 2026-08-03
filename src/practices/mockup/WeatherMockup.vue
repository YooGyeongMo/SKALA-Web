<script setup>
import { ref } from 'vue'

// 가상의 백엔드 날씨 데이터 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  // 3단계 라벨(선선함 구간) 확인용으로 추가
  { id: 'city_04', name: '제주', temp: 18, status: '흐림' },
])

// 검색어 상태
// v-model은 한글(IME) 조합이 끝나야 반영되므로,
// 타이핑 즉시 동기화가 필요할 때는 :value + @input 조합을 쓴다
const searchQuery = ref('')

// [튜닝] v-model.trim.lazy 비교용 검색어
// - @input: 키 입력마다 즉시 반영
// - .lazy: input 대신 change 이벤트(포커스 아웃/Enter) 시점에 반영
// - .trim: 반영될 때 앞뒤 공백 자동 제거
const lazyQuery = ref('')

// [튜닝] v-memo 리렌더링 횟수 확인용 카운터
// 반응형으로 만들면 카운트 갱신이 다시 렌더를 부르므로 일반 객체를 쓴다
const renderCounts = {}
const logCardRender = (name) => {
  renderCounts[name] = (renderCounts[name] || 0) + 1
  console.log(`[v-memo] ${name} 카드 렌더 ${renderCounts[name]}회`)
  return '' // 화면에는 아무것도 출력하지 않는다
}

// 상태바 문구
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 상세보기 알림 — 카드 클릭과 겹치지 않도록 버튼에서 @click.stop으로 호출한다
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="mockup">
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

      <!-- [튜닝] v-model.trim.lazy 동작 비교
           위 입력은 타이핑 즉시 반영되고, 아래 입력은 Enter나 포커스 아웃 시점에 반영된다 -->
      <input
        v-model.trim.lazy="lazyQuery"
        type="text"
        placeholder="v-model.trim.lazy 비교 (Enter/포커스 아웃 시 반영)"
        class="search-input compare"
      />
      <p class="search-echo">
        지연 반영된 값: <strong>{{ lazyQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3 class="box-title">지역별 날씨 현황</h3>

      <!-- 배열 렌더링: :key에는 반드시 고유 id를 바인딩한다 -->
      <!-- [튜닝] v-memo: temp/status가 그대로면 이 카드의 DOM 패치를 건너뛴다.
           검색어 타이핑으로 컴포넌트가 다시 렌더돼도 카드 렌더 로그가 늘지 않는 것으로 확인 -->
      <article
        v-for="item in weatherList"
        :key="item.id"
        v-memo="[item.temp, item.status]"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        {{ logCardRender(item.name) }}
        <div class="card-main">
          <h4 class="city-name">
            {{ item.name }} <span class="city-status">{{ item.status }}</span>
          </h4>
          <p class="city-temp">{{ item.temp }}°C</p>
        </div>

        <!-- 조건부 렌더링: v-else-if로 3단계 분기 (튜닝) -->
        <span v-if="item.temp >= 25" class="chip hot">🔥 더움 (25도 이상)</span>
        <span v-else-if="item.temp >= 20" class="chip mild">🌤 보통 (20~24도)</span>
        <span v-else class="chip cool">❄️ 선선함 (20도 미만)</span>

        <!-- .stop: 부모(카드)로의 클릭 버블링을 차단한다 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">상세보기</button>
      </article>
    </section>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.mockup {
  display: grid;
  gap: var(--s3);
  max-width: 560px;
}

/* 회색 캔버스 위에서 흰 패널로 그룹을 분리한다 */
.search-box,
.list-box {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s2);
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

.search-input.compare {
  margin-top: var(--s2);
  border-color: var(--line);
  border-style: dashed;
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
  box-shadow: 3px 3px 0 rgba(17, 17, 17, 0.08);
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
  background: var(--paper);
  border: 1px solid var(--line);
  border-left: 3px solid var(--line-strong);
  padding: 10px var(--s2);
  font-size: 13px;
  font-weight: 500;
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

/* 라벨 칩 — 옅은 톤 배경 + 진한 글자로 차분하게 */
.chip {
  display: inline-block;
  margin-top: var(--s1);
  padding: 3px 10px;
  font-size: 12px;
}

.chip.hot {
  background: var(--hot-bg);
  color: var(--hot);
}

.chip.mild {
  background: var(--mild-bg);
  color: var(--mild);
}

.chip.cool {
  background: var(--cool-bg);
  color: var(--cool);
}
</style>
