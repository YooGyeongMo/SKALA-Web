<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import earthTextureUrl from '@/assets/textures/earth_atmos_2048.jpg'

// 우주에서 본 지구 히어로
// 영상 파일 대신 three.js로 실시간 렌더링한다.
// 텍스처는 three.js 공식 예제의 NASA 계열 퍼블릭 도메인 이미지다.
// About 라우트에서만 로드되므로 다른 페이지 번들에는 영향이 없다.
const canvasEl = ref(null)
const wrapEl = ref(null)

let renderer = null
let scene = null
let camera = null
let earth = null
let stars = null
let rafId = 0
let disposed = false

// 포인터를 따라 아주 살짝 기우는 시차 목표값
const pointer = { x: 0, y: 0 }

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const onPointerMove = (e) => {
  const rect = wrapEl.value.getBoundingClientRect()
  pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

const onResize = () => {
  if (!renderer || !wrapEl.value) return
  const { clientWidth: w, clientHeight: h } = wrapEl.value
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h, false)
}

// 인디케이터를 누르면 히어로 바로 아래 본문으로 스르륵 내려간다
const scrollToContent = () => {
  const behavior = reduceMotion ? 'auto' : 'smooth'
  const next = wrapEl.value?.nextElementSibling
  if (next) next.scrollIntoView({ behavior })
  else window.scrollTo({ top: wrapEl.value?.offsetHeight ?? 0, behavior })
}

onMounted(() => {
  const wrap = wrapEl.value
  const { clientWidth: w, clientHeight: h } = wrap

  renderer = new THREE.WebGLRenderer({ canvas: canvasEl.value, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(w, h, false)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100)
  camera.position.set(0, 0, 3.2)

  // 지구 — 텍스처는 sRGB로 읽는다
  const texture = new THREE.TextureLoader().load(earthTextureUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 1 }),
  )
  earth.rotation.z = 0.41 // 자전축 기울기 23.5도
  scene.add(earth)

  // 태양광과 우주의 옅은 산란광
  const sun = new THREE.DirectionalLight(0xffffff, 2.4)
  sun.position.set(5, 2, 4)
  scene.add(sun)
  scene.add(new THREE.AmbientLight(0x223355, 0.55))

  // 별 필드 — 반경 30 구면에 흩뿌린 점들
  const starCount = 1500
  const positions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    const r = 28 + Math.random() * 4
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
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.75 }),
  )
  scene.add(stars)

  const animate = () => {
    if (disposed) return
    // 모션 축소 사용자에게는 정지 화면을 보여준다
    if (!reduceMotion) {
      earth.rotation.y += 0.0009
      stars.rotation.y += 0.00012
      camera.position.x += (pointer.x * 0.18 - camera.position.x) * 0.03
      camera.position.y += (-pointer.y * 0.12 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)
    }
    renderer.render(scene, camera)
    rafId = requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('resize', onResize)
  wrap.addEventListener('pointermove', onPointerMove)
})

onBeforeUnmount(() => {
  disposed = true
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  wrapEl.value?.removeEventListener('pointermove', onPointerMove)
  // WebGL 리소스를 손으로 정리한다
  earth?.geometry.dispose()
  earth?.material.map?.dispose()
  earth?.material.dispose()
  stars?.geometry.dispose()
  stars?.material.dispose()
  renderer?.dispose()
})
</script>

<template>
  <section ref="wrapEl" class="earth-hero">
    <canvas ref="canvasEl"></canvas>

    <div class="hero-copy">
      <p class="hero-label">About</p>
      <h1 class="hero-title">SKALA WEATHER</h1>
      <p class="hero-sub">지구 어디의 하늘이든, 한 화면에서.</p>
    </div>

    <!-- 둥근 스크롤 인디케이터 — 마우스 안에서 점이 아래로 흐르고, 누르면 본문으로 스르륵 내려간다 -->
    <button type="button" class="scroll-orb" aria-label="아래로 스크롤" @click="scrollToContent">
      <span class="orb-mouse">
        <span class="orb-dot"></span>
      </span>
    </button>
  </section>
</template>

<style scoped>
.earth-hero {
  position: relative;
  height: 74vh;
  min-height: 480px;
  background:
    radial-gradient(900px 500px at 68% 42%, rgba(64, 110, 190, 0.22), transparent 60%),
    #05070d;
  border-bottom: 1px solid var(--line-strong);
  overflow: hidden;
}

.earth-hero canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.hero-copy {
  position: absolute;
  left: clamp(20px, 6vw, 72px);
  bottom: clamp(28px, 7vh, 64px);
  color: #fff;
}

.hero-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.hero-title {
  margin-top: 8px;
  font-size: clamp(34px, 5vw, 60px);
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1.05;
}

.hero-sub {
  margin-top: 10px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
}

/* 둥근 스크롤 인디케이터 — 원 안의 마우스에서 점이 아래로 흐른다 */
.scroll-orb {
  position: absolute;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  display: grid;
  place-items: center;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.25s ease;
}

/* 마우스 실루엣 — 둥근 몸통 안에서 휠 점이 구른다 */
.orb-mouse {
  display: flex;
  justify-content: center;
  width: 15px;
  height: 23px;
  padding-top: 4px;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 9px;
}

.scroll-orb:hover,
.scroll-orb:focus-visible {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.14);
  transform: translateX(-50%) translateY(-2px);
}

.scroll-orb:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 3px;
}

.orb-dot {
  display: block;
  width: 3px;
  height: 6px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.85);
  animation: dot-flow 1.9s ease-in-out infinite;
}

@keyframes dot-flow {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70%,
  100% {
    transform: translateY(8px);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orb-dot {
    animation: none;
  }
}
</style>
