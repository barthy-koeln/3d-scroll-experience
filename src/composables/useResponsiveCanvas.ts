import type {ResizeListenerCallback} from '@/composables/useResizeListener'

type ResponsiveCanvas = {
  canvas: HTMLCanvasElement,
  updateCanvasDimensions: ResizeListenerCallback
}

export function useResponsiveCanvas (className: string): ResponsiveCanvas {
  const canvas = document.createElement('canvas')

  canvas.width = document.documentElement.offsetWidth
  canvas.height = window.innerHeight
  canvas.classList.add(className)

  return {
    canvas,
    updateCanvasDimensions (width: number, height: number) {
      canvas.width = width
      canvas.height = height
    }
  }
}