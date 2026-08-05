<script setup>
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCapitalWeather } from '@/composables/useCapitalWeather'
import { useMyPlace } from '@/composables/useMyPlace'
import { MapPin } from 'lucide-vue-next'

// three.js 지구본은 무거워서 비동기로만 불러온다
const EarthGlobe = defineAsyncComponent(() => import('@/components/space/EarthGlobe.vue'))

const router = useRouter()

// 수도 실황 — 접근성 홈과 공유하는 컴포저블 (지구본 핀 카드에 쓴다)
const { countryCards, isLoading, dataSource } = useCapitalWeather()

// 위치 권한을 허용하면 내 위치의 도시명을 시계 옆에 보여준다
const { myPlace } = useMyPlace()

// 24시간제 현재 시각 — 콜론이 1초 간격으로 깜빡인다
const now = ref(new Date())
let clockTimer = null

const hours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))

onMounted(() => {
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
})

const goCountry = (code) => {
  router.push('/country/' + code)
}
</script>

<template>
  <!-- 홈 1 — 지구본 전용 화면. 나라 카드는 접근성 홈(홈 2)이 담당한다 -->
  <section class="world-hero">
    <EarthGlobe :countries="countryCards" @select="goCountry" />

    <div class="hero-copy">
      <h1 class="world-title">세계 날씨 대시보드</h1>
      <p class="world-sub">지구본을 드래그로 돌려보고, 핀을 누르면 그 나라의 도시들이 열립니다.</p>
      <p class="data-source" :class="dataSource">
        {{
          isLoading
            ? '수도 실황을 불러오는 중...'
            : dataSource === 'live'
              ? 'OpenWeather 실시간 관측 데이터'
              : '목데이터 표시 중 (API 키 미설정 또는 통신 실패)'
        }}
      </p>
    </div>

    <!-- 접근성 버전 — 크고 분명한 진입 버튼 -->
    <RouterLink to="/accessible" class="a11y-button">
      <span class="a11y-button-label">접근성 버전으로 보기</span>
      <span class="a11y-button-sub">모션 없이 카드로 한눈에 →</span>
    </RouterLink>

    <div class="clock-wrap">
      <div class="clock" aria-label="현재 시각">
        <span class="clock-digits">{{ hours }}</span>
        <span class="clock-colon">:</span>
        <span class="clock-digits">{{ minutes }}</span>
      </div>
      <p v-if="myPlace" class="clock-place">
        <MapPin class="place-pin" :size="14" :stroke-width="2.2" />{{ myPlace }}
      </p>
    </div>
  </section>
</template>

<style scoped>
/* 풀블리드 히어로 */
.world-hero {
  position: relative;
  margin-top: -64px;
  height: 100vh;
  min-height: 620px;
  padding-top: 64px;
  background:
    radial-gradient(1100px 620px at 60% 44%, rgba(64, 110, 190, 0.22), transparent 62%),
    #05070d;
  border-bottom: 1px solid var(--line-strong);
  overflow: hidden;
}

.hero-copy {
  position: absolute;
  left: clamp(20px, 6vw, 72px);
  top: calc(64px + clamp(24px, 5vh, 48px));
  color: #fff;
  pointer-events: none;
}

.world-title {
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.world-sub {
  margin-top: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.data-source {
  margin-top: var(--s2);
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.6);
}

.data-source::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  margin-right: 6px;
  vertical-align: 1px;
}

.data-source.live::before {
  background: var(--ok);
}

/* 접근성 버전 버튼 — 히어로 좌하단, 크고 분명하게 */
.a11y-button {
  position: absolute;
  left: clamp(20px, 6vw, 72px);
  bottom: clamp(28px, 7vh, 60px);
  display: grid;
  gap: 3px;
  padding: 18px 30px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 14px;
  color: #fff;
  text-decoration: none;
  transition: all 0.25s ease;
}

.a11y-button:hover,
.a11y-button:focus-visible {
  background: rgba(255, 255, 255, 0.92);
  color: #111;
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35);
}

.a11y-button:focus-visible {
  outline: 3px solid var(--cool);
  outline-offset: 3px;
}

.a11y-button-label {
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.a11y-button-sub {
  font-size: 12px;
  opacity: 0.75;
}

/* 24시간 시계 — 히어로 우측 상단, 콜론이 1초마다 깜빡인다 */
.clock-wrap {
  position: absolute;
  right: clamp(20px, 5vw, 64px);
  top: calc(64px + clamp(24px, 5vh, 48px));
  text-align: right;
  pointer-events: none;
}

.clock {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: 34px;
  font-weight: 300;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
  font-variant-numeric: tabular-nums;
}

.clock-place {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 3px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.78);
}

/* 위치 핀 — 다크 히어로 위에서 잘 보이는 흰색 */
.place-pin {
  color: rgba(255, 255, 255, 0.85);
}

.clock-colon {
  margin: 0 2px;
  animation: colon-blink 1s steps(1) infinite;
}

@keyframes colon-blink {
  50% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .world-hero {
    height: 88vh;
    min-height: 520px;
  }

  .clock {
    font-size: 22px;
  }

  .clock-place {
    font-size: 12px;
  }

  .a11y-button {
    padding: 14px 20px;
  }

  .a11y-button-label {
    font-size: 15px;
  }
}
</style>
