import type { ResizeListenerCallback } from '@/utils/useResizeListeners'

type ResponsiveCanvas = {
  canvas: HTMLCanvasElement,
  updateCanvas: ResizeListenerCallback
}

export function useResponsiveCanvas (): ResponsiveCanvas {
  const canvas = document.createElement('canvas')

  canvas.width = document.documentElement.offsetWidth
  canvas.height = window.innerHeight

  return {
    canvas,
    updateCanvas (width: number, height: number) {
      canvas.width = width
      canvas.height = height
    }
  }
}