<script setup>
// 나라 국기에서 연상되는 심볼.
// 밑그림(선, line)과 채움(색, f) 레이어를 분리해 선이 겹치지 않는다.
// 기본은 은은한 밑그림으로 서 있고, 부모가 호버에서
// 선을 다시 그리며(.line) 색을 채운다(.f). colored는 처음부터 채워진 상태.
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
    <!-- 한국: 태극 — 바깥 원과 S곡선 한 벌, 색은 그 안을 채운다 -->
    <svg v-if="countryCode === 'kr'" viewBox="0 0 120 120">
      <path
        class="f lobe-red"
        d="M20 60 A40 40 0 0 1 100 60 A20 20 0 0 1 60 60 A20 20 0 0 0 20 60 Z"
      />
      <path
        class="f lobe-blue"
        d="M100 60 A40 40 0 0 1 20 60 A20 20 0 0 1 60 60 A20 20 0 0 0 100 60 Z"
      />
      <circle class="line" cx="60" cy="60" r="40" pathLength="1" />
      <path class="line" pathLength="1" d="M20 60 A20 20 0 0 1 60 60 A20 20 0 0 0 100 60" />
    </svg>

    <!-- 중국: 오성 — 별은 별 모양 그대로, 채움으로만 표현한다 -->
    <svg v-else-if="countryCode === 'cn'" viewBox="0 0 120 120">
      <rect class="f field" x="16" y="30" width="88" height="60" rx="7" />
      <rect class="line" pathLength="1" x="15" y="29" width="90" height="62" rx="8" />
      <g transform="translate(42 56)"><path class="star" :d="STAR" transform="scale(17)" /></g>
      <g transform="translate(70 38)"><path class="star" :d="STAR" transform="scale(5.6) rotate(24)" /></g>
      <g transform="translate(79 50)"><path class="star" :d="STAR" transform="scale(5.6) rotate(46)" /></g>
      <g transform="translate(79 64)"><path class="star" :d="STAR" transform="scale(5.6) rotate(70)" /></g>
      <g transform="translate(70 76)"><path class="star" :d="STAR" transform="scale(5.6) rotate(95)" /></g>
    </svg>

    <!-- 일본: 히노마루 -->
    <svg v-else-if="countryCode === 'jp'" viewBox="0 0 120 120">
      <rect class="line" pathLength="1" x="15" y="29" width="90" height="62" rx="8" />
      <circle class="line f disc" pathLength="1" cx="60" cy="60" r="18" />
    </svg>

    <!-- 독일: 실제 국기처럼 가로 3분할 프레임 -->
    <svg v-else-if="countryCode === 'de'" viewBox="0 0 120 120">
      <rect class="f b1" x="16" y="30" width="88" height="20" />
      <rect class="f b2" x="16" y="50" width="88" height="20" />
      <rect class="f b3" x="16" y="70" width="88" height="20" />
      <rect class="line" pathLength="1" x="15" y="29" width="90" height="62" rx="8" />
      <path class="line seq1" pathLength="1" d="M15 50 H105" />
      <path class="line seq2" pathLength="1" d="M15 70 H105" />
    </svg>

    <!-- 미국: 실제 국기처럼 캔톤과 줄무늬 프레임 -->
    <svg v-else viewBox="0 0 120 120">
      <rect class="f canton" x="16" y="30" width="34" height="27" />
      <rect class="f stripe" x="50" y="30" width="54" height="7" />
      <rect class="f stripe" x="50" y="44" width="54" height="7" />
      <rect class="f stripe" x="16" y="58" width="88" height="7" />
      <rect class="f stripe" x="16" y="72" width="88" height="7" />
      <rect class="f stripe" x="16" y="84" width="88" height="6" />
      <!-- 실제 캔톤처럼 3-2-3으로 정렬된 작은 별들 -->
      <g transform="translate(23 36)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(33 36)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(43 36)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(28 44)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(38 44)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(23 52)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(33 52)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <g transform="translate(43 52)"><path class="star cstar" :d="STAR" transform="scale(2.4)" /></g>
      <rect class="line" pathLength="1" x="15" y="29" width="90" height="62" rx="8" />
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

/* 밑그림 선 — 은은한 잉크 */
.line {
  fill: none;
  stroke: rgba(17, 17, 17, 0.7);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 채움 — 색은 여기서 정하고, 차오름은 fill-opacity로 제어한다 */
.f {
  stroke: none;
  fill-opacity: 0;
  transition: fill-opacity 0.7s ease;
}

.lobe-red {
  fill: rgba(199, 59, 75, 0.9);
}

.lobe-blue {
  fill: rgba(42, 92, 168, 0.9);
}

.field {
  fill: rgba(190, 45, 55, 0.88);
}

.disc {
  fill: rgba(192, 69, 69, 0.92);
  stroke: rgba(17, 17, 17, 0.7);
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

.stripe {
  fill: rgba(184, 74, 74, 0.85);
}

/* 별 — 외곽선 없이 항상 채움으로만 보인다.
   기본은 옅은 잉크, 색이 켜지면 국기색으로 물든다 */
.star {
  stroke: none;
  fill: rgba(17, 17, 17, 0.16);
  transition: fill 0.7s ease;
}

/* colored — 처음부터 진한 국기색으로 채워진 상태 (도시 목록 헤더 등) */
.emblem.colored .f {
  fill-opacity: 1;
}

.emblem.colored .lobe-red {
  fill: rgb(199, 59, 75);
}

.emblem.colored .lobe-blue {
  fill: rgb(42, 92, 168);
}

.emblem.colored .disc {
  fill: rgb(192, 69, 69);
}

.emblem.colored .field {
  fill: rgb(190, 45, 55);
}

.emblem.colored .b1 {
  fill: rgb(43, 43, 43);
}

.emblem.colored .b2 {
  fill: rgb(178, 58, 58);
}

.emblem.colored .b3 {
  fill: rgb(224, 177, 62);
}

.emblem.colored .canton {
  fill: rgb(51, 81, 142);
}

.emblem.colored .stripe {
  fill: rgb(184, 74, 74);
}

.emblem.colored .star {
  fill: rgb(224, 177, 62);
}

.emblem.colored .cstar {
  fill: rgb(255, 255, 255);
}
</style>
