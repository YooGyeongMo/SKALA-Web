/**
 * 시간 표시 유틸
 */

// 타임존 오프셋(초)을 반영한 현지 시각을 HH:MM 24시간제로 만든다
export const tzClock = (nowMs, tzSeconds) => {
  const d = new Date(nowMs + tzSeconds * 1000)
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const mm = String(d.getUTCMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

// API 연동 전(목데이터)일 때 쓸 나라별 기본 타임존 오프셋(초)
export const MOCK_TZ = { kr: 32400, cn: 28800, jp: 32400, de: 7200, us: -18000 }
