<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityById } from '@/data/cities'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CityLandmark from '@/components/weather/CityLandmark.vue'

const route = useRoute()
const router = useRouter()
const city = ref(null)

// Mount 시점에 동적 경로 파라미터(:cityId)로 단일 출처에서 도시 객체를 선택한다
onMounted(() => {
  city.value = findCityById(route.params.cityId)
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

// 기온 게이지 — 0~40도 범위를 비율로 환산한다
const gaugePercent = computed(() => {
  if (!city.value) return 0
  return Math.min(100, Math.max(0, (city.value.temp / 40) * 100))
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
          <WeatherGlyph :status="city.status" :size="56" />
          <p class="detail-temp">{{ city.temp }}°C</p>
        </div>

        <!-- 기온 게이지: 0~40도 범위에서 현재 기온 위치를 보여준다 -->
        <div class="temp-gauge">
          <div class="gauge-track">
            <div
              class="gauge-fill"
              :style="{ width: gaugePercent + '%', background: gaugeColor }"
            ></div>
          </div>
          <div class="gauge-scale">
            <span>0°</span>
            <span>20°</span>
            <span>40°</span>
          </div>
        </div>
      </header>

      <ul class="obs-grid">
        <li class="obs-item">
          <span class="obs-label">체감 온도</span>
          <span class="obs-value">{{ city.detail.feels }}°C</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">습도</span>
          <span class="obs-value">{{ city.detail.humidity }}%</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">바람</span>
          <span class="obs-value">{{ city.detail.wind }}m/s</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">강수 확률</span>
          <span class="obs-value">{{ city.detail.rain }}%</span>
        </li>
        <li class="obs-item">
          <span class="obs-label">미세먼지</span>
          <span class="obs-value">{{ city.detail.dust }}</span>
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

    <button class="btn-back" @click="goBack">← 이전 화면으로 돌아가기</button>
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

.gauge-track {
  height: 6px;
  background: var(--canvas);
  border: 1px solid var(--line);
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
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
