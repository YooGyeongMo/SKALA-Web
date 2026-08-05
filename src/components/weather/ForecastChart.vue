<script setup>
import { computed } from 'vue'

// 앞으로 24시간(3시간 간격 8구간) 미니멀 차트
// 기온은 잉크 라인, 강수확률은 아래쪽 파란 바로 그린다. 순수 SVG.
const props = defineProps({
  points: {
    type: Array,
    required: true, // { label, temp, pop } 8개
  },
})

const W = 640
const H = 150
const PAD = 26
const BAR_ZONE = 44 // 아래쪽 강수확률 바 영역 높이

const xAt = (i) => PAD + (i * (W - PAD * 2)) / (props.points.length - 1)

const tempLine = computed(() => {
  const temps = props.points.map((p) => p.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const span = Math.max(max - min, 2)
  const top = 18
  const bottom = H - BAR_ZONE - 16
  return props.points.map((p, i) => ({
    x: xAt(i),
    y: bottom - ((p.temp - min) / span) * (bottom - top),
    temp: p.temp,
  }))
})

const polyline = computed(() => tempLine.value.map((p) => `${p.x},${p.y}`).join(' '))
</script>

<template>
  <svg :viewBox="`0 0 ${W} ${H}`" class="chart" role="img" aria-label="24시간 기온과 강수확률">
    <!-- 강수확률 바 -->
    <g>
      <rect
        v-for="(p, i) in points"
        :key="'b' + i"
        :x="xAt(i) - 9"
        :y="H - 14 - (p.pop / 100) * BAR_ZONE"
        width="18"
        :height="(p.pop / 100) * BAR_ZONE"
        class="pop-bar"
      />
    </g>

    <!-- 기온 라인과 점, 값 -->
    <polyline :points="polyline" class="temp-line" />
    <g v-for="(p, i) in tempLine" :key="'t' + i">
      <circle :cx="p.x" :cy="p.y" r="3" class="temp-dot" />
      <text :x="p.x" :y="p.y - 9" text-anchor="middle" class="temp-text">{{ p.temp }}°</text>
    </g>

    <!-- 시간 라벨과 강수확률 값 -->
    <g v-for="(p, i) in points" :key="'l' + i">
      <text :x="xAt(i)" :y="H - 2" text-anchor="middle" class="axis-text">{{ p.label }}</text>
      <text
        v-if="p.pop > 0"
        :x="xAt(i)"
        :y="H - 18 - (p.pop / 100) * BAR_ZONE"
        text-anchor="middle"
        class="pop-text"
      >
        {{ p.pop }}%
      </text>
    </g>
  </svg>
</template>

<style scoped>
.chart {
  width: 100%;
  height: auto;
  display: block;
}

.temp-line {
  fill: none;
  stroke: var(--ink);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.temp-dot {
  fill: var(--paper);
  stroke: var(--ink);
  stroke-width: 2;
}

.temp-text {
  font-size: 11px;
  font-weight: 600;
  fill: var(--ink);
  font-variant-numeric: tabular-nums;
}

.pop-bar {
  fill: rgba(42, 92, 168, 0.28);
}

.pop-text {
  font-size: 9.5px;
  fill: var(--cool);
  font-variant-numeric: tabular-nums;
}

.axis-text {
  font-size: 10px;
  fill: var(--muted);
}
</style>
