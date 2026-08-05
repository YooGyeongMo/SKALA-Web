<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { tzClock } from '@/utils/time'
import { useCapitalWeather } from '@/composables/useCapitalWeather'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import CountryEmblem from '@/components/weather/CountryEmblem.vue'

// 접근성 홈 — 3D 지구본 홈과 같은 데이터를 모션과 깜빡임 없이 제공한다.
// 정적 시계(콜론 고정), 등장 애니메이션 없음, 강한 포커스 링, 시맨틱 목록 구조.
const router = useRouter()
const { countryCards, isLoading, dataSource, loaded } = useCapitalWeather()

const now = ref(new Date())
let clockTimer = null

const clockText = computed(
  () =>
    `${String(now.value.getHours()).padStart(2, '0')}:${String(now.value.getMinutes()).padStart(2, '0')}`,
)

onMounted(() => {
  // 분 단위 갱신이면 충분하다 (깜빡임 없음)
  clockTimer = setInterval(() => {
    now.value = new Date()
  }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
})

const goCountry = (code) => {
  router.push('/country/' + code)
}
</script>

<template>
  <div class="a11y-home">
    <header class="a11y-head">
      <div>
        <p class="section-label">Accessible Home</p>
        <h1 class="a11y-title">세계 날씨 대시보드</h1>
        <p class="a11y-sub">
          모션과 깜빡임 없이 같은 데이터를 제공하는 접근성 화면입니다. 나라를 고르면 대표 도시
          10곳의 실시간 날씨를 볼 수 있습니다.
        </p>
        <p class="data-source" :class="dataSource">
          {{
            isLoading
              ? '수도 실황을 불러오는 중입니다'
              : dataSource === 'live'
                ? 'OpenWeather 실시간 관측 데이터'
                : '목데이터 표시 중 (API 키 미설정 또는 통신 실패)'
          }}
        </p>
      </div>

      <div class="a11y-side">
        <p class="a11y-clock" aria-label="현재 시각">{{ clockText }}</p>
        <RouterLink to="/" class="switch-link">3D 지구본 버전으로 보기</RouterLink>
      </div>
    </header>

    <el-skeleton v-if="!loaded" :rows="6" />

    <ul v-else class="country-list">
      <li v-for="card in countryCards" :key="card.code">
        <button
          class="country-row"
          :aria-label="`${card.name} 대표 도시 10곳 보기, 수도 ${card.capital} 현재 ${Math.round(card.temp)}도 ${card.status}`"
          @click="goCountry(card.code)"
        >
          <CountryEmblem :country-code="card.code" class="row-emblem colored" />
          <span class="row-meta">
            <span class="row-en">{{ card.english }}</span>
            <span class="row-name">{{ card.name }}</span>
          </span>
          <span class="row-weather">
            <WeatherGlyph :status="card.glyph || card.status" :size="22" />
            <span class="row-temp">{{ Math.round(card.temp) }}°</span>
            <span class="row-capital">{{ card.capital }} {{ card.status }}</span>
          </span>
          <span class="row-time">{{ tzClock(now.getTime(), card.tz) }}</span>
          <span class="row-cta" aria-hidden="true">→</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.a11y-home {
  max-width: 880px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.a11y-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--s3);
  margin-bottom: var(--s4);
}

.a11y-title {
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-top: var(--s1);
}

.a11y-sub {
  margin-top: 6px;
  max-width: 520px;
  font-size: 14.5px;
  line-height: 1.75;
  color: var(--ink-2, #1a1a1a);
}

.data-source {
  margin-top: var(--s1);
  font-size: 12px;
  color: var(--muted);
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

.a11y-side {
  text-align: right;
  flex-shrink: 0;
}

/* 정적 시계 — 콜론이 깜빡이지 않는다 */
.a11y-clock {
  font-family: var(--font-mono);
  font-size: 30px;
  font-weight: 300;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.switch-link {
  display: inline-block;
  margin-top: var(--s1);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 시맨틱 목록 — 큰 클릭 영역, 강한 포커스 링 */
.country-list {
  list-style: none;
  display: grid;
  gap: var(--s1);
}

.country-row {
  display: grid;
  grid-template-columns: 64px 1fr auto 64px 24px;
  align-items: center;
  gap: var(--s2);
  width: 100%;
  padding: var(--s2);
  background: var(--paper);
  border: 1px solid var(--line);
  text-align: left;
  cursor: pointer;
}

.country-row:hover {
  border-color: var(--line-strong);
}

.country-row:focus-visible {
  outline: 3px solid var(--cool);
  outline-offset: 2px;
  border-color: var(--line-strong);
}

.row-emblem {
  width: 56px;
}

.row-meta {
  display: grid;
  gap: 2px;
}

.row-en {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.row-name {
  font-size: 18px;
  font-weight: 800;
}

.row-weather {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-temp {
  font-size: 19px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

.row-capital {
  font-size: 12.5px;
  color: var(--muted);
}

.row-time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.row-cta {
  font-size: 16px;
  color: var(--muted);
  text-align: center;
}

@media (max-width: 640px) {
  .a11y-head {
    flex-direction: column;
  }

  .a11y-side {
    text-align: left;
  }

  .country-row {
    grid-template-columns: 48px 1fr auto;
  }

  .row-time,
  .row-cta {
    display: none;
  }
}
</style>
