<template>
  <!-- 검색 박스와 리스트 박스의 공통 디자인을 담당하는 래퍼 컴포넌트.
       내용은 부모가 slot으로 주입한다 -->
  <div class="base-dashboard-card">
    <!-- [튜닝] Named Slot: 카드 제목 영역도 부모가 주입할 수 있다.
         $slots.header가 없으면 헤더 영역 자체를 렌더링하지 않는다 -->
    <header v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </header>

    <slot></slot>

    <!-- [튜닝] Named Slot: 하단 보조 영역 -->
    <footer v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: var(--paper);
  border: 1px solid var(--line-strong);
  padding: var(--s2);
  margin-bottom: var(--s2);
}

.card-header {
  margin-bottom: var(--s2);
  padding-bottom: var(--s1);
  border-bottom: 1px solid var(--line-strong);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.card-footer {
  margin-top: var(--s2);
  padding-top: var(--s1);
  border-top: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
}
</style>
