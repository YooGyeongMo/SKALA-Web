<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 도시 코드별 상세 기상관측 Mock Data (API 연동 전 임시)
const mockObservations = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', feels: 30, humidity: 42, wind: 2.4, rain: 0, dust: '보통', observedAt: '오늘 14:00' },
  { id: 'city_02', name: '수원', temp: 24, status: '비', feels: 23, humidity: 88, wind: 4.1, rain: 80, dust: '좋음', observedAt: '오늘 14:00' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', feels: 27, humidity: 65, wind: 5.8, rain: 20, dust: '보통', observedAt: '오늘 14:00' },
  { id: 'city_04', name: '제주', temp: 18, status: '흐림', feels: 17, humidity: 74, wind: 7.2, rain: 40, dust: '좋음', observedAt: '오늘 14:00' },
]

const route = useRoute()
const router = useRouter()
const city = ref(null)

// Mount 시점에 동적 경로 파라미터(:cityId)로 Mock Data에서 도시 객체를 선택한다
onMounted(() => {
  const { cityId } = route.params
  city.value = mockObservations.find((item) => item.id === cityId) ?? null
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail">
    <!-- 존재하는 도시: 상세 관측 정보 -->
    <template v-if="city">
      <header class="detail-head">
        <p class="detail-code">{{ city.id }} · {{ city.observedAt }} 관측</p>
        <h1 class="detail-title">
          {{ city.name }} <span class="detail-status">{{ city.status }}</span>
        </h1>
        <p class="detail-temp">{{ city.temp }}°C</p>
      </header>

      <ul class="obs-grid">
        <li class="obs-item">
          <span class="obs-label">체감 온도</span>
          <span class="obs-value">{{ city.feels }}°C</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">습도</span>
          <span class="obs-value">{{ city.humidity }}%</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">바람</span>
          <span class="obs-value">{{ city.wind }}m/s</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">강수 확률</span>
          <span class="obs-value">{{ city.rain }}%</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">미세먼지</span>
          <span class="obs-value">{{ city.dust }}</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">날씨 상태</span>
          <span class="obs-value">{{ city.status }}</span>
        </li>
      </ul>
    </template>

    <!-- 존재하지 않는 도시 코드로 접근한 경우 -->
    <div v-else class="detail-empty">
      <p class="empty-code">{{ route.params.cityId }}</p>
      <p>해당 도시의 관측 정보를 찾을 수 없습니다.</p>
    </div>

    <button class="btn-back" @click="goBack">← 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.detail-head {
  border-bottom: 2px solid var(--line-strong);
  padding-bottom: var(--s3);
  margin-bottom: var(--s3);
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

.detail-temp {
  font-size: 64px;
  font-weight: 200;
  line-height: 1.1;
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

@media (max-width: 560px) {
  .obs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
