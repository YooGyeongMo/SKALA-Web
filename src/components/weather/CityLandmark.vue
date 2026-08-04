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

    <!-- 상하이: 동방명주 — 두 구슬을 꿴 탑과 삼각 다리 -->
    <svg v-else-if="cityId === 'cn_shanghai'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 8 V34" />
      <path pathLength="1" d="M160 34 a13 13 0 1 0 0.1 0" />
      <path pathLength="1" d="M160 60 V76" />
      <path pathLength="1" d="M160 76 a22 22 0 1 0 0.1 0" />
      <path pathLength="1" d="M148 118 L128 158 M172 118 L192 158" />
      <path pathLength="1" d="M160 120 V158" />
      <path pathLength="1" d="M112 158 H208" />
    </svg>

    <!-- 광저우: 광저우타워 — 허리가 잘록한 격자 타워 -->
    <svg v-else-if="cityId === 'cn_guangzhou'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 6 V22" />
      <path pathLength="1" d="M138 22 C150 62 148 98 132 152 M182 22 C170 62 172 98 188 152" />
      <path pathLength="1" d="M141 40 H179 M146 66 H174 M148 92 H172 M144 118 H176 M136 144 H184" />
      <path pathLength="1" d="M120 152 H200" />
    </svg>

    <!-- 선전: 핑안 금융센터 — 뾰족하게 모이는 마천루 -->
    <svg v-else-if="cityId === 'cn_shenzhen'" viewBox="0 0 320 180">
      <path pathLength="1" d="M146 156 L154 34 L160 18 L166 34 L174 156" />
      <path pathLength="1" d="M154 60 H166 M152 96 H168 M150 128 H170" />
      <path pathLength="1" d="M108 156 V96 L122 84 V156 M198 156 V108 L212 96 V156" />
      <path pathLength="1" d="M92 156 H228" />
    </svg>

    <!-- 청두: 판다 — 둥근 얼굴과 눈 패치 -->
    <svg v-else-if="cityId === 'cn_chengdu'" viewBox="0 0 320 180">
      <path pathLength="1" d="M104 96 a56 50 0 1 0 112 0 a56 50 0 1 0 -112 0" />
      <path pathLength="1" d="M112 56 a14 12 0 1 0 22 -14 a14 12 0 1 0 -22 14" />
      <path pathLength="1" d="M186 42 a14 12 0 1 0 22 14 a14 12 0 1 0 -22 -14" />
      <path pathLength="1" d="M130 88 a11 13 0 1 0 22 0 a11 13 0 1 0 -22 0" />
      <path pathLength="1" d="M168 88 a11 13 0 1 0 22 0 a11 13 0 1 0 -22 0" />
      <path pathLength="1" d="M154 112 Q160 118 166 112" />
      <path pathLength="1" d="M160 118 V124 M160 124 Q150 132 144 126 M160 124 Q170 132 176 126" />
    </svg>

    <!-- 시안: 대안탑 — 층층이 좁아지는 벽돌탑 -->
    <svg v-else-if="cityId === 'cn_xian'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 10 V24" />
      <path pathLength="1" d="M146 24 H174 L170 48 H150 Z" />
      <path pathLength="1" d="M142 48 H178 L174 76 H146 Z" />
      <path pathLength="1" d="M136 76 H184 L180 108 H140 Z" />
      <path pathLength="1" d="M130 108 H190 L186 144 H134 Z" />
      <path pathLength="1" d="M116 144 H204 M108 156 H212" />
    </svg>

    <!-- 항저우: 서호 — 아치교와 삼담인월 석탑 -->
    <svg v-else-if="cityId === 'cn_hangzhou'" viewBox="0 0 320 180">
      <path pathLength="1" d="M20 128 H300" />
      <path pathLength="1" d="M60 128 Q100 84 140 128" />
      <path pathLength="1" d="M76 128 Q100 100 124 128" />
      <path pathLength="1" d="M212 128 V112 M204 112 H220 M206 112 Q212 96 218 112 M212 96 V90 M208 90 H216" />
      <path pathLength="1" d="M40 148 Q70 140 100 148 M180 152 Q220 142 260 152" />
      <path pathLength="1" d="M252 70 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0" />
    </svg>

    <!-- 우한: 황학루 — 겹처마가 층층이 올라가는 누각 -->
    <svg v-else-if="cityId === 'cn_wuhan'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 10 V22" />
      <path pathLength="1" d="M118 44 Q160 20 202 44" />
      <path pathLength="1" d="M132 44 V58 M188 44 V58" />
      <path pathLength="1" d="M104 76 Q160 52 216 76" />
      <path pathLength="1" d="M122 76 V92 M198 76 V92" />
      <path pathLength="1" d="M90 112 Q160 86 230 112" />
      <path pathLength="1" d="M110 112 V150 M160 118 V150 M210 112 V150" />
      <path pathLength="1" d="M84 150 H236 M96 162 H224" />
    </svg>

    <!-- 충칭: 홍야동 — 강가 절벽에 층층이 쌓인 누각 -->
    <svg v-else-if="cityId === 'cn_chongqing'" viewBox="0 0 320 180">
      <path pathLength="1" d="M20 152 H300" />
      <path pathLength="1" d="M60 152 V120 H120 V152" />
      <path pathLength="1" d="M50 120 Q90 108 130 120" />
      <path pathLength="1" d="M74 108 V84 H150 V108" />
      <path pathLength="1" d="M64 84 Q112 70 160 84" />
      <path pathLength="1" d="M96 70 V48 H184 V70" />
      <path pathLength="1" d="M86 48 Q140 32 194 48" />
      <path pathLength="1" d="M196 152 V96 M216 152 V96 M196 96 Q206 88 216 96" />
      <path pathLength="1" d="M232 164 Q262 156 292 164" />
    </svg>

    <!-- 하얼빈: 성 소피아 성당 — 양파 돔과 십자가 -->
    <svg v-else-if="cityId === 'cn_harbin'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 8 V22 M153 14 H167" />
      <path pathLength="1" d="M160 22 C182 34 188 52 182 66 C176 76 144 76 138 66 C132 52 138 34 160 22" />
      <path pathLength="1" d="M134 66 H186" />
      <path pathLength="1" d="M140 66 V96 M180 66 V96" />
      <path pathLength="1" d="M118 96 H202 V152 H118 Z" />
      <path pathLength="1" d="M146 152 V124 A14 12 0 0 1 174 124 V152" />
      <path pathLength="1" d="M96 152 V116 L108 104 L118 116 M224 152 V116 L212 104 L202 116" />
      <path pathLength="1" d="M84 152 H236" />
    </svg>

    <!-- 오사카: 오사카성 — 층층 처마의 천수각과 석벽 -->
    <svg v-else-if="cityId === 'jp_osaka'" viewBox="0 0 320 180">
      <path pathLength="1" d="M148 18 Q160 12 172 18 M160 12 V26" />
      <path pathLength="1" d="M132 40 Q160 24 188 40 L180 42 H140 Z" />
      <path pathLength="1" d="M140 42 V58 M180 42 V58" />
      <path pathLength="1" d="M120 70 Q160 52 200 70 L190 72 H130 Z" />
      <path pathLength="1" d="M130 72 V92 M190 72 V92" />
      <path pathLength="1" d="M106 104 Q160 84 214 104 L202 106 H118 Z" />
      <path pathLength="1" d="M118 106 V126 M202 106 V126" />
      <path pathLength="1" d="M100 126 H220 L242 158 H78 Z" />
    </svg>

    <!-- 교토: 토리이 — 부드럽게 휜 카사기와 두 기둥 -->
    <svg v-else-if="cityId === 'jp_kyoto'" viewBox="0 0 320 180">
      <path pathLength="1" d="M84 46 Q160 30 236 46 L232 58 Q160 44 88 58 Z" />
      <path pathLength="1" d="M160 58 V78" />
      <path pathLength="1" d="M104 78 H216" />
      <path pathLength="1" d="M112 58 L104 152 M120 78 L114 152" />
      <path pathLength="1" d="M208 58 L216 152 M200 78 L206 152" />
      <path pathLength="1" d="M92 152 H128 M192 152 H228" />
    </svg>

    <!-- 요코하마: 코스모 클록 — 대관람차 -->
    <svg v-else-if="cityId === 'jp_yokohama'" viewBox="0 0 320 180">
      <path pathLength="1" d="M104 80 a56 56 0 1 0 112 0 a56 56 0 1 0 -112 0" />
      <path pathLength="1" d="M160 24 V136 M104 80 H216" />
      <path pathLength="1" d="M120 40 L200 120 M200 40 L120 120" />
      <path pathLength="1" d="M160 80 a6 6 0 1 0 0.1 0" />
      <path pathLength="1" d="M140 136 L128 160 M180 136 L192 160" />
      <path pathLength="1" d="M112 160 H208" />
    </svg>

    <!-- 나고야: 나고야성 — 지붕 위 금샤치 한 쌍 -->
    <svg v-else-if="cityId === 'jp_nagoya'" viewBox="0 0 320 180">
      <path pathLength="1" d="M128 34 C124 22 132 14 138 12 C136 20 140 26 144 30" />
      <path pathLength="1" d="M192 34 C196 22 188 14 182 12 C184 20 180 26 176 30" />
      <path pathLength="1" d="M116 46 Q160 30 204 46 L194 48 H126 Z" />
      <path pathLength="1" d="M126 48 V68 M194 48 V68" />
      <path pathLength="1" d="M108 80 Q160 62 212 80 L202 82 H118 Z" />
      <path pathLength="1" d="M118 82 V106 M202 82 V106" />
      <path pathLength="1" d="M104 106 H216 V132 H104 Z" />
      <path pathLength="1" d="M96 132 H224 L246 160 H74 Z" />
    </svg>

    <!-- 삿포로: 도케이다이 시계탑 — 박공지붕과 둥근 시계 -->
    <svg v-else-if="cityId === 'jp_sapporo'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 14 V28 M154 20 H166" />
      <path pathLength="1" d="M138 46 L160 28 L182 46 V64 H138 Z" />
      <path pathLength="1" d="M150 50 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0" />
      <path pathLength="1" d="M160 50 V44 M160 50 L166 54" />
      <path pathLength="1" d="M108 92 L160 64 L212 92" />
      <path pathLength="1" d="M116 92 V152 M204 92 V152" />
      <path pathLength="1" d="M140 152 V116 H180 V152" />
      <path pathLength="1" d="M104 152 H216" />
    </svg>

    <!-- 후쿠오카: 후쿠오카 타워 — 좁아지는 판형 타워와 다이아 격자 -->
    <svg v-else-if="cityId === 'jp_fukuoka'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 6 V20" />
      <path pathLength="1" d="M146 20 L136 152 M174 20 L184 152" />
      <path pathLength="1" d="M146 20 H174" />
      <path pathLength="1" d="M150 44 L170 76 M170 44 L150 76 M146 84 L174 116 M174 84 L146 116" />
      <path pathLength="1" d="M124 152 H196" />
    </svg>

    <!-- 고베: 포트 타워 — 가운데가 잘록한 장구형 격자 -->
    <svg v-else-if="cityId === 'jp_kobe'" viewBox="0 0 320 180">
      <path pathLength="1" d="M136 20 H184" />
      <path pathLength="1" d="M140 20 C160 60 160 60 140 100 C132 124 132 136 128 152" />
      <path pathLength="1" d="M180 20 C160 60 160 60 180 100 C188 124 188 136 192 152" />
      <path pathLength="1" d="M143 44 H177 M152 72 H168 M146 104 H174 M138 128 H182" />
      <path pathLength="1" d="M148 20 L170 44 M172 20 L150 44 M154 72 L168 100 M166 72 L152 100" />
      <path pathLength="1" d="M116 152 H204" />
    </svg>

    <!-- 히로시마: 원폭 돔 — 뼈대만 남은 돔과 벽 -->
    <svg v-else-if="cityId === 'jp_hiroshima'" viewBox="0 0 320 180">
      <path pathLength="1" d="M128 64 A32 30 0 0 1 192 64" />
      <path pathLength="1" d="M136 62 A24 24 0 0 1 184 62" />
      <path pathLength="1" d="M144 38 V64 M160 32 V64 M176 38 V64" />
      <path pathLength="1" d="M128 64 H192" />
      <path pathLength="1" d="M132 64 V152 M188 64 V152" />
      <path pathLength="1" d="M132 96 H188 M132 124 H160" />
      <path pathLength="1" d="M108 152 V112 L120 100 V152 M212 152 V120 L200 108 V152" />
      <path pathLength="1" d="M96 152 H224" />
    </svg>

    <!-- 센다이: 다테 마사무네 투구 — 큰 초승달 장식 -->
    <svg v-else-if="cityId === 'jp_sendai'" viewBox="0 0 320 180">
      <path pathLength="1" d="M116 60 C104 26 216 26 204 60 C196 42 124 42 116 60" />
      <path pathLength="1" d="M112 108 A50 44 0 0 1 208 108" />
      <path pathLength="1" d="M112 108 H208" />
      <path pathLength="1" d="M120 108 L112 136 M148 108 L146 140 M172 108 L174 140 M200 108 L208 136" />
      <path pathLength="1" d="M160 64 V84" />
      <path pathLength="1" d="M136 150 Q160 158 184 150" />
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
