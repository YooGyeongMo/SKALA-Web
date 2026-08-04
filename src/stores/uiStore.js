import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 화면 공통 상태 스토어
 *
 * 첫 화면의 데이터 로딩 완료 신호를 담는다.
 * 홈이 실황을 다 받아오면 markReady를 호출하고,
 * App의 인트로 오버레이가 이 신호를 받아 상승 해제된다.
 */
export const useUiStore = defineStore('ui', () => {
  // state: 첫 데이터 로딩 완료 여부
  const dataReady = ref(false)

  // actions: 로딩 완료 신호
  function markReady() {
    dataReady.value = true
  }

  return { dataReady, markReady }
})
