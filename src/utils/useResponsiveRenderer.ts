import type { ResizeListenerCallback } from '@/utils/useResizeListeners'
import { WebGLRenderer } from 'three'

type ResponsiveRenderer = {
  renderer: WebGLRenderer,
  updateRenderer: ResizeListenerCallback
}

export function useResponsiveRenderer (canvas: HTMLCanvasElement): ResponsiveRenderer {
  const renderer = new WebGLRenderer(
    {
      canvas,
      alpha: true,
      antialias: true
    }
  )

  renderer.physicallyCorrectLights = true

  return {
    renderer,
    updateRenderer (width: number, height: number) {
      renderer.setSize(width, height, false)
    }
  }
}