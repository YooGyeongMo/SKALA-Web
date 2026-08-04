/**
 * 나라별 대표 도시 데이터 단일 출처
 *
 * 홈(나라 선택)과 나라별 도시 목록, 상세 페이지가 모두 이 파일을 바라본다.
 * english는 OpenWeather 조회용 명칭이고, mockTemp/mockStatus는
 * API 키가 없거나 통신이 실패했을 때 보여줄 폴백 값이다.
 * 각 나라의 첫 번째 도시가 수도(대표 도시)로, 홈 카드 실황에 쓰인다.
 */
const city = (id, name, english, mockTemp, mockStatus, landmark) => ({
  id,
  name,
  english,
  mockTemp,
  mockStatus,
  landmark,
})

export const countries = [
  {
    code: 'kr',
    name: '한국',
    english: 'South Korea',
    cities: [
      city('city_01', '서울', 'Seoul', 28, '맑음', '경복궁'),
      city('kr_incheon', '인천', 'Incheon', 27, '구름'),
      city('city_02', '수원', 'Suwon', 24, '비', '수원 화성'),
      city('kr_daejeon', '대전', 'Daejeon', 27, '맑음'),
      city('kr_daegu', '대구', 'Daegu', 30, '맑음'),
      city('kr_gwangju', '광주', 'Gwangju', 28, '구름'),
      city('kr_ulsan', '울산', 'Ulsan', 27, '구름'),
      city('city_03', '부산', 'Busan', 26, '구름', '광안대교'),
      city('kr_gangneung', '강릉', 'Gangneung', 25, '맑음'),
      city('city_04', '제주', 'Jeju City', 18, '흐림', '돌하르방'),
    ],
  },
  {
    code: 'cn',
    name: '중국',
    english: 'China',
    cities: [
      city('cn_beijing', '베이징', 'Beijing', 30, '맑음'),
      city('cn_shanghai', '상하이', 'Shanghai', 31, '구름'),
      city('cn_guangzhou', '광저우', 'Guangzhou', 33, '비'),
      city('cn_shenzhen', '선전', 'Shenzhen', 32, '구름'),
      city('cn_chengdu', '청두', 'Chengdu', 28, '흐림'),
      city('cn_xian', '시안', "Xi'an", 31, '맑음'),
      city('cn_hangzhou', '항저우', 'Hangzhou', 30, '구름'),
      city('cn_wuhan', '우한', 'Wuhan', 32, '맑음'),
      city('cn_chongqing', '충칭', 'Chongqing', 33, '흐림'),
      city('cn_harbin', '하얼빈', 'Harbin', 24, '맑음'),
    ],
  },
  {
    code: 'jp',
    name: '일본',
    english: 'Japan',
    cities: [
      city('jp_tokyo', '도쿄', 'Tokyo', 29, '구름'),
      city('jp_osaka', '오사카', 'Osaka', 30, '맑음'),
      city('jp_kyoto', '교토', 'Kyoto', 30, '맑음'),
      city('jp_yokohama', '요코하마', 'Yokohama', 28, '구름'),
      city('jp_nagoya', '나고야', 'Nagoya', 29, '구름'),
      city('jp_sapporo', '삿포로', 'Sapporo', 22, '맑음'),
      city('jp_fukuoka', '후쿠오카', 'Fukuoka', 29, '비'),
      city('jp_kobe', '고베', 'Kobe', 29, '구름'),
      city('jp_hiroshima', '히로시마', 'Hiroshima', 29, '맑음'),
      city('jp_sendai', '센다이', 'Sendai', 25, '흐림'),
    ],
  },
  {
    code: 'de',
    name: '독일',
    english: 'Germany',
    cities: [
      city('de_berlin', '베를린', 'Berlin', 22, '구름'),
      city('de_munich', '뮌헨', 'Munich', 21, '맑음'),
      city('de_hamburg', '함부르크', 'Hamburg', 19, '비'),
      city('de_frankfurt', '프랑크푸르트', 'Frankfurt', 23, '구름'),
      city('de_cologne', '쾰른', 'Cologne', 22, '구름'),
      city('de_stuttgart', '슈투트가르트', 'Stuttgart', 22, '맑음'),
      city('de_dusseldorf', '뒤셀도르프', 'Dusseldorf', 21, '흐림'),
      city('de_leipzig', '라이프치히', 'Leipzig', 22, '구름'),
      city('de_dresden', '드레스덴', 'Dresden', 22, '맑음'),
      city('de_nuremberg', '뉘른베르크', 'Nuremberg', 21, '구름'),
    ],
  },
  {
    code: 'us',
    name: '미국',
    english: 'United States',
    cities: [
      city('us_newyork', '뉴욕', 'New York', 27, '맑음'),
      city('us_la', '로스앤젤레스', 'Los Angeles', 25, '맑음'),
      city('us_chicago', '시카고', 'Chicago', 26, '구름'),
      city('us_houston', '휴스턴', 'Houston', 33, '맑음'),
      city('us_miami', '마이애미', 'Miami', 31, '비'),
      city('us_seattle', '시애틀', 'Seattle', 21, '흐림'),
      city('us_sf', '샌프란시스코', 'San Francisco', 19, '흐림'),
      city('us_lasvegas', '라스베이거스', 'Las Vegas', 38, '맑음'),
      city('us_boston', '보스턴', 'Boston', 25, '구름'),
      city('us_dc', '워싱턴', 'Washington', 28, '맑음'),
    ],
  },
]

export const allCities = countries.flatMap((country) => country.cities)

// 도시 코드로 단건 조회한다. 없는 코드는 null을 돌려준다.
export const findCityById = (cityId) => allCities.find((c) => c.id === cityId) ?? null

// 나라 코드로 단건 조회한다.
export const findCountryByCode = (code) => countries.find((c) => c.code === code) ?? null

// 실측값이 없을 때 상세 페이지에 보여줄 무난한 목데이터를 만든다.
export const makeMockDetail = (temp) => ({
  feels: temp + 2,
  humidity: 60,
  wind: 3.2,
  windDir: '북서',
  clouds: 40,
  pressure: 1010,
  visibility: '10km',
  sunrise: '오전 5:30',
  sunset: '오후 7:40',
  observedAt: '오늘 14:00',
})
