<script setup>
// 나라 윤곽 라인 드로잉
// 랜드마크와 같은 문법(가는 선, pathLength 기반 드로잉)으로 나라의 실루엣을 그린다.
// 정밀 지도가 아니라 형태가 읽히는 수준으로 단순화한 선이다.
defineProps({
  countryCode: {
    type: String,
    required: true, // kr · cn · jp · de · us
  },
})
</script>

<template>
  <span class="outline" aria-hidden="true">
    <!-- 한국: 한반도 남부 — 동해안이 볼록하고 남서가 잘게 갈라진 실루엣과 제주 -->
    <svg v-if="countryCode === 'kr'" viewBox="0 0 200 200">
      <path pathLength="1" d="M96 22 C112 16 126 24 130 38 C138 54 132 70 142 84 C152 100 148 122 136 138 C126 152 108 158 94 152 C80 158 64 150 60 136 C50 138 44 128 50 120 C42 108 46 92 56 84 C52 68 60 50 72 42 C78 30 86 26 96 22 Z" />
      <path pathLength="1" d="M60 176 a12 7 0 1 0 24 0 a12 7 0 1 0 -24 0" />
    </svg>

    <!-- 중국: 동쪽으로 넓게 퍼진 대륙 실루엣 -->
    <svg v-else-if="countryCode === 'cn'" viewBox="0 0 200 200">
      <path pathLength="1" d="M38 84 C30 68 42 52 58 50 C66 36 84 30 100 36 C114 26 134 30 144 42 C160 44 172 58 168 74 C178 84 176 100 166 108 C170 122 160 134 146 136 C142 150 128 158 114 152 C104 162 88 162 78 152 C64 156 50 148 48 134 C36 130 30 116 36 104 C28 98 30 88 38 84 Z" />
      <path pathLength="1" d="M120 158 C126 166 138 168 146 162" />
    </svg>

    <!-- 일본: 북동에서 남서로 이어지는 네 개의 섬 -->
    <svg v-else-if="countryCode === 'jp'" viewBox="0 0 200 200">
      <path pathLength="1" d="M138 30 C150 24 164 30 166 42 C168 54 158 62 146 60 C136 58 132 48 138 30 Z" />
      <path pathLength="1" d="M132 70 C144 72 150 84 144 96 C136 112 118 124 100 132 C88 138 76 136 72 126 C68 116 76 108 88 102 C104 94 118 80 132 70 Z" />
      <path pathLength="1" d="M66 138 C74 134 82 138 82 146 C82 154 72 158 64 154 C58 150 60 142 66 138 Z" />
      <path pathLength="1" d="M44 150 C54 146 62 152 60 162 C58 172 46 176 38 170 C32 164 36 154 44 150 Z" />
    </svg>

    <!-- 독일: 세로로 선 중부 유럽 실루엣 -->
    <svg v-else-if="countryCode === 'de'" viewBox="0 0 200 200">
      <path pathLength="1" d="M86 26 C98 18 114 22 120 34 C134 34 144 46 140 58 C150 66 150 82 140 90 C146 102 140 116 128 120 C130 134 120 146 106 146 C102 158 88 164 76 158 C62 162 50 152 52 138 C42 132 40 118 48 110 C40 100 42 84 52 78 C48 64 56 50 68 46 C70 34 78 28 86 26 Z" />
    </svg>

    <!-- 미국: 본토와 플로리다 곶, 서해안 사선 -->
    <svg v-else viewBox="0 0 200 200">
      <path pathLength="1" d="M30 66 C50 58 76 54 100 56 C126 58 152 56 170 64 C176 74 172 86 174 96 C176 108 168 116 158 118 C152 128 156 140 150 150 C144 158 136 150 134 142 C130 132 122 128 110 128 C88 128 66 124 50 114 C38 106 28 92 30 66 Z" />
      <path pathLength="1" d="M148 122 C154 132 158 144 154 154" />
    </svg>
  </span>
</template>

<style scoped>
.outline {
  display: inline-block;
  line-height: 0;
}

.outline svg {
  width: 100%;
  height: auto;
}

.outline path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
