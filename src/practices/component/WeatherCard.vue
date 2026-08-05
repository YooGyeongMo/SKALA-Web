<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { withIGa } from '@/utils/korean'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CityLandmark from '@/components/weather/CityLandmark.vue'
import TierMark from '@/components/weather/TierMark.vue'

// 선택된 도시 객체를 부모로부터 단방향으로 전달받는다 (props)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 전달한다 (emits)
const emit = defineEmits(['select-card', 'click-detail'])

// 전역 단위 설정에 따라 표시 온도를 변환한다.
// 원본 데이터는 항상 섭씨로 유지하고, 화면에 그릴 때만 화씨로 계산한다
const configStore = useConfigStore()
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return Math.round(rawTemp) // 실시간 데이터는 소수점이 오므로 반올림해 표시한다
})
</script>

<template>
  <article
    class="weather-card"
    @click="emit('select-card', `${withIGa(cityItem.name)} 선택되었습니다.`)"
  >
    <!-- 도시 랜드마크가 카드 배경에 아주 옅게 깔리고, 호버하면 살짝 드러난다 -->
    <CityLandmark :city-id="cityItem.id" class="card-landmark" />

    <div class="card-main">
      <h4 class="city-name">
        {{ cityItem.name }} <span class="city-status">{{ cityItem.status }}</span>
        <span v-if="cityItem.localTime" class="city-time">{{ cityItem.localTime }}</span>
      </h4>
      <div class="temp-wrap">
        <WeatherGlyph :status="cityItem.glyph || cityItem.status" :size="30" />
        <p class="city-temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
      </div>
    </div>

    <!-- 구간 판정은 항상 섭씨 원본 기준 — 표시 단위와 무관하게 라벨이 유지된다 -->
    <el-tag v-if="cityItem.temp >= 25" class="chip hot" type="danger" effect="light" size="small">
      <TierMark tier="hot" />더움 (25도 이상)
    </el-tag>
    <el-tag
      v-else-if="cityItem.temp >= 20"
      class="chip mild"
      type="info"
      effect="light"
      size="small"
    >
      <TierMark tier="mild" />보통 (20~24도)
    </el-tag>
    <el-tag v-else class="chip cool" type="primary" effect="light" size="small">
      <TierMark tier="cool" />선선함 (20도 미만)
    </el-tag>

    <!-- [튜닝] Scoped Slot: 상세보기 버튼 영역을 부모가 커스터마이징할 수 있다.
         :city로 현재 카드의 도시 데이터를 슬롯 밖(부모)에 넘겨준다.
         부모가 슬롯을 채우지 않으면 아래 기본 상세보기 버튼이 렌더링된다.
         래퍼의 @click.stop으로 카드 select-card와의 버블링을 차단한다 -->
    <div class="card-actions" @click.stop>
      <slot name="actions" :city="cityItem">
        <button class="btn-detail" @click="emit('click-detail', cityItem.name, cityItem.status)">
          상세보기
        </button>
      </slot>
    </div>
  </article>
</template>

<style scoped>
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

.card-landmark {
  position: absolute;
  right: 96px;
  bottom: 6px;
  width: 150px;
  color: var(--ink);
  opacity: 0.11;
  transition: opacity 0.25s ease;
  pointer-events: none;
}

.weather-card:hover .card-landmark {
  opacity: 0.24;
}

/* 호버하면 랜드마크 선이 처음부터 그려진다 (pathLength 1 기준) */
.weather-card:hover .card-landmark :deep(path) {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: landmark-draw 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes landmark-draw {
  to {
    stroke-dashoffset: 0;
  }
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

.city-time {
  margin-left: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 400;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.temp-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.city-temp {
  font-size: 20px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

/* el-tag 위에 기존 칩 색을 입힌다 (마커는 TierMark 글리프) */
.chip {
  margin-top: var(--s1);
  border: none;
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

.card-actions {
  position: absolute;
  right: var(--s2);
  bottom: var(--s2);
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
</style>
