<script setup>
import { useRoute, useRouter } from 'vue-router'

// Catch-all 라우트로 들어온 잘못된 경로를 그대로 보여준다
const route = useRoute()
const router = useRouter()

// 이전 화면으로 돌아간다. 주소를 직접 열어 히스토리가 없으면 홈으로 보낸다
const goBack = () => {
  if (window.history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="not-found">
    <p class="nf-code">404</p>
    <h1 class="nf-title">페이지를 찾을 수 없습니다</h1>
    <p class="nf-path">
      요청 경로: <code>{{ route.fullPath }}</code>
    </p>
    <button class="btn-home" @click="goBack">← 이전 화면으로 돌아가기</button>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 640px;
  margin: 0 auto;
  padding: var(--s8) var(--s3);
  text-align: center;
}

.nf-code {
  font-size: 96px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.nf-title {
  font-size: 20px;
  font-weight: 700;
  margin: var(--s2) 0;
}

.nf-path {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: var(--s4);
}

.nf-path code {
  font-family: var(--font-mono);
  font-size: 12px;
  background: var(--canvas);
  border: 1px solid var(--line);
  padding: 1px 6px;
}

.btn-home {
  cursor: pointer;
  display: inline-block;
  padding: 10px var(--s3);
  font-size: 13px;
  font-weight: 600;
  background: var(--ink);
  color: var(--paper);
  border: 1px solid var(--line-strong);
  text-decoration: none;
  transition: all 0.15s;
}

.btn-home:hover {
  background: var(--paper);
  color: var(--ink);
}
</style>
