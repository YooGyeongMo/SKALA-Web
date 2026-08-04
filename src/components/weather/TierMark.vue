<script setup>
// 기온 구간 칩의 마커
// 직접 그린 아이콘 대신 널리 쓰이는 오픈소스 아이콘 셋(Lucide)을 사용한다.
// 스트로크 기반이라 지금의 가는 선 디자인 톤과 그대로 맞는다.
import { Flame, Sun, Wind } from 'lucide-vue-next'

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
    <Flame v-if="tier === 'hot'" class="flame" :size="13" :stroke-width="2.2" />

    <!-- 보통: 해 — 잔잔한 쾌적함이라 애니메이션 없이 둔다 -->
    <Sun v-else-if="tier === 'mild'" :size="13" :stroke-width="2.2" />

    <!-- 선선함: 바람 — 추위가 아니라 시원한 공기의 흐름 -->
    <Wind v-else class="breeze" :size="13" :stroke-width="2.2" />
  </span>
</template>

<style scoped>
.tier-mark {
  display: inline-flex;
  margin-right: 6px;
  vertical-align: -2px;
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
    transform: scaleY(1.08);
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
