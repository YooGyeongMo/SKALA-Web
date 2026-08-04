<script setup>
// 도시별 랜드마크 라인 드로잉
// 사진 대신 가는 선(기하학) 일러스트로 도시의 정체성을 표현한다.
// 색은 부모의 currentColor를 따르고, 알파는 부모가 opacity로 조절한다.
defineProps({
  cityId: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span class="landmark" aria-hidden="true">
    <!-- 서울: 경복궁 — 양끝이 올라간 처마 곡선과 기둥, 기단 -->
    <svg v-if="cityId === 'city_01'" viewBox="0 0 320 180">
      <path d="M92 34 H228" />
      <path d="M92 34 L48 66 M228 34 L272 66" />
      <path d="M28 58 Q160 92 292 58" />
      <path d="M14 104 Q160 142 306 104" />
      <path d="M76 126 V158 M132 136 V158 M188 136 V158 M244 126 V158" />
      <path d="M44 158 H276 M56 170 H264" />
    </svg>

    <!-- 수원: 화성 장안문 — 여장(요철 성곽)과 홍예문, 문루 -->
    <svg v-else-if="cityId === 'city_02'" viewBox="0 0 320 180">
      <path d="M20 100 H56 V86 H82 V100 H120 V86 H146 V100 H174 V86 H200 V100 H238 V86 H264 V100 H300" />
      <path d="M20 100 V162 M300 100 V162 M20 162 H300" />
      <path d="M128 162 V128 A32 32 0 0 1 192 128 V162" />
      <path d="M104 64 Q160 46 216 64" />
      <path d="M122 64 V86 M198 64 V86" />
    </svg>

    <!-- 부산: 광안대교 — 두 주탑과 케이블, 수면 -->
    <svg v-else-if="cityId === 'city_03'" viewBox="0 0 320 180">
      <path d="M10 118 H310" />
      <path d="M94 118 V52 M110 118 V52 M94 72 H110" />
      <path d="M210 118 V52 M226 118 V52 M210 72 H226" />
      <path d="M110 52 Q160 96 210 52" />
      <path d="M10 100 Q55 56 94 52 M226 52 Q265 56 310 100" />
      <path d="M136 82 V118 M160 90 V118 M184 82 V118" />
      <path d="M34 148 H86 M132 156 H188 M234 148 H286" />
    </svg>

    <!-- 제주: 한라산 — 분화구가 오목한 능선과 오름, 수평선 -->
    <svg v-else viewBox="0 0 320 180">
      <path d="M10 140 H310" />
      <path d="M36 140 C96 84 138 66 152 62 Q160 70 168 62 C182 66 224 84 284 140" />
      <path d="M56 140 Q72 124 88 140" />
      <path d="M236 140 Q256 114 276 140" />
      <path d="M96 100 H136 M204 92 H236" />
    </svg>
  </span>
</template>

<style scoped>
.landmark {
  display: inline-block;
  line-height: 0;
}

.landmark svg {
  width: 100%;
  height: auto;
}

.landmark path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
