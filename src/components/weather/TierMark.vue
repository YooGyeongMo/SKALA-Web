<script setup>
// 기온 구간 칩의 마커
// 사각형 대신 구간의 성격을 가는 선으로 표현한다.
// 더움: 불꽃 / 보통: 수평선 위의 반원 해(온화한 낮) / 선선함: 산들바람 곡선
defineProps({
  tier: {
    type: String,
    required: true, // hot · mild · cool
  },
})
</script>

<template>
  <span class="tier-mark" aria-hidden="true">
    <!-- 더움: 불꽃이 아주 미세하게 일렁인다 -->
    <svg v-if="tier === 'hot'" viewBox="0 0 16 16" class="flame">
      <path
        d="M8 1.8 C10.4 4.2 11.8 6.2 11.8 8.6 A3.8 3.8 0 0 1 4.2 8.6 C4.2 7 5.1 5.6 6.3 4.5 C6.7 5.5 7.4 6.1 8 6.3 C7.6 4.7 7.7 3.2 8 1.8 Z"
      />
    </svg>

    <!-- 보통: 수평선 위 반원 해 — 잔잔한 쾌적함이라 애니메이션 없이 둔다 -->
    <svg v-else-if="tier === 'mild'" viewBox="0 0 16 16">
      <path d="M2 11.5 H14" />
      <path d="M4.8 11.5 A3.2 3.2 0 0 1 11.2 11.5" />
    </svg>

    <!-- 선선함: 산들바람 — 추위가 아니라 시원한 공기의 흐름 -->
    <svg v-else viewBox="0 0 16 16" class="breeze">
      <path d="M2 6.2 H9.2 A2.1 2.1 0 1 0 7.1 3.6" />
      <path d="M2 10.4 H11 A1.9 1.9 0 1 1 9.2 12.8" />
    </svg>
  </span>
</template>

<style scoped>
.tier-mark {
  display: inline-flex;
  width: 12px;
  height: 12px;
  margin-right: 6px;
  vertical-align: -1px;
}

.tier-mark svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.tier-mark path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 불꽃: 바닥을 기준으로 아주 살짝 키가 일렁인다 */
.flame {
  transform-origin: 50% 100%;
  animation: flame-sway 2s ease-in-out infinite alternate;
}

@keyframes flame-sway {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(1.07);
  }
}

/* 바람: 좌우로 미세하게 흐른다 */
.breeze {
  animation: breeze-flow 2.6s ease-in-out infinite alternate;
}

@keyframes breeze-flow {
  from {
    transform: translateX(-0.8px);
  }
  to {
    transform: translateX(0.8px);
  }
}
</style>
