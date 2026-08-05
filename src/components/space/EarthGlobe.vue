<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import WeatherGlyph from '@/components/weather/WeatherGlyph.vue'
import earthTextureUrl from '@/assets/textures/earth_atmos_2048.jpg'

// 홈 지구본 — 나라 수도 위치에 핀을 꽂고,
// 핀을 호버하면 리퀴드 글래스 카드(수도 실황)가 그 위에 뜬다.
// 핀이나 카드를 클릭하면 해당 나라의 도시 목록으로 이동한다.
const props = defineProps({
  countries: {
    type: Array,
    required: true, // { code, name, english, capital, temp, glyph, status } 목록
  },
})

const emit = defineEmits(['select'])

// 수도 좌표 (위도, 경도)
const CAPITAL_COORDS = {
  kr: [37.57, 126.98],
  us: [38.9, -77.04],
  de: [52.52, 13.4],
  jp: [35.68, 139.69],
  cn: [39.9, 116.4],
}

const canvasEl = ref(null)
const wrapEl = ref(null)

// 텍스처가 실제로 도착한 뒤에만 캔버스를 드러낸다 (그 전엔 자리 표식)
const ready = ref(false)

// 호버 중인 나라와 카드의 화면 좌표
const hovered = ref(null)
const cardPos = ref({ x: 0, y: 0 })
// 핀이 화면 위쪽이면 카드를 아래로 뒤집어 잘리지 않게 한다
const cardBelow = ref(false)

let renderer = null
let scene = null
let camera = null
let globe = null
let stars = null
let pins = []
let rings = []
let elapsed = 0
let rafId = 0
let disposed = false

// 드래그 회전 — 이동량으로 클릭과 구분하고, 놓으면 기본 자전으로 돌아간다
let dragging = false
let dragMoved = 0
let lastPointer = { x: 0, y: 0 }

const raycaster = new THREE.Raycaster()
const pointerNdc = new THREE.Vector2(-2, -2)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// 위도·경도를 구 표면 좌표로 바꾼다 (equirect 텍스처 기준)
const latLonToVector3 = (lat, lon, radius) => {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

const onPointerMove = (e) => {
  const rect = wrapEl.value.getBoundingClientRect()
  pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointerNdc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)

  if (dragging && globe) {
    const dx = e.clientX - lastPointer.x
    const dy = e.clientY - lastPointer.y
    globe.rotation.y += dx * 0.0045
    globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + dy * 0.003, -0.7, 0.7)
    dragMoved += Math.abs(dx) + Math.abs(dy)
    lastPointer = { x: e.clientX, y: e.clientY }
  }
}

const onPointerDown = (e) => {
  dragging = true
  dragMoved = 0
  lastPointer = { x: e.clientX, y: e.clientY }
  // 포인터가 영역 밖으로 나가도 드래그가 이어지게 캡처한다
  wrapEl.value.setPointerCapture?.(e.pointerId)
}

const onPointerUp = (e) => {
  dragging = false
  wrapEl.value.releasePointerCapture?.(e.pointerId)
}

const onPointerLeave = () => {
  pointerNdc.set(-2, -2)
  hovered.value = null
}

const onClick = () => {
  // 드래그로 돌린 손을 떼는 순간을 핀 클릭으로 오인하지 않는다
  if (dragMoved > 6) return
  if (hovered.value) emit('select', hovered.value.code)
}

