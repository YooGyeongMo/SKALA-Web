<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

// state는 구조분해하면 반응형이 끊기므로 storeToRefs로 꺼낸다.
// 함수인 actions는 일반 구조분해로 가져와도 된다.
const { unit } = storeToRefs(configStore)
const { toggleUnit } = configStore

// 이미 선택된 단위를 다시 누르면 아무 일도 하지 않는다
const select = (target) => {
  if (unit.value !== target) toggleUnit()
}
</script>

<template>
  <div class="unit-toggler" role="group" aria-label="온도 단위 설정">
    <button :class="{ active: unit === 'celsius' }" @click="select('celsius')">℃</button>
    <button :class="{ active: unit === 'fahrenheit' }" @click="select('fahrenheit')">℉</button>
  </div>
</template>

<style scoped>
/* 두 칸 세그먼트 — 활성 단위가 잉크로 채워진다 */
.unit-toggler {
  display: inline-flex;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  overflow: hidden;
}

.unit-toggler button {
  padding: 4px 12px;
  font-size: 12.5px;
  font-weight: 600;
  background: var(--paper);
  color: var(--muted);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.unit-toggler button.active {
  background: var(--ink);
  color: var(--paper);
}
</style>
