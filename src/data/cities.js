/**
 * 도시 날씨 데이터 단일 출처 (Single Source of Truth)
 *
 * 홈 대시보드와 상세 페이지가 같은 데이터를 바라보도록 한 곳에 모았다.
 * Day 6부터는 OpenWeatherMap 실시간 데이터가 우선이고,
 * 이 목데이터는 API 키가 없거나 통신이 실패했을 때의 폴백으로 쓰인다.
 * english는 OpenWeather 조회용 도시 영문명이다.
 */
export const cityList = [
  {
    id: 'city_01',
    name: '서울',
    english: 'Seoul',
    temp: 28,
    status: '맑음',
    landmark: '경복궁',
    detail: { feels: 30, humidity: 42, wind: 2.4, clouds: 20, pressure: 1012, observedAt: '오늘 14:00' },
  },
  {
    id: 'city_02',
    name: '수원',
    english: 'Suwon',
    temp: 24,
    status: '비',
    landmark: '수원 화성',
    detail: { feels: 23, humidity: 88, wind: 4.1, clouds: 90, pressure: 1006, observedAt: '오늘 14:00' },
  },
  {
    id: 'city_03',
    name: '부산',
    english: 'Busan',
    temp: 26,
    status: '구름',
    landmark: '광안대교',
    detail: { feels: 27, humidity: 65, wind: 5.8, clouds: 55, pressure: 1010, observedAt: '오늘 14:00' },
  },
  {
    id: 'city_04',
    name: '제주',
    english: 'Jeju City',
    temp: 18,
    status: '흐림',
    landmark: '한라산',
    detail: { feels: 17, humidity: 74, wind: 7.2, clouds: 75, pressure: 1009, observedAt: '오늘 14:00' },
  },
]

// 도시 코드로 단건 조회한다. 없는 코드는 null을 돌려준다.
export const findCityById = (cityId) => cityList.find((city) => city.id === cityId) ?? null
