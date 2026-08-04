/**
 * 도시 날씨 데이터 단일 출처 (Single Source of Truth)
 *
 * 홈 대시보드와 상세 페이지가 같은 데이터를 바라보도록 한 곳에 모았다.
 * 아직 스토어 라이브러리를 배우기 전이므로, 배운 범위(모듈 분리와 ref) 안에서
 * "정의는 한 곳에서, 소비는 여러 곳에서" 원칙만 지킨다.
 * 이후 API 연동 시 이 파일만 교체하면 된다.
 */
export const cityList = [
  {
    id: 'city_01',
    name: '서울',
    temp: 28,
    status: '맑음',
    landmark: '경복궁',
    detail: { feels: 30, humidity: 42, wind: 2.4, rain: 0, dust: '보통', observedAt: '오늘 14:00' },
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    status: '비',
    landmark: '수원 화성',
    detail: { feels: 23, humidity: 88, wind: 4.1, rain: 80, dust: '좋음', observedAt: '오늘 14:00' },
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 26,
    status: '구름',
    landmark: '광안대교',
    detail: { feels: 27, humidity: 65, wind: 5.8, rain: 20, dust: '보통', observedAt: '오늘 14:00' },
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 18,
    status: '흐림',
    landmark: '한라산',
    detail: { feels: 17, humidity: 74, wind: 7.2, rain: 40, dust: '좋음', observedAt: '오늘 14:00' },
  },
]

// 도시 코드로 단건 조회한다. 없는 코드는 null을 돌려준다.
export const findCityById = (cityId) => cityList.find((city) => city.id === cityId) ?? null
