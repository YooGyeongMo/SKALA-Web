<template>
  <!-- 검색 박스와 리스트 박스의 공통 디자인을 담당하는 래퍼 컴포넌트.
       내용은 부모가 slot으로 주입한다 -->
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: var(--paper);
  border: 1px solid var(--line-strong);
  padding: var(--s2);
  margin-bottom: var(--s2);
}
</style>
