<script setup>
import { troubleshooting } from '@/data/troubleshooting'

// 트러블슈팅 게시판 — Element Plus의 el-table을 사용한다.
// 행을 펼치면 문제와 해결 과정을 읽을 수 있고,
// 이슈·PR 번호는 저장소로 바로 연결된다.
const rows = troubleshooting

// Day 태그 색 — 잉크 기조를 해치지 않게 회색 계열로 통일
const tagType = (tag) =>
  ({ 반응형: 'danger', 라우팅: 'warning', 'SPA': 'warning', '로딩 UX': 'success' })[tag] ?? 'info'
</script>

<template>
  <div class="trouble">
    <header class="trouble-head">
      <p class="section-label">Troubleshooting</p>
      <h1 class="trouble-title">트러블슈팅 기록</h1>
      <p class="trouble-sub">
        실습 중 실제로 만난 문제 {{ rows.length }}건 — 각 기록은 저장소의 이슈와 PR로 연결됩니다.
      </p>
    </header>

    <el-table :data="rows" style="width: 100%" row-key="title">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="expand-body">
            <p class="expand-label">문제</p>
            <p class="expand-text">{{ row.problem }}</p>
            <p class="expand-label">해결</p>
            <p class="expand-text">{{ row.solution }}</p>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="구분" width="90">
        <template #default="{ row }">
          <el-tag size="small" effect="plain">{{ row.day }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="분류" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="tagType(row.tag)" effect="light">{{ row.tag }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="제목" min-width="300" />

      <el-table-column label="이슈" width="80">
        <template #default="{ row }">
          <el-link v-if="row.issue" :href="row.issueUrl" target="_blank" type="primary">
            #{{ row.issue }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="PR" width="80">
        <template #default="{ row }">
          <el-link v-if="row.pr" :href="row.prUrl" target="_blank" type="primary">
            #{{ row.pr }}
          </el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.trouble {
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--s6) var(--s3);
}

.trouble-head {
  margin-bottom: var(--s4);
}

.trouble-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-top: var(--s1);
}

.trouble-sub {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}

.expand-body {
  padding: var(--s2) var(--s4);
  display: grid;
  gap: 6px;
}

.expand-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.expand-text {
  font-size: 13.5px;
  line-height: 1.75;
  margin-bottom: var(--s1);
}
</style>
