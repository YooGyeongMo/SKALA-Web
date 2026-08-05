<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cityList } from '@/data/cities'
import { withIGa } from '@/utils/korean'

// 3일차 과제(날씨 컴포넌트)를 Element Plus로 재구성한 버전.
// 기능은 동일하고, 직접 만든 부품을 EP 컴포넌트로 바꿨다.
// input → el-input / BaseDashboardCard → el-card / 칩 → el-tag
// 버튼 → el-button / window.alert → ElMessageBox / 상태바 → el-alert + ElMessage
const weatherList = ref([...cityList])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 온도 구간에 따라 el-tag의 시맨틱 타입을 고른다
const tierType = (temp) => {
  if (temp >= 25) return 'danger'
  if (temp >= 20) return 'warning'
  return 'info'
}

const tierLabel = (temp) => {
  if (temp >= 25) return '더움 (25도 이상)'
  if (temp >= 20) return '보통 (20~24도)'
  return '선선함 (20도 미만)'
}

const selectCity = (item) => {
  selectedCityInfo.value = `${withIGa(item.name)} 선택되었습니다.`
  // ElMessage — 우상단 토스트로도 알려준다
  ElMessage({ message: selectedCityInfo.value, type: 'success', duration: 1500 })
}

const showDetail = (item) => {
  // window.alert 대신 ElMessageBox
  ElMessageBox.alert(`${item.name}의 현재 날씨는 [${item.status}] 상태입니다.`, '상세 날씨', {
    confirmButtonText: '확인',
  })
}
</script>

<template>
  <div class="element-practice">
    <!-- el-card: 검색 박스 -->
    <el-card shadow="never" class="ep-card">
      <template #header>도시 검색</template>
      <el-input
        v-model="searchQuery"
        placeholder="검색할 도시 이름 입력"
        clearable
        size="large"
      />
      <p class="search-echo">
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </el-card>

    <!-- el-card: 날씨 리스트 -->
    <el-card shadow="never" class="ep-card">
      <template #header>지역별 날씨 현황</template>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="ep-row"
        @click="selectCity(item)"
      >
        <div class="ep-row-main">
          <span class="ep-city">{{ item.name }}</span>
          <span class="ep-status">{{ item.status }}</span>
          <el-tag :type="tierType(item.temp)" size="small" effect="light" round>
            {{ tierLabel(item.temp) }}
          </el-tag>
        </div>
        <div class="ep-row-side">
          <span class="ep-temp">{{ item.temp }}°C</span>
          <el-button size="small" @click.stop="showDetail(item)">상세보기</el-button>
        </div>
      </div>

      <el-empty
        v-if="filteredWeatherList.length === 0"
        description="검색 결과와 일치하는 도시가 없습니다"
        :image-size="60"
      />
    </el-card>

    <!-- el-alert: 상태바 -->
    <el-alert :title="selectedCityInfo" type="success" :closable="false" show-icon />
  </div>
</template>

<style scoped>
.element-practice {
  display: grid;
  gap: var(--s2);
  max-width: 560px;
}

.ep-card :deep(.el-card__header) {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.search-echo {
  margin-top: var(--s1);
  font-size: 13px;
  color: var(--muted);
}

.search-echo strong {
  color: var(--ink);
}

.ep-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  transition: background 0.15s;
}

.ep-row:last-of-type {
  border-bottom: none;
}

.ep-row:hover {
  background: var(--canvas);
}

.ep-row-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ep-city {
  font-size: 15px;
  font-weight: 700;
}

.ep-status {
  font-size: 12px;
  color: var(--muted);
}

.ep-row-side {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ep-temp {
  font-size: 18px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}
</style>
