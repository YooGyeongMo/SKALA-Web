<script setup>
// 날씨 상태별 SVG 글리프
// 이모지 대신 디자인 톤에 맞는 가는 선 아이콘에 은은한 애니메이션을 얹는다
defineProps({
  status: {
    type: String,
    default: '구름', // 맑음 · 비 · 구름 · 흐림
  },
  size: {
    type: Number,
    default: 28,
  },
})
</script>

<template>
  <span class="glyph" :style="{ width: size + 'px', height: size + 'px' }" aria-hidden="true">
    <!-- 맑음: 해 — 광선이 천천히 회전 -->
    <svg v-if="status === '맑음'" viewBox="0 0 32 32">
      <g class="sun-rays">
        <line x1="16" y1="2.5" x2="16" y2="6.5" />
        <line x1="16" y1="25.5" x2="16" y2="29.5" />
        <line x1="2.5" y1="16" x2="6.5" y2="16" />
        <line x1="25.5" y1="16" x2="29.5" y2="16" />
        <line x1="6.4" y1="6.4" x2="9.2" y2="9.2" />
        <line x1="22.8" y1="22.8" x2="25.6" y2="25.6" />
        <line x1="6.4" y1="25.6" x2="9.2" y2="22.8" />
        <line x1="22.8" y1="9.2" x2="25.6" y2="6.4" />
      </g>
      <circle class="sun-core" cx="16" cy="16" r="6" />
    </svg>

    <!-- 비: 구름 아래로 빗방울이 떨어진다 -->
    <svg v-else-if="status === '비'" viewBox="0 0 32 32">
      <path
        class="cloud-line rain-cloud"
        d="M9.5 18.5a4.3 4.3 0 0 1 .6-8.5 6 6 0 0 1 11.6-1 4.6 4.6 0 0 1-.9 9.5z"
      />
      <g class="rain-drops">
        <line class="drop d1" x1="11.5" y1="22" x2="10.5" y2="25.5" />
        <line class="drop d2" x1="16.5" y1="22" x2="15.5" y2="25.5" />
        <line class="drop d3" x1="21.5" y1="22" x2="20.5" y2="25.5" />
      </g>
    </svg>

    <!-- 구름: 두 덩이가 서로 반대로 살짝 떠다닌다 -->
    <svg v-else-if="status === '구름'" viewBox="0 0 32 32">
      <path
        class="cloud-line cloud-back"
        d="M12 12.5a3.4 3.4 0 0 1 .5-6.7 4.6 4.6 0 0 1 8.9-.8 3.6 3.6 0 0 1-.7 7.5z"
      />
      <path
        class="cloud-line cloud-front"
        d="M9.5 25a4.3 4.3 0 0 1 .6-8.5 6 6 0 0 1 11.6-1 4.6 4.6 0 0 1-.9 9.5z"
      />
    </svg>

    <!-- 흐림(기본): 구름과 안개선이 옅어졌다 짙어진다 -->
    <svg v-else viewBox="0 0 32 32">
      <path
        class="cloud-line fog-cloud"
        d="M9.5 17.5a4.3 4.3 0 0 1 .6-8.5 6 6 0 0 1 11.6-1 4.6 4.6 0 0 1-.9 9.5z"
      />
      <g class="fog-lines">
        <line class="fog f1" x1="8" y1="22.5" x2="24" y2="22.5" />
        <line class="fog f2" x1="11" y1="26.5" x2="27" y2="26.5" />
      </g>
    </svg>
  </span>
</template>

<style scoped>
.glyph {
  display: inline-flex;
  flex-shrink: 0;
}

.glyph svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* ── 맑음 ─────────────────────────────── */
.sun-rays {
  stroke: var(--sun);
  stroke-width: 1.8;
  stroke-linecap: round;
  transform-origin: 50% 50%;
  animation: sun-spin 24s linear infinite;
}

.sun-core {
  fill: var(--sun);
}

@keyframes sun-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── 공통 구름 선 ──────────────────────── */
.cloud-line {
  fill: var(--paper);
  stroke-width: 1.8;
  stroke-linejoin: round;
}

/* ── 비 ───────────────────────────────── */
.rain-cloud {
  stroke: var(--cool);
}

.rain-drops line {
  stroke: var(--cool);
  stroke-width: 1.8;
  stroke-linecap: round;
  animation: rain-fall 1.2s ease-in infinite;
}

.drop.d2 {
  animation-delay: 0.25s;
}

.drop.d3 {
  animation-delay: 0.5s;
}

@keyframes rain-fall {
  0% {
    transform: translateY(-2px);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(4px);
    opacity: 0;
  }
}

/* ── 구름 ─────────────────────────────── */
.cloud-back {
  stroke: var(--muted);
  animation: cloud-drift 7s ease-in-out infinite alternate;
}

.cloud-front {
  stroke: var(--mild);
  animation: cloud-drift 5s ease-in-out infinite alternate-reverse;
}

@keyframes cloud-drift {
  from {
    transform: translateX(-1.5px);
  }
  to {
    transform: translateX(1.5px);
  }
}

/* ── 흐림 ─────────────────────────────── */
.fog-cloud {
  stroke: var(--mild);
}

.fog-lines line {
  stroke: var(--muted);
  stroke-width: 1.6;
  stroke-linecap: round;
  animation: fog-pulse 3.2s ease-in-out infinite alternate;
}

.fog.f2 {
  animation-delay: 0.8s;
}

@keyframes fog-pulse {
  from {
    opacity: 0.25;
  }
  to {
    opacity: 0.9;
  }
}
</style>
