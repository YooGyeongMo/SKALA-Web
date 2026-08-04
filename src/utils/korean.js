/**
 * 한국어 조사 유틸
 */

// 받침 유무에 따라 이/가를 붙인다. (서울이, 제주가)
// 한글이 아닌 글자로 끝나면 무난하게 "이(가)"를 쓴다.
export const withIGa = (word) => {
  const last = word.charCodeAt(word.length - 1)
  if (last < 0xac00 || last > 0xd7a3) return `${word}이(가)`
  const hasBatchim = (last - 0xac00) % 28 > 0
  return `${word}${hasBatchim ? '이' : '가'}`
}
