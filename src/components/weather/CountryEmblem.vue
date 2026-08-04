<script setup>
// 나라 국기에서 연상되는 심볼.
// 기본은 랜드마크와 같은 잉크 밑그림(라인)으로 서 있고,
// 부모가 호버 상태에서 선을 다시 그리며 국기색(.f 요소의 fill)이 차오르게 한다.
// colored 클래스를 주면 처음부터 색이 채워진 상태로 그려진다.
defineProps({
  countryCode: {
    type: String,
    required: true, // kr · cn · jp · de · us
  },
})

// 별 한 개의 단위 경로 — transform으로 위치와 크기를 조절해 재사용한다
const STAR = 'M0 -1 L0.588 0.809 L-0.951 -0.309 L0.951 -0.309 L-0.588 0.809 Z'
</script>

<template>
  <span class="emblem" aria-hidden="true">
    <!-- 한국: 태극 — 호버하면 링이 다시 그려지며 홍청이 차오른다 -->
    <svg v-if="countryCode === 'kr'" viewBox="0 0 120 120">
      <circle class="ring" cx="60" cy="60" r="42" pathLength="1" />
      <path
        class="f lobe-red"
        pathLength="1"
        d="M20 60 A40 40 0 0 1 100 60 A20 20 0 0 1 60 60 A20 20 0 0 0 20 60 Z"
      />
      <path
        class="f lobe-blue"
        pathLength="1"
        d="M100 60 A40 40 0 0 1 20 60 A20 20 0 0 1 60 60 A20 20 0 0 0 100 60 Z"
      />
    </svg>

    <!-- 중국: 오성 -->
    <svg v-else-if="countryCode === 'cn'" viewBox="0 0 120 120">
      <rect class="f field" pathLength="1" x="14" y="24" width="92" height="72" rx="10" />
      <g transform="translate(44 58)"><path class="f star" pathLength="1" :d="STAR" transform="scale(19)" /></g>
      <g transform="translate(76 37)"><path class="f star" pathLength="1" :d="STAR" transform="scale(6.5) rotate(24)" /></g>
      <g transform="translate(87 51)"><path class="f star" pathLength="1" :d="STAR" transform="scale(6.5) rotate(46)" /></g>
      <g transform="translate(87 67)"><path class="f star" pathLength="1" :d="STAR" transform="scale(6.5) rotate(70)" /></g>
      <g transform="translate(76 81)"><path class="f star" pathLength="1" :d="STAR" transform="scale(6.5) rotate(95)" /></g>
    </svg>

    <!-- 일본: 히노마루 -->
    <svg v-else-if="countryCode === 'jp'" viewBox="0 0 120 120">
      <rect class="frame" pathLength="1" x="15" y="29" width="90" height="62" rx="8" />
      <circle class="f disc" pathLength="1" cx="60" cy="60" r="19" />
    </svg>

    <!-- 독일: 3색 밴드 -->
    <svg v-else-if="countryCode === 'de'" viewBox="0 0 120 120">
      <rect class="f b1" pathLength="1" x="20" y="34" width="80" height="16" rx="3" />
      <rect class="f b2" pathLength="1" x="20" y="52" width="80" height="16" rx="3" />
      <rect class="f b3" pathLength="1" x="20" y="70" width="80" height="16" rx="3" />
    </svg>

    <!-- 미국: 캔톤과 줄무늬 -->
    <svg v-else viewBox="0 0 120 120">
      <rect class="f canton" pathLength="1" x="16" y="32" width="27" height="30" rx="4" />
      <g transform="translate(25 42)"><path class="f cstar" pathLength="1" :d="STAR" transform="scale(3.4)" /></g>
      <g transform="translate(35 50)"><path class="f cstar" pathLength="1" :d="STAR" transform="scale(3.4)" /></g>
      <g transform="translate(25 55)"><path class="f cstar" pathLength="1" :d="STAR" transform="scale(3.4)" /></g>
      <rect class="f stripe" pathLength="1" x="49" y="34" width="55" height="8" rx="2" />
      <rect class="f stripe" pathLength="1" x="49" y="50" width="55" height="8" rx="2" />
      <rect class="f stripe" pathLength="1" x="16" y="68" width="88" height="8" rx="2" />
      <rect class="f stripe" pathLength="1" x="16" y="84" width="88" height="8" rx="2" />
    </svg>
  </span>
</template>

<style scoped>
.emblem {
  display: inline-block;
  line-height: 0;
}

.emblem svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* 밑그림 — 모든 도형은 잉크 라인으로 서 있다 */
.emblem :where(path, rect, circle) {
  fill: none;
  stroke: rgba(17, 17, 17, 0.8);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 채움 대상(.f) — 색은 여기서 정하고, 차오름은 fill-opacity로 제어한다 */
.f {
  fill-opacity: 0;
  transition: fill-opacity 0.45s ease;
}

.lobe-red {
  fill: rgba(199, 59, 75, 0.9);
}

.lobe-blue {
  fill: rgba(42, 92, 168, 0.9);
}

.ring {
  stroke: rgba(17, 17, 17, 0.45);
}

.field {
  fill: rgba(199, 59, 75, 0.13);
}

.star {
  fill: rgba(224, 177, 62, 0.95);
}

.frame {
  stroke: rgba(17, 17, 17, 0.45);
}

.disc {
  fill: rgba(192, 69, 69, 0.92);
}

.b1 {
  fill: rgba(43, 43, 43, 0.9);
}

.b2 {
  fill: rgba(178, 58, 58, 0.88);
}

.b3 {
  fill: rgba(224, 177, 62, 0.92);
}

.canton {
  fill: rgba(51, 81, 142, 0.92);
}

.cstar {
  fill: rgba(255, 255, 255, 0.95);
}

.stripe {
  fill: rgba(184, 74, 74, 0.85);
}

/* colored — 처음부터 색이 채워진 상태 (도시 목록 헤더 등) */
.emblem.colored .f {
  fill-opacity: 1;
}
</style>
