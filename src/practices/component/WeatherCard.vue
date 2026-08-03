<script setup>
// 선택된 도시 객체를 부모로부터 단방향으로 전달받는다 (props)
defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 카드 선택(select-card)과 상세보기(click-detail)를 부모에게 전달한다 (emits)
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article class="weather-card" @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)">
    <div class="card-main">
      <h4 class="city-name">
        {{ cityItem.name }} <span class="city-status">{{ cityItem.status }}</span>
      </h4>
      <p class="city-temp">{{ cityItem.temp }}°C</p>
    </div>

    <span v-if="cityItem.temp >= 25" class="chip hot">🔥 더움 (25도 이상)</span>
    <span v-else-if="cityItem.temp >= 20" class="chip mild">🌤 보통 (20~24도)</span>
    <span v-else class="chip cool">❄️ 선선함 (20도 미만)</span>

    <!-- .stop: 카드 select-card 클릭과 겹치지 않도록 버블링 차단 -->
    <button class="btn-detail" @click.stop="emit('click-detail', cityItem.name, cityItem.status)">
      상세보기
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  background: var(--paper);
  border: 1px solid var(--line);
  padding: var(--s2);
  margin-bottom: var(--s1);
  cursor: pointer;
  transition: border-color 0.15s;
}

.weather-card:hover {
  border-color: var(--line-strong);
}

.card-main {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.city-name {
  font-size: 15px;
  font-weight: 700;
}

.city-status {
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
  margin-left: 6px;
}

.city-temp {
  font-size: 20px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

.chip {
  display: inline-block;
  margin-top: var(--s1);
  padding: 2px 10px;
  font-size: 12px;
  border: 1px solid currentColor;
}

.chip.hot {
  color: var(--hot);
}

.chip.mild {
  color: var(--mild);
}

.chip.cool {
  color: var(--cool);
}

.btn-detail {
  position: absolute;
  right: var(--s2);
  bottom: var(--s2);
  padding: 4px 12px;
  font-size: 12px;
  background: var(--paper);
  border: 1px solid var(--line-strong);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-detail:hover {
  background: var(--ink);
  color: var(--paper);
}
</style>
