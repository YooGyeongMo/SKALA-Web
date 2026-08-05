import { ref, computed, onMounted } from 'vue'
import { countries } from '@/data/countries'
import {
  hasApiKey,
  hasCachedCity,
  fetchCityWeather,
  mapMainToGlyph,
  normalizeDescription,
} from '@/api/openWeather'
import { MOCK_TZ } from '@/utils/time'
import { useUiStore } from '@/stores/uiStore'

/**
 * 5개국 수도 실황 컴포저블
 *
 * 지구본 홈과 접근성 홈이 같은 데이터 로직을 공유한다.
 * 캐시가 전부 유효하면(재방문) 스켈레톤 없이 즉시 렌더하고,
 * 첫 로딩이면 최소 1.3초와 실제 로딩 중 늦은 쪽까지 스켈레톤을 보여준다.
 */
export function useCapitalWeather() {
  const uiStore = useUiStore()

  // 나라 카드 목록 — 각 나라의 수도(첫 도시) 실황을 함께 보여준다
  const countryCards = ref(
    countries.map((country) => ({
      code: country.code,
      name: country.name,
      english: country.english,
      capital: country.cities[0].name,
      temp: country.cities[0].mockTemp,
      status: country.cities[0].mockStatus,
      glyph: null,
      tz: MOCK_TZ[country.code],
    })),
  )

  const isLoading = ref(false)
  const dataSource = ref('mock')

  const cacheWarm = hasApiKey && countries.every((c) => hasCachedCity(c.cities[0].english))
  const fetchDone = ref(!hasApiKey)
  const minDone = ref(cacheWarm)
  const loaded = computed(() => fetchDone.value && minDone.value)

  // 5개국 수도 실황을 병렬로 받아온다. 실패하면 목데이터를 유지한다
  const loadCapitals = async () => {
    if (!hasApiKey) {
      uiStore.markReady()
      return
    }
    isLoading.value = true
    try {
      const results = await Promise.all(
        countries.map((country) => fetchCityWeather(country.cities[0].english)),
      )
      countryCards.value = countryCards.value.map((card, i) => ({
        ...card,
        temp: results[i].main.temp,
        status: normalizeDescription(results[i].weather[0].description),
        glyph: mapMainToGlyph(results[i].weather[0].main),
        tz: results[i].timezone,
      }))
      dataSource.value = 'live'
    } catch (error) {
      console.error('[Axios] 수도 실황 연동 실패, 목데이터로 표시합니다:', error)
    } finally {
      isLoading.value = false
      fetchDone.value = true
      uiStore.markReady()
    }
  }

  onMounted(() => {
    loadCapitals()
    if (!cacheWarm) {
      setTimeout(() => {
        minDone.value = true
      }, 1300)
    }
  })

  return { countryCards, isLoading, dataSource, loaded }
}
