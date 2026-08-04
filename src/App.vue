<script setup>
// App은 내비게이션 바(RouterLink)와 메인 콘텐츠 영역(RouterView)만 담당한다.
// 실제 페이지 내용은 views/ 아래 페이지 컴포넌트가 맡는다.
</script>

<template>
  <div class="app">
    <header class="global-nav">
      <RouterLink to="/" class="brand">SKALA<span class="dot">·</span>WEATHER</RouterLink>
      <nav class="nav-links">
        <RouterLink to="/">홈</RouterLink>
        <RouterLink to="/lessons">Day 1–3 실습</RouterLink>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.global-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--s2) var(--s3);
  border-bottom: 1px solid var(--line-strong);
}

.brand {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: var(--ink);
  text-decoration: none;
}

.brand .dot {
  color: var(--muted);
  margin: 0 2px;
}

.nav-links {
  display: flex;
  gap: var(--s3);
}

.nav-links a {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted);
  text-decoration: none;
  padding-bottom: 3px;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}

.nav-links a:hover {
  color: var(--ink);
}

/* 현재 경로와 정확히 일치하는 링크에 검정 언더라인 */
.nav-links a.router-link-exact-active {
  color: var(--ink);
  font-weight: 700;
  border-bottom-color: var(--ink);
}
</style>