const onResize = () => {
  if (!renderer || !wrapEl.value) return
  const { clientWidth: w, clientHeight: h } = wrapEl.value
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

onMounted(() => {
  const wrap = wrapEl.value
  const { clientWidth: w, clientHeight: h } = wrap

  renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h, false)
  // 필름 톤매핑으로 대비를 살려 대륙 경계가 진하게 보이게 한다
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100)
  // 극지방이 프레임 안에 들어오고 위쪽 내비 영역과 넉넉히 떨어지는 거리
  camera.position.set(0, 0, 4.2)

  const texture = new THREE.TextureLoader().load(earthTextureUrl, () => {
    ready.value = true
  })
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy()

  // 지구와 핀을 한 그룹으로 묶어 함께 자전시킨다
  globe = new THREE.Group()
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 1 }),
  )
  globe.add(earth)

  // 나라 핀 — 유리 구슬과 바깥으로 퍼지는 광륜
  const pinGeo = new THREE.SphereGeometry(0.03, 24, 24)
  const ringGeo = new THREE.RingGeometry(0.042, 0.052, 40)
  props.countries.forEach((country) => {
    const coords = CAPITAL_COORDS[country.code]
    if (!coords) return
    const position = latLonToVector3(coords[0], coords[1], 1.02)

    const pin = new THREE.Mesh(
      pinGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.12,
        metalness: 0,
        transparent: true,
        opacity: 0.92,
        emissive: 0x99bbff,
        emissiveIntensity: 0.35,
      }),
    )
    pin.position.copy(position)
    pin.userData.code = country.code
    globe.add(pin)
    pins.push(pin)

    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      }),
    )
    ring.position.copy(position)
    ring.lookAt(0, 0, 0)
    globe.add(ring)
    rings.push(ring)
  })

  // 한국이 정면에 오도록 초기 회전, 화면을 채우도록 살짝 내린다
  globe.rotation.y = -2.1
  globe.position.y = 0
  scene.add(globe)

  const sun = new THREE.DirectionalLight(0xffffff, 3.0)
  sun.position.set(5, 2, 4)
  scene.add(sun)
  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.7))
  scene.add(new THREE.AmbientLight(0xffffff, 0.35))

  // 별 필드
  const starCount = 900
  const positions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const r = 26 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.7 }),
  )
  scene.add(stars)

  const worldPos = new THREE.Vector3()

  const animate = () => {
    if (disposed) return

    // 호버나 드래그 중에는 자전을 멈춰 손과 카드가 흔들리지 않게 한다
    if (!reduceMotion && !hovered.value && !dragging) {
      globe.rotation.y += 0.0011
      stars.rotation.y += 0.00012
    }

    // 드래그를 놓으면 기울기가 서서히 기본 각도로 돌아온다
    if (!dragging && Math.abs(globe.rotation.x) > 0.0005) {
      globe.rotation.x += -globe.rotation.x * 0.04
    }

    // 광륜이 바깥으로 퍼지며 옅어진다
    elapsed += 0.016
    const phase = (elapsed % 2) / 2
    rings.forEach((ring) => {
      ring.scale.setScalar(1 + phase * 1.4)
      ring.material.opacity = 0.5 * (1 - phase)
    })

    // 핀 호버 판정 — 드래그 중에는 판정을 쉬어 카드가 튀지 않게 한다
    let hitCode = null
    if (!dragging) {
      raycaster.setFromCamera(pointerNdc, camera)
      const hits = raycaster.intersectObjects(pins)
      hitCode = hits[0]?.object.userData.code ?? null
    }
    const country = props.countries.find((c) => c.code === hitCode) ?? null
    hovered.value = country
    wrapEl.value.style.cursor = dragging ? 'grabbing' : country ? 'pointer' : 'grab'

    // 핀 크기와 카드 위치 갱신
    pins.forEach((pin) => {
      const active = pin.userData.code === hitCode
      pin.scale.setScalar(active ? 1.9 : 1)
      if (active) {
        pin.getWorldPosition(worldPos)
        worldPos.project(camera)
        const rect = wrapEl.value.getBoundingClientRect()
        const x = ((worldPos.x + 1) / 2) * rect.width
        const y = ((1 - worldPos.y) / 2) * rect.height
        cardPos.value = { x, y }
        // 위 공간이 모자라면 카드를 핀 아래로 뒤집는다
        cardBelow.value = y < 190
      }
    })

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('resize', onResize)
  wrap.addEventListener('pointermove', onPointerMove)
  wrap.addEventListener('pointerdown', onPointerDown)
  wrap.addEventListener('pointerup', onPointerUp)
  wrap.addEventListener('pointercancel', onPointerUp)
  wrap.addEventListener('pointerleave', onPointerLeave)
  wrap.addEventListener('click', onClick)
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  const wrap = wrapEl.value
  wrap?.removeEventListener('pointermove', onPointerMove)
  wrap?.removeEventListener('pointerdown', onPointerDown)
  wrap?.removeEventListener('pointerup', onPointerUp)
  wrap?.removeEventListener('pointercancel', onPointerUp)
  wrap?.removeEventListener('pointerleave', onPointerLeave)
  wrap?.removeEventListener('click', onClick)
  scene?.traverse((obj) => {
    obj.geometry?.dispose?.()
    obj.material?.map?.dispose?.()
    obj.material?.dispose?.()
  })
  renderer?.dispose()
})
</script>

