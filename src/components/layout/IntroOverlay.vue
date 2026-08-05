<script setup>
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'

// 인트로 오버레이의 표현만 담당한다.
// 상태 전이 로직은 composables/useIntroSequence.js가 가진다.
defineProps({
  state: {
    type: String,
    required: true, // loading · leaving · done
  },
})
</script>

<template>
  <!-- 첫 진입 인트로 겸 로딩 화면: 선이 그어지고 워드마크가 뜬 뒤,
       해가 돌며 데이터를 기다리다가 준비되면 위로 올라간다 -->
  <div v-if="state !== 'done'" class="intro" :class="{ leaving: state === 'leaving' }" aria-hidden="true">
    <div class="intro-inner">
      <p class="intro-brand">SKALA WEATHER</p>
      <span class="intro-line"></span>
      <div class="intro-sun">
        <WeatherGlyph status="맑음" :size="76" />
        <p class="intro-loading">실시간 날씨를 불러오는 중</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--paper);
  pointer-events: none;
}

.intro-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 26px;
}

.intro-brand {
  font-size: clamp(40px, 7vw, 88px);
  font-weight: 800;
  letter-spacing: 0.18em;
  color: var(--ink);
  white-space: nowrap;
  animation: rise-in 0.7s ease 0.55s backwards;
}

/* 정중앙에서 화면 폭 70%까지 길게 그어지는 선 */
.intro-line {
  display: block;
  width: min(70vw, 920px);
  height: 2px;
  background: var(--ink);
  transform-origin: center;
  animation: line-draw 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards;
}

/* 해 스피너 — 광선이 돌며 로딩 중임을 알린다 */
.intro-sun {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: rise-in 0.5s ease 1s backwards;
}

.intro-sun :deep(.sun-rays) {
  animation-duration: 2.2s;
}

.intro-sun :deep(.glyph) {
  filter: drop-shadow(0 4px 10px rgba(208, 138, 46, 0.25));
}

.intro-loading {
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: var(--muted);
}

/* 데이터가 준비되면 전체가 위로 상승하며 배경이 걷힌다 */
.intro.leaving .intro-inner {
  animation: intro-ascend 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.intro.leaving {
  animation: intro-bg-out 0.55s ease 0.3s forwards;
}

@keyframes intro-ascend {
  to {
    transform: translateY(-42vh) scale(0.32);
    opacity: 0;
  }
}

@keyframes intro-bg-out {
  to {
    opacity: 0;
  }
}

@keyframes line-draw {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .intro,
  .intro-inner,
  .intro-brand,
  .intro-line,
  .intro-sun {
    animation: none;
  }
}
</style>
