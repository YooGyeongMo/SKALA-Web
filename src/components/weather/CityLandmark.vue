<script setup>
// 도시별 랜드마크 라인 드로잉
// 사진 대신 가는 선(기하학) 일러스트로 도시의 정체성을 표현한다.
// 색은 부모의 currentColor를 따르고, 알파는 부모가 opacity로 조절한다.
// 준비된 랜드마크가 없는 도시는 아무것도 그리지 않는다.
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
      <path pathLength="1" d="M92 34 H228" />
      <path pathLength="1" d="M92 34 L48 66 M228 34 L272 66" />
      <path pathLength="1" d="M28 58 Q160 92 292 58" />
      <path pathLength="1" d="M14 104 Q160 142 306 104" />
      <path pathLength="1" d="M76 126 V158 M132 136 V158 M188 136 V158 M244 126 V158" />
      <path pathLength="1" d="M44 158 H276 M56 170 H264" />
    </svg>

    <!-- 수원: 화성 장안문 — 여장(요철 성곽)과 홍예문, 문루 -->
    <svg v-else-if="cityId === 'city_02'" viewBox="0 0 320 180">
      <path pathLength="1" d="M20 100 H56 V86 H82 V100 H120 V86 H146 V100 H174 V86 H200 V100 H238 V86 H264 V100 H300" />
      <path pathLength="1" d="M20 100 V162 M300 100 V162 M20 162 H300" />
      <path pathLength="1" d="M128 162 V128 A32 32 0 0 1 192 128 V162" />
      <path pathLength="1" d="M104 64 Q160 46 216 64" />
      <path pathLength="1" d="M122 64 V86 M198 64 V86" />
    </svg>

    <!-- 부산: 광안대교 — 두 주탑과 케이블, 수면 -->
    <svg v-else-if="cityId === 'city_03'" viewBox="0 0 320 180">
      <path pathLength="1" d="M10 118 H310" />
      <path pathLength="1" d="M94 118 V52 M110 118 V52 M94 72 H110" />
      <path pathLength="1" d="M210 118 V52 M226 118 V52 M210 72 H226" />
      <path pathLength="1" d="M110 52 Q160 96 210 52" />
      <path pathLength="1" d="M10 100 Q55 56 94 52 M226 52 Q265 56 310 100" />
      <path pathLength="1" d="M136 82 V118 M160 90 V118 M184 82 V118" />
      <path pathLength="1" d="M34 148 H86 M132 156 H188 M234 148 H286" />
    </svg>

    <!-- 제주: 돌하르방 — 둥근 모자와 큰 눈, 뭉툭한 코, 배 위에 얹은 두 손 -->
    <svg v-else-if="cityId === 'city_04'" viewBox="0 0 320 180">
      <path pathLength="1" d="M118 40 Q160 12 202 40" />
      <path pathLength="1" d="M110 46 H210" />
      <path pathLength="1" d="M126 46 C122 84 130 96 160 98 C190 96 198 84 194 46" />
      <path pathLength="1" d="M137 63 a8 5.5 0 1 0 16 0 a8 5.5 0 1 0 -16 0" />
      <path pathLength="1" d="M167 63 a8 5.5 0 1 0 16 0 a8 5.5 0 1 0 -16 0" />
      <path pathLength="1" d="M155 62 C151 76 152 84 160 86 C168 84 169 76 165 62" />
      <path pathLength="1" d="M148 92 Q160 96 172 92" />
      <path pathLength="1" d="M120 98 C112 120 110 146 114 166" />
      <path pathLength="1" d="M200 98 C208 120 210 146 206 166" />
      <path pathLength="1" d="M120 114 C138 122 154 125 174 122" />
      <path pathLength="1" d="M200 128 C182 137 164 140 144 137" />
      <path pathLength="1" d="M104 166 H216 M110 175 H210" />
    </svg>

    <!-- 인천: 인천대교 — 두 주탑에서 부챗살로 퍼지는 사장교 케이블 -->
    <svg v-else-if="cityId === 'kr_incheon'" viewBox="0 0 320 180">
      <path pathLength="1" d="M12 130 H308" />
      <path pathLength="1" d="M112 130 L126 42 L140 130" />
      <path pathLength="1" d="M196 130 L210 42 L224 130" />
      <path pathLength="1" d="M126 48 L58 126 M126 54 L86 126 M126 60 L108 127" />
      <path pathLength="1" d="M126 48 L166 126 M210 48 L170 126" />
      <path pathLength="1" d="M210 48 L278 126 M210 54 L250 126 M210 60 L228 127" />
      <path pathLength="1" d="M36 152 H92 M140 158 H196 M244 152 H300" />
    </svg>

    <!-- 대전: 엑스포 한빛탑 — 뾰족하게 솟는 원뿔 탑신과 전망 링 -->
    <svg v-else-if="cityId === 'kr_daejeon'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 12 V30" />
      <path pathLength="1" d="M150 30 H170" />
      <path pathLength="1" d="M150 30 L126 148 M170 30 L194 148" />
      <path pathLength="1" d="M124 92 H196" />
      <path pathLength="1" d="M122 102 H198" />
      <path pathLength="1" d="M108 148 H212 M118 160 H202" />
    </svg>

    <!-- 대구: 83타워 — 가늘게 선 탑신과 상부 전망층 -->
    <svg v-else-if="cityId === 'kr_daegu'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 10 V38" />
      <path pathLength="1" d="M138 50 H182" />
      <path pathLength="1" d="M134 62 H186" />
      <path pathLength="1" d="M140 50 L136 38 H184 L180 50" />
      <path pathLength="1" d="M150 62 L146 140 M170 62 L174 140" />
      <path pathLength="1" d="M120 140 Q160 126 200 140" />
      <path pathLength="1" d="M96 156 H224" />
    </svg>

    <!-- 광주: 무등산 입석대 — 나란히 선 주상절리 돌기둥 -->
    <svg v-else-if="cityId === 'kr_gwangju'" viewBox="0 0 320 180">
      <path pathLength="1" d="M96 150 V78 L104 66 L112 74 V150" />
      <path pathLength="1" d="M122 150 V60 L131 48 L140 56 V150" />
      <path pathLength="1" d="M150 150 V70 L159 58 L168 68 V150" />
      <path pathLength="1" d="M178 150 V56 L187 46 L196 54 V150" />
      <path pathLength="1" d="M206 150 V80 L214 70 L222 78 V150" />
      <path pathLength="1" d="M40 150 Q160 132 280 150" />
    </svg>

    <!-- 울산: 반구대 고래 — 물줄기를 뿜는 귀신고래와 파도 -->
    <svg v-else-if="cityId === 'kr_ulsan'" viewBox="0 0 320 180">
      <path pathLength="1" d="M62 112 C92 78 168 68 218 86 C246 96 264 108 258 120 C238 136 152 142 102 132 C76 126 56 122 62 112 Z" />
      <path pathLength="1" d="M254 116 C272 106 284 94 292 82 C286 102 282 112 288 124 C276 120 264 120 254 116" />
      <path pathLength="1" d="M98 104 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0" />
      <path pathLength="1" d="M120 62 C118 48 128 40 126 28" />
      <path pathLength="1" d="M134 60 C136 48 144 42 144 30" />
      <path pathLength="1" d="M30 152 Q60 142 90 152 M200 158 Q236 148 272 158" />
    </svg>

    <!-- 강릉: 경포 해변 — 해와 파도, 바람에 굽은 소나무 -->
    <svg v-else-if="cityId === 'kr_gangneung'" viewBox="0 0 320 180">
      <path pathLength="1" d="M236 44 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0" />
      <path pathLength="1" d="M20 120 H300" />
      <path pathLength="1" d="M34 140 Q64 130 94 140 T154 140 M174 152 Q204 142 234 152 T294 152" />
      <path pathLength="1" d="M74 118 C76 96 68 84 76 64" />
      <path pathLength="1" d="M76 64 C60 66 50 58 44 60 C52 48 66 46 76 50 C72 40 80 34 88 36 C96 30 108 34 110 44 C120 46 120 56 112 60 C102 66 86 66 76 64" />
    </svg>

    <!-- 베이징: 천안문 — 성벽의 세 홍예문과 이층 누각 처마 -->
    <svg v-else-if="cityId === 'cn_beijing'" viewBox="0 0 320 180">
      <path pathLength="1" d="M30 150 H290" />
      <path pathLength="1" d="M42 108 H278" />
      <path pathLength="1" d="M42 108 V150 M278 108 V150" />
      <path pathLength="1" d="M142 150 V130 A18 15 0 0 1 178 130 V150" />
      <path pathLength="1" d="M72 150 V134 A13 11 0 0 1 98 134 V150 M222 150 V134 A13 11 0 0 1 248 134 V150" />
      <path pathLength="1" d="M76 96 Q160 78 244 96" />
      <path pathLength="1" d="M96 66 Q160 52 224 66" />
      <path pathLength="1" d="M104 96 V108 M160 96 V108 M216 96 V108" />
      <path pathLength="1" d="M116 66 V80 M204 66 V80" />
    </svg>

    <!-- 도쿄: 도쿄 타워 — 넓게 벌린 다리와 두 단의 전망대 -->
    <svg v-else-if="cityId === 'jp_tokyo'" viewBox="0 0 320 180">
      <path pathLength="1" d="M156 26 L160 10 L164 26" />
      <path pathLength="1" d="M98 160 C120 110 142 70 156 26 M222 160 C200 110 178 70 164 26" />
      <path pathLength="1" d="M146 62 H174 M142 72 H178" />
      <path pathLength="1" d="M124 112 H196 M120 124 H200" />
      <path pathLength="1" d="M112 140 L208 160 M208 140 L112 160" />
    </svg>

    <!-- 베를린: 브란덴부르크 문 — 여섯 기둥과 콰드리가 -->
    <svg v-else-if="cityId === 'de_berlin'" viewBox="0 0 320 180">
      <path pathLength="1" d="M40 152 H280" />
      <path pathLength="1" d="M52 70 H268 V88 H52 Z" />
      <path pathLength="1" d="M62 88 V152 M74 88 V152" />
      <path pathLength="1" d="M100 88 V152 M112 88 V152" />
      <path pathLength="1" d="M138 88 V152 M150 88 V152" />
      <path pathLength="1" d="M170 88 V152 M182 88 V152" />
      <path pathLength="1" d="M208 88 V152 M220 88 V152" />
      <path pathLength="1" d="M246 88 V152 M258 88 V152" />
      <path pathLength="1" d="M142 56 H178 M138 62 H182" />
      <path pathLength="1" d="M146 56 C150 46 160 44 166 50" />
      <path pathLength="1" d="M172 34 V50 M172 34 L182 38 L172 42" />
    </svg>

    <!-- 뉴욕: 자유의 여신 — 횃불을 든 팔과 왕관 -->
    <svg v-else-if="cityId === 'us_newyork'" viewBox="0 0 320 180">
      <path pathLength="1" d="M182 10 C188 16 186 22 180 24 C176 18 178 12 182 10" />
      <path pathLength="1" d="M172 27 H190" />
      <path pathLength="1" d="M186 30 C190 40 184 50 176 56 L166 76" />
      <path pathLength="1" d="M128 54 L124 40 M138 52 L136 36 M148 52 L148 34 M158 52 L160 36 M166 56 L172 42" />
      <path pathLength="1" d="M130 64 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0" />
      <path pathLength="1" d="M122 82 C110 106 102 132 98 158" />
      <path pathLength="1" d="M162 84 C170 108 176 132 176 158" />
      <path pathLength="1" d="M160 96 L186 104 V120 L162 112" />
      <path pathLength="1" d="M134 96 C130 118 126 140 124 158" />
      <path pathLength="1" d="M86 158 H192" />
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
