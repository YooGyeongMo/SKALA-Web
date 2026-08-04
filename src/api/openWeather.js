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
 * 관측 시각(dt, 초 단위)을 "오후 2:00 관측" 형태의 문구로 바꾼다.
 */
export const formatObservedAt = (dtSeconds) => {
  const time = new Date(dtSeconds * 1000).toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  })
  return `${time} 관측`
}
