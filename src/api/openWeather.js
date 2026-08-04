import axios from 'axios'

/**
 * OpenWeatherMap 통신 모듈
 *
 * API 키는 공개 저장소에 올라가지 않도록 .env(VITE_OPENWEATHER_API_KEY)에서 읽는다.
 * 키가 없거나 통신이 실패하면 호출부에서 목데이터(cities.js)로 폴백한다.
 */
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// 호출부가 폴백 여부를 판단할 수 있도록 키 존재 여부를 공개한다
export const hasApiKey = Boolean(API_KEY)

// 공용 인스턴스 — 베이스 주소와 타임아웃을 한 곳에서 관리한다
const client = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 5000,
})

// 간단한 메모리 캐시 — 같은 도시를 5분 안에 다시 조회하면 네트워크 없이 즉시 반환한다.
// 화면 사이를 오갈 때 목데이터가 깜빡였다가 실데이터로 바뀌는 현상을 없앤다.
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000

/**
 * 도시 영문명으로 현재 날씨를 조회한다.
 * units=metric(섭씨), lang=kr(한글 설명)을 기본으로 사용한다.
 */
export async function fetchCityWeather(englishName) {
  const hit = cache.get(englishName)
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return hit.data
  }
  const { data } = await client.get('/weather', {
    params: { q: englishName, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  cache.set(englishName, { data, ts: Date.now() })
  return data
}

/**
 * 현재 좌표로 날씨를 조회한다. 내 위치의 도시명 표시에 쓴다.
 */
export async function fetchWeatherByCoords(lat, lon) {
  const key = `@${lat.toFixed(2)},${lon.toFixed(2)}`
  const hit = cache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return hit.data
  }
  const { data } = await client.get('/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
  cache.set(key, { data, ts: Date.now() })
  return data
}

/**
 * OpenWeather의 대분류(weather[0].main)를 글리프용 상태로 매핑한다.
 * 표시는 한글 설명(description)을 쓰되, 아이콘은 4종으로 수렴시킨다.
 */
const GLYPH_BY_MAIN = {
  Clear: '맑음',
  Clouds: '구름',
  Rain: '비',
  Drizzle: '비',
  Thunderstorm: '비',
  Snow: '흐림',
  Mist: '흐림',
  Fog: '흐림',
  Haze: '흐림',
}

export const mapMainToGlyph = (main) => GLYPH_BY_MAIN[main] ?? '구름'

/**
 * OpenWeather의 한국어 번역이 예스러운 표현이 많아 자연스럽게 정규화한다.
 * (실 비 = light rain, 온흐림 = overcast clouds, 튼구름 = broken clouds)
 * 목록에 없는 표현은 원문을 그대로 쓴다.
 */
const NATURAL_KO = {
  // 구름 (80x)
  '약간의 구름이 낀 하늘': '구름 조금',
  '약간의 구름': '구름 조금',
  '구름조금': '구름 조금',
  '튼구름': '구름 많음',
  '온흐림': '흐림',
  // 비 (5xx)
  '실 비': '가랑비',
  '실비': '가랑비',
  '보통 비': '비',
  '강한 비': '강한 비',
  '매우 강한 비': '매우 강한 비',
  '극심한 비': '폭우',
  '우박': '우박',
  '약한 소나기 비': '약한 소나기',
  '소나기 비': '소나기',
  '강한 소나기 비': '강한 소나기',
  '불규칙적 소나기 비': '오락가락 소나기',
  // 이슬비 (3xx)
  '가벼운 안개비': '이슬비',
  '안개비': '이슬비',
  '강한 안개비': '굵은 이슬비',
  '가벼운 적은비': '이슬비',
  '적은비': '이슬비',
  '강한 적은비': '굵은 이슬비',
  '소나기와 안개비': '이슬비 소나기',
  '강한 소나기와 안개비': '굵은 이슬비 소나기',
  // 뇌우 (2xx)
  '가벼운 비를 동반한 천둥구름': '약한 비를 동반한 뇌우',
  '비를 동반한 천둥구름': '비를 동반한 뇌우',
  '폭우를 동반한 천둥구름': '폭우를 동반한 뇌우',
  '약한 천둥구름': '약한 뇌우',
  '천둥구름': '뇌우',
  '강한 천둥구름': '강한 뇌우',
  '불규칙적 천둥구름': '오락가락 뇌우',
  '약한 연무를 동반한 천둥구름': '이슬비를 동반한 뇌우',
  '안개비를 동반한 천둥구름': '이슬비를 동반한 뇌우',
  '강한 안개비를 동반한 천둥구름': '굵은 이슬비를 동반한 뇌우',
  // 눈 (6xx)
  '가벼운 눈': '약한 눈',
  '눈': '눈',
  '강한 눈': '강한 눈',
  '진눈깨비': '진눈깨비',
  '소나기 진눈깨비': '진눈깨비 소나기',
  '약한 비와 눈': '약한 진눈깨비',
  '비와 눈': '진눈깨비',
  '약한 소나기 눈': '약한 눈 소나기',
  '소나기 눈': '눈 소나기',
  '강한 소나기 눈': '강한 눈 소나기',
  // 대기 (7xx)
  '박무': '엷은 안개',
  '연기': '연기',
  '연무': '연무',
  '모래 먼지': '모래 먼지',
  '안개': '안개',
  '모래': '모래 바람',
  '먼지': '먼지',
  '화산재': '화산재',
  '돌풍': '돌풍',
  '토네이도': '토네이도',
}

export const normalizeDescription = (description) => NATURAL_KO[description] ?? description

/**
 * 풍향(도)을 8방위 한국어 표현으로 바꾼다. (0도 = 북)
 */
const WIND_DIRS = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']

export const windDirection = (deg) => WIND_DIRS[Math.round(deg / 45) % 8] ?? ''

/**
 * 가시거리(m)를 읽기 좋은 km 문구로 바꾼다.
 */
export const formatVisibility = (meters) =>
  meters >= 1000 ? `${Math.round(meters / 100) / 10}km` : `${meters}m`

/**
 * 관측 시각(dt, 초 단위)을 "오후 2:00" 형태의 시각 문구로 바꾼다.
 */
export const formatObservedAt = (dtSeconds) =>
  new Date(dtSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  })
