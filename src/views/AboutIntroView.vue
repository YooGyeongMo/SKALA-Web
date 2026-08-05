<script setup>
// 소개 탭 — 프로젝트가 무엇이고 어떤 실습이 쌓여 있는지 설명한다
</script>

<template>
  <div class="about-body">
    <p>
      SKALA Weather는 Vue 3 실습으로 만든 세계 날씨 대시보드입니다. 3D 지구본이나 접근성 홈에서
      나라를 고르면 대표 도시 10곳의 실시간 날씨가 열리고, 상세 페이지에서는 체감 온도, 습도,
      바람 같은 관측 정보와 24시간 예보, 대기질, 미니멀 지도까지 확인할 수 있습니다.
    </p>
    <p>
      Day 1부터 3까지 만든 대시보드 컴포넌트 위에, Day 4의 Vue Router 페이지 전환, Day 5의
      Pinia 전역 상태, Day 6의 Axios와 OpenWeather 실시간 연동, Day 7의 Element Plus 통일까지
      하루치 실습을 같은 저장소에 층층이 쌓아 올렸습니다. 이전 날의 화면은 실습 아카이브에서
      당시 모습 그대로 열어볼 수 있고, 막혔던 과정은 트러블슈팅 게시판에 기록해 두었습니다.
    </p>
    <ul class="about-stack">
      <li>Vue 3 Composition API와 props, emits, slot을 활용한 컴포넌트 재사용</li>
      <li>Vue Router의 동적 매칭, 지연 로딩, Catch-all과 뎁스가 드러나는 경로 설계</li>
      <li>Pinia 전역 상태로 온도 단위 전환, localStorage 지속</li>
      <li>Axios 인스턴스와 OpenWeather 실시간 관측, 5분 메모리 캐시와 목데이터 폴백</li>
      <li>Element Plus 잉크 프리셋과 캐시를 인지하는 스켈레톤 로딩</li>
      <li>three.js 지구본과 SVG 라인 드로잉으로 그린 랜드마크 50곳, 국기 엠블럼</li>
    </ul>
  </div>
</template>

<style scoped>
.about-body p {
  font-size: 16.5px;
  line-height: 1.9;
  margin-bottom: var(--s2);
}

.about-stack {
  list-style: none;
  display: grid;
  gap: var(--s1);
  margin: var(--s3) 0 var(--s4) 0;
  font-size: 15px;
}

.about-stack li {
  border: 1px solid var(--line);
  background: var(--paper);
  padding: 12px var(--s2);
}
</style>
