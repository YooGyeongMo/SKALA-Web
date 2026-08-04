<script setup>
// 나라 국기에서 연상되는 심볼을 채도를 낮춘 색으로 그린다.
// 한국: 태극이 중앙에서 작게 시작해 둥글게 그려지며 색이 채워지고
// 중국: 별 다섯이 차례로 돌며 국기 배치로 자리잡는다.
// 일본: 히노마루, 독일: 3색 밴드, 미국: 캔톤과 줄무늬.
// 카드별 시차는 부모가 --emblem-delay 변수로 준다.
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
    <!-- 한국: 태극 -->
    <svg v-if="countryCode === 'kr'" viewBox="0 0 120 120" class="kr">
      <g class="taegeuk">
        <circle class="ring" cx="60" cy="60" r="42" pathLength="1" />
        <path
          class="lobe lobe-red"
          d="M20 60 A40 40 0 0 1 100 60 A20 20 0 0 1 60 60 A20 20 0 0 0 20 60 Z"
        />
        <path
          class="lobe lobe-blue"
          d="M100 60 A40 40 0 0 1 20 60 A20 20 0 0 1 60 60 A20 20 0 0 0 100 60 Z"
        />
      </g>
    </svg>

    <!-- 중국: 오성 -->
    <svg v-else-if="countryCode === 'cn'" viewBox="0 0 120 120" class="cn">
      <rect class="field" x="14" y="24" width="92" height="72" rx="10" />
      <g transform="translate(44 58)">
        <g class="star-anim big"><path :d="STAR" transform="scale(19)" /></g>
      </g>
      <g transform="translate(76 37)">
        <g class="star-anim s1"><path :d="STAR" transform="scale(6.5) rotate(24)" /></g>
      </g>
      <g transform="translate(87 51)">
        <g class="star-anim s2"><path :d="STAR" transform="scale(6.5) rotate(46)" /></g>
      </g>
      <g transform="translate(87 67)">
        <g class="star-anim s3"><path :d="STAR" transform="scale(6.5) rotate(70)" /></g>
      </g>
      <g transform="translate(76 81)">
        <g class="star-anim s4"><path :d="STAR" transform="scale(6.5) rotate(95)" /></g>
      </g>
    </svg>

    <!-- 일본: 히노마루 -->
    <svg v-else-if="countryCode === 'jp'" viewBox="0 0 120 120" class="jp">
      <rect class="frame" x="15" y="29" width="90" height="62" rx="8" />
      <circle class="disc" cx="60" cy="60" r="19" />
    </svg>

    <!-- 독일: 3색 밴드 -->
    <svg v-else-if="countryCode === 'de'" viewBox="0 0 120 120" class="de">
      <rect class="band b1" x="20" y="34" width="80" height="16" rx="3" />
      <rect class="band b2" x="20" y="52" width="80" height="16" rx="3" />
      <rect class="band b3" x="20" y="70" width="80" height="16" rx="3" />
    </svg>

    <!-- 미국: 캔톤과 줄무늬 -->
    <svg v-else viewBox="0 0 120 120" class="us">
      <g class="canton-pop">
        <rect class="canton" x="16" y="32" width="27" height="30" rx="4" />
        <g transform="translate(25 42)"><path class="cstar" :d="STAR" transform="scale(3.4)" /></g>
        <g transform="translate(35 50)"><path class="cstar" :d="STAR" transform="scale(3.4)" /></g>
        <g transform="translate(25 55)"><path class="cstar" :d="STAR" transform="scale(3.4)" /></g>
      </g>
      <rect class="stripe st1" x="49" y="34" width="55" height="8" rx="2" />
      <rect class="stripe st2" x="49" y="50" width="55" height="8" rx="2" />
      <rect class="stripe st3" x="16" y="68" width="88" height="8" rx="2" />
      <rect class="stripe st4" x="16" y="84" width="88" height="8" rx="2" />
    </svg>
  </span>
</template>

<style scoped>
.emblem {
  display: inline-block;
  line-height: 0;
  --d: var(--emblem-delay, 0s);
}

.emblem svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* ── 한국: 태극 ─────────────────────────────── */
.taegeuk {
  transform-box: fill-box;
  transform-origin: center;
  animation: emblem-pop 0.6s cubic-bezier(0.34, 1.4, 0.5, 1) calc(var(--d) + 0.1s) backwards;
}

