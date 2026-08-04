import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 날씨 단위 설정 전역 스토어
 *
 * 컴포넌트 계층 구조와 상관없이 어디서든 같은 단위 상태를 공유한다.
 * 내비의 UnitToggler가 바꾸면 홈 카드와 상세 페이지가 함께 반응한다.
 */
export const useConfigStore = defineStore('config', () => {
  // state: 현재 온도 단위 ('celsius' 또는 'fahrenheit')
  // 새로고침해도 유지되도록 localStorage와 동기화한다 (강의 authStore 패턴)
  const unit = ref(localStorage.getItem('weatherUnit') || 'celsius')

  // getters: 현재 단위에 맞는 기호
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  // actions: 두 단위를 토글한다
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
    localStorage.setItem('weatherUnit', unit.value)
  }

  return { unit, unitSymbol, toggleUnit }
})
