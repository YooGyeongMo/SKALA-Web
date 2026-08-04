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

    <!-- 뮌헨: 프라우엔키르헤 — 양파 돔을 얹은 쌍둥이 탑 -->
    <svg v-else-if="cityId === 'de_munich'" viewBox="0 0 320 180">
      <path pathLength="1" d="M120 44 C132 24 148 24 158 44 L154 52 H124 Z" />
      <path pathLength="1" d="M162 44 C174 24 190 24 200 44 L196 52 H166 Z" />
      <path pathLength="1" d="M126 52 V152 M152 52 V152" />
      <path pathLength="1" d="M168 52 V152 M194 52 V152" />
      <path pathLength="1" d="M132 84 a7 9 0 1 0 14 0 a7 9 0 1 0 -14 0 M174 84 a7 9 0 1 0 14 0 a7 9 0 1 0 -14 0" />
      <path pathLength="1" d="M112 152 H208" />
    </svg>

    <!-- 함부르크: 엘프필하모니 — 벽돌 기단 위 물결 지붕 -->
    <svg v-else-if="cityId === 'de_hamburg'" viewBox="0 0 320 180">
      <path pathLength="1" d="M84 84 C104 64 124 92 144 72 C164 52 184 84 204 64 C224 48 236 72 236 72" />
      <path pathLength="1" d="M84 84 V100 M236 72 V100" />
      <path pathLength="1" d="M84 100 H236" />
      <path pathLength="1" d="M84 100 V152 H236 V100" />
      <path pathLength="1" d="M100 116 H220 M100 132 H220" />
      <path pathLength="1" d="M64 162 Q90 154 116 162 M180 166 Q210 158 240 166" />
    </svg>

    <!-- 프랑크푸르트: 마인해튼 — 은행 타워 스카이라인 -->
    <svg v-else-if="cityId === 'de_frankfurt'" viewBox="0 0 320 180">
      <path pathLength="1" d="M96 152 V72 H124 V152" />
      <path pathLength="1" d="M134 152 V40 L150 26 L166 40 V152" />
      <path pathLength="1" d="M150 26 V12" />
      <path pathLength="1" d="M176 152 V56 H206 V88 H196 V152" />
      <path pathLength="1" d="M104 92 H116 M142 64 H158 M184 72 H198" />
      <path pathLength="1" d="M80 152 H240" />
    </svg>

    <!-- 쾰른: 쾰른 대성당 — 하늘을 찌르는 쌍둥이 첨탑 -->
    <svg v-else-if="cityId === 'de_cologne'" viewBox="0 0 320 180">
      <path pathLength="1" d="M118 152 V72 L134 16 L150 72 V152" />
      <path pathLength="1" d="M170 152 V72 L186 16 L202 72 V152" />
      <path pathLength="1" d="M126 92 L142 108 M142 92 L126 108 M178 92 L194 108 M194 92 L178 108" />
      <path pathLength="1" d="M150 96 H170 M150 120 A10 12 0 0 1 170 120" />
      <path pathLength="1" d="M150 120 V152 M170 120 V152" />
      <path pathLength="1" d="M106 152 H214" />
    </svg>

    <!-- 슈투트가르트: TV 타워 — 세계 최초의 콘크리트 전파탑 -->
    <svg v-else-if="cityId === 'de_stuttgart'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 6 V30" />
      <path pathLength="1" d="M144 38 C148 30 172 30 176 38 C172 46 148 46 144 38" />
      <path pathLength="1" d="M146 46 H174 M148 54 H172" />
      <path pathLength="1" d="M156 54 C154 92 152 120 148 152 M164 54 C166 92 168 120 172 152" />
      <path pathLength="1" d="M132 152 H188" />
      <path pathLength="1" d="M100 160 Q130 150 160 158 Q196 166 224 158" />
    </svg>

    <!-- 뒤셀도르프: 게리 하우스 — 서로 기대어 휘어진 세 동 -->
    <svg v-else-if="cityId === 'de_dusseldorf'" viewBox="0 0 320 180">
      <path pathLength="1" d="M84 152 V72 C84 60 100 60 102 72 L108 152" />
      <path pathLength="1" d="M120 152 L114 64 C118 44 146 44 148 64 L142 152" />
      <path pathLength="1" d="M156 152 L150 76 C156 58 182 62 180 80 C172 104 176 128 180 152" />
      <path pathLength="1" d="M92 96 L102 98 M124 88 L138 88 M158 100 L172 102" />
      <path pathLength="1" d="M70 152 H196" />
      <path pathLength="1" d="M212 160 Q244 152 276 160" />
    </svg>

    <!-- 라이프치히: 전승기념비 — 육중한 사다리꼴 비석 -->
    <svg v-else-if="cityId === 'de_leipzig'" viewBox="0 0 320 180">
      <path pathLength="1" d="M150 16 L160 8 L170 16 V32 H150 Z" />
      <path pathLength="1" d="M138 32 H182 L192 72 H128 Z" />
      <path pathLength="1" d="M120 72 H200 L212 140 H108 Z" />
      <path pathLength="1" d="M148 140 V104 A12 14 0 0 1 172 104 V140" />
      <path pathLength="1" d="M136 92 V116 M184 92 V116" />
      <path pathLength="1" d="M96 140 H224 M104 154 H216" />
    </svg>

    <!-- 드레스덴: 프라우엔키르헤 — 종 모양 돔과 랜턴 -->
    <svg v-else-if="cityId === 'de_dresden'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 8 V20 M154 14 H166" />
      <path pathLength="1" d="M152 20 H168 V36 H152 Z" />
      <path pathLength="1" d="M128 92 C128 56 144 36 160 36 C176 36 192 56 192 92" />
      <path pathLength="1" d="M120 92 H200" />
      <path pathLength="1" d="M126 92 V152 M194 92 V152" />
      <path pathLength="1" d="M146 152 V120 A14 14 0 0 1 174 120 V152" />
      <path pathLength="1" d="M104 152 V116 L114 104 V152 M216 152 V116 L206 104 V152" />
      <path pathLength="1" d="M92 152 H228" />
    </svg>

    <!-- 뉘른베르크: 카이저성 — 원뿔 지붕의 진벨탑과 성벽 -->
    <svg v-else-if="cityId === 'de_nuremberg'" viewBox="0 0 320 180">
      <path pathLength="1" d="M132 60 L156 24 L180 60" />
      <path pathLength="1" d="M156 24 V12 M156 12 L166 16 L156 20" />
      <path pathLength="1" d="M138 60 V128 M174 60 V128" />
      <path pathLength="1" d="M138 84 H174" />
      <path pathLength="1" d="M60 128 H260" />
      <path pathLength="1" d="M60 128 V152 M260 128 V152 M60 152 H260" />
      <path pathLength="1" d="M76 128 V116 H92 V128 M124 128 V116 H140 V128 M188 128 V116 H204 V128 M232 128 V116 H248 V128" />
    </svg>

    <!-- 로스앤젤레스: 야자수 해변 — 두 그루 야자수와 해 -->
    <svg v-else-if="cityId === 'us_la'" viewBox="0 0 320 180">
      <path pathLength="1" d="M232 40 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0" />
      <path pathLength="1" d="M96 152 C100 116 94 92 102 64" />
      <path pathLength="1" d="M102 64 C86 62 76 52 68 54 C78 42 94 44 102 50 C98 38 108 30 118 34 C128 28 140 36 140 46 C130 44 122 46 114 52 C122 56 126 64 122 70 C114 66 108 64 102 64" />
      <path pathLength="1" d="M170 152 C168 128 172 112 168 92" />
      <path pathLength="1" d="M168 92 C156 90 148 82 142 84 C150 74 162 76 168 80 C166 70 174 64 182 66 C190 62 200 68 198 76 C190 74 184 78 178 82 C186 86 188 92 184 96 C178 92 172 92 168 92" />
      <path pathLength="1" d="M56 152 H240 M80 164 Q160 156 244 164" />
    </svg>

    <!-- 시카고: 클라우드 게이트 — 매끈한 콩 조형물 -->
    <svg v-else-if="cityId === 'us_chicago'" viewBox="0 0 320 180">
      <path pathLength="1" d="M92 128 C84 84 124 56 160 56 C196 56 236 84 228 128 Z" />
      <path pathLength="1" d="M124 128 C122 106 138 96 160 96 C182 96 198 106 196 128" />
      <path pathLength="1" d="M116 80 C132 70 150 66 160 66 M204 84 C196 76 186 72 178 70" />
      <path pathLength="1" d="M72 128 H248 M88 142 H232" />
    </svg>

    <!-- 휴스턴: 새턴 V — 우주로 향한 로켓 -->
    <svg v-else-if="cityId === 'us_houston'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 10 C170 22 174 34 174 50 V118 H146 V50 C146 34 150 22 160 10" />
      <path pathLength="1" d="M146 60 H174 M146 96 H174" />
      <path pathLength="1" d="M146 108 L126 140 V148 H140 M174 108 L194 140 V148 H180" />
      <path pathLength="1" d="M150 118 V140 M170 118 V140" />
      <path pathLength="1" d="M150 148 C148 158 152 166 160 172 C168 166 172 158 170 148" />
      <path pathLength="1" d="M108 156 Q120 148 132 154 M188 154 Q200 148 212 156" />
    </svg>

    <!-- 마이애미: 비스케인 만 — 파도 위 요트 -->
    <svg v-else-if="cityId === 'us_miami'" viewBox="0 0 320 180">
      <path pathLength="1" d="M156 28 V108" />
      <path pathLength="1" d="M156 28 C196 52 208 84 210 104 L162 104" />
      <path pathLength="1" d="M150 44 C122 64 112 88 110 102 L148 102" />
      <path pathLength="1" d="M96 118 H224 L206 140 H116 Z" />
      <path pathLength="1" d="M56 152 Q84 142 112 152 T168 152 M184 158 Q212 148 240 158" />
      <path pathLength="1" d="M244 44 a13 13 0 1 0 26 0 a13 13 0 1 0 -26 0" />
    </svg>

    <!-- 시애틀: 스페이스 니들 — 원반 전망대와 가는 다리 -->
    <svg v-else-if="cityId === 'us_seattle'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 8 V26" />
      <path pathLength="1" d="M126 40 C140 28 180 28 194 40 C180 52 140 52 126 40" />
      <path pathLength="1" d="M134 50 L120 60 M186 50 L200 60" />
      <path pathLength="1" d="M148 52 C152 96 144 124 132 152 M172 52 C168 96 176 124 188 152" />
      <path pathLength="1" d="M152 84 H168 M148 116 H172" />
      <path pathLength="1" d="M116 152 H204" />
    </svg>

    <!-- 샌프란시스코: 금문교 — 붉은 현수교의 두 탑 -->
    <svg v-else-if="cityId === 'us_sf'" viewBox="0 0 320 180">
      <path pathLength="1" d="M12 116 H308" />
      <path pathLength="1" d="M96 116 V36 M112 116 V36 M96 52 H112 M96 80 H112" />
      <path pathLength="1" d="M208 116 V36 M224 116 V36 M208 52 H224 M208 80 H224" />
      <path pathLength="1" d="M112 40 C140 88 180 88 208 40" />
      <path pathLength="1" d="M12 82 C40 58 70 44 96 40 M224 40 C250 44 280 58 308 82" />
      <path pathLength="1" d="M130 74 V116 M160 84 V116 M190 74 V116" />
      <path pathLength="1" d="M36 148 Q68 138 100 148 M200 152 Q240 142 280 152" />
    </svg>

    <!-- 라스베이거스: 웰컴 사인 — 다이아몬드 표지판과 별 -->
    <svg v-else-if="cityId === 'us_lasvegas'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 22 L166 34 L179 34 L169 42 L173 55 L160 47 L147 55 L151 42 L141 34 L154 34 Z" />
      <path pathLength="1" d="M104 84 L160 56 L216 84 L160 112 Z" />
      <path pathLength="1" d="M126 82 H194 M118 92 H202" />
      <path pathLength="1" d="M136 112 V152 M184 112 V152" />
      <path pathLength="1" d="M120 152 H200" />
      <path pathLength="1" d="M84 60 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M226 60 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" />
    </svg>

    <!-- 보스턴: 컨스티튜션호 — 세 돛의 범선 -->
    <svg v-else-if="cityId === 'us_boston'" viewBox="0 0 320 180">
      <path pathLength="1" d="M120 108 V32 M186 108 V44" />
      <path pathLength="1" d="M120 32 C146 48 150 84 122 104" />
      <path pathLength="1" d="M186 44 C208 58 210 86 188 102" />
      <path pathLength="1" d="M120 40 L100 60 V96" />
      <path pathLength="1" d="M84 118 H236 L214 142 H104 Z" />
      <path pathLength="1" d="M96 124 H224" />
      <path pathLength="1" d="M56 154 Q88 144 120 154 T184 154 M200 160 Q228 152 256 160" />
    </svg>

    <!-- 워싱턴: 국회의사당 — 드럼 위의 돔 -->
    <svg v-else-if="cityId === 'us_dc'" viewBox="0 0 320 180">
      <path pathLength="1" d="M160 12 V24 M155 18 H165" />
      <path pathLength="1" d="M136 68 C136 44 148 32 160 32 C172 32 184 44 184 68" />
      <path pathLength="1" d="M130 68 H190" />
      <path pathLength="1" d="M136 68 V84 M148 68 V84 M160 68 V84 M172 68 V84 M184 68 V84" />
      <path pathLength="1" d="M126 84 H194 V100 H126 Z" />
      <path pathLength="1" d="M92 100 H228 V116 H92 Z" />
      <path pathLength="1" d="M100 116 V148 M120 116 V148 M144 116 V148 M176 116 V148 M200 116 V148 M220 116 V148" />
      <path pathLength="1" d="M84 148 H236 M92 160 H228" />
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
