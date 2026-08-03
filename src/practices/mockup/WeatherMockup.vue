<script setup>
import { ref } from 'vue'

// 가상의 백엔드 날씨 데이터 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
</script>

<template>
  <div class="mockup">
    <section class="list-box">
      <h3 class="box-title">지역별 날씨 현황</h3>

      <!-- 배열 렌더링: :key에는 반드시 고유 id를 바인딩한다 -->
      <article v-for="item in weatherList" :key="item.id" class="weather-card">
        <div class="card-main">
          <h4 class="city-name">
            {{ item.name }} <span class="city-status">{{ item.status }}</span>
          </h4>
          <p class="city-temp">{{ item.temp }}°C</p>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.mockup {
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

.weather-card {
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s2);
  margin-bottom: var(--s1);
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
</style>
