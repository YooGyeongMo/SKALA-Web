import { ref, onMounted } from 'vue'
import { hasApiKey, fetchWeatherByCoords, fetchPlaceName } from '@/api/openWeather'

/**
 * 내 위치 도시명 — 두 홈이 함께 쓰는 컴포저블
 *
 * 1순위: 역지오코딩 한글 지명 (판교 좌표 → 성남시)
 * 2순위: 좌표 날씨 응답의 관측 지점명
 * 폴백: 브라우저 타임존의 도시명 (Asia/Seoul → Seoul)
 */
export function useMyPlace() {
  const myPlace = ref('')

  const load = () => {
    // 우선 타임존에서 도시명을 뽑아 폴백으로 보여준다
    const tzCity = Intl.DateTimeFormat().resolvedOptions().timeZone?.split('/').pop()
    if (tzCity) myPlace.value = tzCity.replaceAll('_', ' ')

    if (!hasApiKey || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        try {
          const place = await fetchPlaceName(latitude, longitude)
          if (place) {
            myPlace.value = place
            return
          }
        } catch (error) {
          console.warn('[내 위치] 역지오코딩 실패, 날씨 지점명으로 폴백:', error)
        }
        try {
          const data = await fetchWeatherByCoords(latitude, longitude)
          if (data.name) myPlace.value = data.name
        } catch (error) {
          console.error('[내 위치] 좌표 날씨 조회 실패, 타임존 폴백 유지:', error)
        }
      },
      (error) => {
        console.warn('[내 위치] 위치 권한 거부 또는 실패, 타임존 폴백 유지:', error.message)
      },
      { timeout: 8000 },
    )
  }

  onMounted(load)

  return { myPlace }
}
