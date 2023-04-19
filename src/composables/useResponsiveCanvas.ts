import type { ResizeListenerCallback } from '@/composables/useResizeListeners'

type ResponsiveCanvas = {
  canvas: HTMLCanvasElement,
  updateCanvasDimensions: ResizeListenerCallback
}

export function useResponsiveCanvas (): ResponsiveCanvas {
  const canvas = document.createElement('canvas')

  canvas.width = document.documentElement.offsetWidth
  canvas.height = window.innerHeight

  return {
    canvas,
    updateCanvasDimensions (width: number, height: number) {
      canvas.width = width
      canvas.height = height
    }
  }
}