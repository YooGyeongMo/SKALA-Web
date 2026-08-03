<script setup>
// 레슨 공통 레이아웃
// 좌측: 과제 요구사항(spec 슬롯) / 우측: 실습 화면(preview 슬롯)
defineProps({
  index: {
    type: String,
    required: true, // 예: '01'
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="lesson">
    <!-- 헤더: 큰 인덱스 숫자 + 제목 + 가는 룰 -->
    <header class="lesson-head">
      <span class="lesson-index">{{ index }}</span>
      <div class="lesson-title-group">
        <h2 class="lesson-title">{{ title }}</h2>
        <p v-if="subtitle" class="lesson-subtitle">{{ subtitle }}</p>
      </div>
    </header>

    <div class="lesson-body">
      <!-- 좌: 요구사항 -->
      <aside class="lesson-spec">
        <p class="section-label">과제 요구사항</p>
        <slot name="spec"></slot>
      </aside>

      <!-- 우: 실습 프리뷰 -->
      <div class="lesson-preview">
        <p class="section-label">Live</p>
        <div class="preview-canvas">
          <slot name="preview"></slot>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lesson {
  border-top: 2px solid var(--line-strong);
  padding: var(--s4) 0 var(--s8) 0;
}

.lesson-head {
  display: flex;
  align-items: baseline;
  gap: var(--s3);
  margin-bottom: var(--s4);
}

/* 큰 인덱스 숫자 — 기하학적 앵커 */
.lesson-index {
  font-size: 56px;
  font-weight: 200;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.lesson-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.lesson-subtitle {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}

.lesson-body {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--s4);
  align-items: start;
}

/* 좌측 요구사항 패널 — 가는 좌측 룰 */
.lesson-spec {
  border-left: 1px solid var(--line);
  padding-left: var(--s2);
  display: grid;
  gap: var(--s2);
}

/* 우측 프리뷰 — 모눈 캔버스 프레임 */
.lesson-preview {
  display: grid;
  gap: var(--s2);
}

.preview-canvas {
  border: 1px solid var(--line-strong);
  background-color: var(--canvas);
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 24px 24px;
  padding: var(--s4);
}

@media (max-width: 880px) {
  .lesson-body {
    grid-template-columns: 1fr;
  }
}
</style>