<template>
  <section ref="wrapEl" class="globe">
    <!-- 텍스처 로딩 동안 지구가 설 자리를 지키는 표식 -->
    <div v-if="!ready" class="globe-loading" aria-hidden="true">
      <span class="loading-orb"></span>
      <span class="loading-text">지구를 불러오는 중</span>
    </div>

    <canvas ref="canvasEl" :class="{ ready }"></canvas>

    <p class="globe-hint">드래그로 지구를 돌리고, 핀을 누르면 그 나라의 도시들이 열립니다</p>

    <!-- 호버 시 핀 위에 뜨는 리퀴드 글래스 카드 -->
    <Transition name="pop">
      <div
        v-if="hovered"
        class="pin-card"
        :class="{ below: cardBelow }"
        :style="{ left: cardPos.x + 'px', top: cardPos.y + 'px' }"
      >
        <p class="pin-en">{{ hovered.english }}</p>
        <p class="pin-name">{{ hovered.name }}</p>
        <div class="pin-row">
          <WeatherGlyph :status="hovered.glyph || hovered.status" :size="20" />
          <span class="pin-temp">{{ Math.round(hovered.temp) }}°</span>
          <span class="pin-capital">{{ hovered.capital }}</span>
        </div>
        <span class="pin-cta">도시 보러가기 →</span>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
/* 부모(히어로)가 배경과 크기를 소유한다 — 캔버스는 꽉 채우기만 */
.globe {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.globe canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  /* 텍스처가 도착하면 부드럽게 떠오른다 */
  opacity: 0;
  transition: opacity 0.9s ease;
}

.globe canvas.ready {
  opacity: 1;
}

/* 로딩 표식 — 지구가 뜰 자리에 은은하게 숨쉬는 원 */
.globe-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: var(--s2);
}

.loading-orb {
  width: min(46vh, 60vw);
  height: min(46vh, 60vw);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: radial-gradient(circle at 38% 32%, rgba(96, 140, 210, 0.2), rgba(20, 32, 56, 0.28) 70%);
  animation: orb-breathe 1.8s ease-in-out infinite;
}

.loading-text {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.4);
}

@keyframes orb-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.55;
  }
  50% {
    transform: scale(1.03);
    opacity: 1;
  }
}

.globe-hint {
  position: absolute;
  left: var(--s2);
  bottom: var(--s2);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.45);
}

/* 리퀴드 글래스 카드 — 핀 좌표 위에 뜬다 */
.pin-card {
  position: absolute;
  transform: translate(-50%, calc(-100% - 18px));
  min-width: 168px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  color: #fff;
  pointer-events: none;
}

.pin-en {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.pin-name {
  font-size: 17px;
  font-weight: 800;
  margin-top: 2px;
}

.pin-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-top: 7px;
}

.pin-temp {
  font-size: 17px;
  font-weight: 300;
  font-variant-numeric: tabular-nums;
}

.pin-capital {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
}

.pin-cta {
  display: block;
  margin-top: 9px;
  padding-top: 7px;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.pin-card.below {
  transform: translate(-50%, 22px);
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.18s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-100% - 8px)) scale(0.96);
}
</style>
