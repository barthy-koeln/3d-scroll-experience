import { onBeforeUnmount, onMounted } from 'vue'

export type ResizeListenerCallback = (width: number, height: number) => void

export function useResizeListener (handler: ResizeListenerCallback) {
  function onResize () {
    const width = document.documentElement.offsetWidth
    const height = window.innerHeight

    handler(width, height)
  }

  onResize()

  onMounted(() => {
    window.addEventListener('resize', onResize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
  })
}
