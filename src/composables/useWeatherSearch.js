import { ref, computed, watchEffect } from 'vue'

/**
 * 도시 검색 로직 컴포저블
 *
 * 검색어 상태(searchQuery)와 필터 결과(filteredWeatherList),
 * 검색어 추적 로그(watchEffect)를 한 단위로 묶어 재사용한다.
 * 과제2(WeatherComposition)와 과제3(WeatherParent)이 함께 사용한다.
 *
 * @param {import('vue').Ref<Array>} weatherList 필터 대상 날씨 목록 ref
 */
export function useWeatherSearch(weatherList) {
  const searchQuery = ref('')

  // 검색어가 도시 이름에 포함된 항목만 필터링 (빈 검색어면 원본 그대로)
  const filteredWeatherList = computed(() => {
    const query = searchQuery.value.trim()
    if (!query) return weatherList.value
    return weatherList.value.filter((item) => item.name.includes(query))
  })

  // 콜백 안에서 읽은 searchQuery를 자동 추적한다 (등록 즉시 1회 실행)
  watchEffect(() => {
    console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}' 에 매칭되는 데이터를 필터링합니다.`)
  })

  return { searchQuery, filteredWeatherList }
}