.kr .ring {
  fill: none;
  stroke: rgba(17, 17, 17, 0.2);
  stroke-width: 1.4;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: ring-draw 0.9s ease calc(var(--d) + 0.15s) forwards;
}

.kr .lobe {
  opacity: 0;
  animation: fill-in 0.55s ease calc(var(--d) + 0.6s) forwards;
}

.kr .lobe-red {
  fill: #c73b4b;
}

.kr .lobe-blue {
  fill: #2a5ca8;
}

/* ── 중국: 오성 ─────────────────────────────── */
.cn .field {
  fill: rgba(199, 59, 75, 0.1);
  transform-box: fill-box;
  transform-origin: center;
  animation: emblem-pop 0.5s ease calc(var(--d) + 0.05s) backwards;
}

.cn path {
  fill: #e0b13e;
}

.star-anim {
  transform-box: fill-box;
  transform-origin: center;
  animation: star-pop 0.55s cubic-bezier(0.34, 1.5, 0.5, 1) backwards;
}

.star-anim.big {
  animation-delay: calc(var(--d) + 0.2s);
}

.star-anim.s1 {
  animation-delay: calc(var(--d) + 0.38s);
}

.star-anim.s2 {
  animation-delay: calc(var(--d) + 0.5s);
}

.star-anim.s3 {
  animation-delay: calc(var(--d) + 0.62s);
}

.star-anim.s4 {
  animation-delay: calc(var(--d) + 0.74s);
}

/* ── 일본: 히노마루 ─────────────────────────── */
.jp .frame {
  fill: var(--paper);
  stroke: var(--line);
  stroke-width: 1.4;
  transform-box: fill-box;
  transform-origin: center;
  animation: emblem-pop 0.5s ease calc(var(--d) + 0.05s) backwards;
}

.jp .disc {
  fill: #c04545;
  transform-box: fill-box;
  transform-origin: center;
  animation: star-pop 0.6s cubic-bezier(0.34, 1.5, 0.5, 1) calc(var(--d) + 0.35s) backwards;
}

/* ── 독일: 3색 밴드 ─────────────────────────── */
.de .band {
  opacity: 0.92;
  transform-box: fill-box;
  transform-origin: left center;
  animation: band-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.de .b1 {
  fill: #2b2b2b;
  animation-delay: calc(var(--d) + 0.1s);
}

.de .b2 {
  fill: #b23a3a;
  animation-delay: calc(var(--d) + 0.24s);
}

.de .b3 {
  fill: #e0b13e;
  animation-delay: calc(var(--d) + 0.38s);
}

/* ── 미국: 캔톤과 줄무늬 ────────────────────── */
.us .canton-pop {
  transform-box: fill-box;
  transform-origin: center;
  animation: emblem-pop 0.55s cubic-bezier(0.34, 1.4, 0.5, 1) calc(var(--d) + 0.1s) backwards;
}

.us .canton {
  fill: #33518e;
}

.us .cstar {
  fill: rgba(255, 255, 255, 0.92);
}

.us .stripe {
  fill: #b84a4a;
  opacity: 0.85;
  transform-box: fill-box;
  transform-origin: left center;
  animation: band-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) backwards;
}

.us .st1 {
  animation-delay: calc(var(--d) + 0.28s);
}

.us .st2 {
  animation-delay: calc(var(--d) + 0.38s);
}

.us .st3 {
  animation-delay: calc(var(--d) + 0.48s);
}

.us .st4 {
  animation-delay: calc(var(--d) + 0.58s);
}

/* ── 공통 키프레임 ──────────────────────────── */
@keyframes emblem-pop {
  from {
    transform: scale(0.4);
    opacity: 0;
  }
}

@keyframes star-pop {
  from {
    transform: scale(0) rotate(-140deg);
    opacity: 0;
  }
}

@keyframes band-in {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
}

@keyframes fill-in {
  to {
    opacity: 0.92;
  }
}

@keyframes ring-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .emblem * {
    animation: none;
  }

  .kr .lobe {
    opacity: 0.92;
  }

  .kr .ring {
    stroke-dashoffset: 0;
  }
}
</style>
