<script setup>
import { computed } from 'vue'
import IntroOverlay from '@/components/layout/IntroOverlay.vue'
import GlobalNav from '@/components/layout/GlobalNav.vue'
import { useIntroSequence } from '@/composables/useIntroSequence'

// App은 조립만 담당한다.
// 인트로 시퀀스 로직은 useIntroSequence, 인트로 표현은 IntroOverlay,
// 내비게이션은 GlobalNav가 각자 맡는다.
const { introState } = useIntroSequence()

// 인트로가 자리를 넘기기 전(pre)에는 본문을 숨기고, 넘기면(entered) 떠오르게 한다
const stage = computed(() => (introState.value === 'loading' ? 'pre' : 'entered'))
</script>

<template>
  <div class="app">
    <IntroOverlay :state="introState" />

    <GlobalNav :stage="stage" />

    <main class="app-main" :class="stage">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-main.pre {
  opacity: 0;
}

.app-main.entered {
  animation: content-rise 0.7s ease 0.55s backwards;
}

@keyframes content-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-main.entered {
    animation: none;
  }
}
</style>
