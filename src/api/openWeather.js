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

/**
 * 도시 영문명으로 현재 날씨를 조회한다.
 * units=metric(섭씨), lang=kr(한글 설명)을 기본으로 사용한다.
 */
export async function fetchCityWeather(englishName) {
  const { data } = await client.get('/weather', {
    params: { q: englishName, appid: API_KEY, units: 'metric', lang: 'kr' },
  })
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
  '온흐림': '흐림',
  '튼구름': '구름 많음',
  '구름조금': '구름 조금',
  '약간의 구름': '구름 조금',
  '실 비': '가랑비',
  '실비': '가랑비',
  '보통 비': '비',
  '약한 비': '약한 비',
  '박무': '엷은 안개',
  '연무': '연무',
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
