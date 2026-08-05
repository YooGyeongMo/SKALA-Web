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
      화면은 부품의 조립입니다. 처음 만든 날씨 카드가 지금도 모든 화면에서 같은 부품으로
      일합니다. props로 데이터를 받고 emits로 의사만 알리는 단방향 규칙을 지킨 덕분에,
      화면이 늘어나는 동안에도 부품은 늘지 않았습니다.
    </p>
    <p>
      데이터는 한 번 받아오면 5분을 기억합니다. 같은 도시를 다시 물으면 네트워크 대신
      메모리가 먼저 답하고, 캐시가 따뜻한 재방문에는 스켈레톤조차 띄우지 않습니다.
      기다림이 실재할 때만 보여준다는 원칙은 화면이 아니라 캐시 설계에서 시작됩니다.
      과거의 실습 화면은 실습 아카이브에 당시 모습 그대로, 막혔던 과정은 트러블슈팅
      게시판에 남겨 두었습니다.
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
