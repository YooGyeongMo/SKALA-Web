import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'

/**
 * 첫 진입 인트로 시퀀스 로직
 *
 * loading: 워드마크와 선이 뜨고 해가 돌며 데이터를 기다린다
 * leaving: 데이터가 준비되면 위로 상승하며 본문에 자리를 넘긴다
 * done:    오버레이가 DOM에서 제거된 상태
 *
 * 최소 2.3초는 보여주고, 홈의 첫 데이터(uiStore.dataReady)가 준비되는
 * 시점과 늦은 쪽에 맞춘다. 6초 안전장치와 모션 축소 사용자 예외를 둔다.
 */
export function useIntroSequence() {
  const introState = ref('loading')
  const route = useRoute()
  const router = useRouter()
  const uiStore = useUiStore()

  const waitDataReady = () =>
    new Promise((resolve) => {
      if (uiStore.dataReady) return resolve()
      const stop = watch(
        () => uiStore.dataReady,
        (ready) => {
          if (ready) {
            stop()
            resolve()
          }
        },
      )
      setTimeout(() => {
        stop()
        resolve()
      }, 6000)
    })

  const run = async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      introState.value = 'done'
      uiStore.markReady()
      return
    }
    // 홈이 아닌 경로로 직접 들어온 경우에는 데이터 신호 없이 바로 준비 완료로 본다
    router.isReady().then(() => {
      if (route.path !== '/') uiStore.markReady()
    })
    await Promise.all([new Promise((r) => setTimeout(r, 2300)), waitDataReady()])
    introState.value = 'leaving'
    setTimeout(() => {
      introState.value = 'done'
    }, 950)
  }

  onMounted(run)

  return { introState }
}
