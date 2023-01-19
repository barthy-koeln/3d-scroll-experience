export type ResizeListenerCallback = (width: number, height: number) => void

export function useResizeListeners (handlers: ResizeListenerCallback[]) {
  function onResize () {
    for (const handler of handlers) {
      handler(document.documentElement.offsetWidth, window.innerHeight)
    }
  }

  onResize()

  function startResizeListener () {
    window.addEventListener('resize', onResize)
  }

  function stopResizeListener () {
    window.removeEventListener('resize', onResize)
  }

  return {
    startResizeListener,
    stopResizeListener
  }
}