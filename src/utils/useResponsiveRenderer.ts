import type { ResizeListenerCallback } from '@/utils/useResizeListeners'
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from 'three'

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
  renderer.shadowMap.enabled = true
  renderer.outputEncoding = sRGBEncoding
  renderer.shadowMap.type = PCFSoftShadowMap

  return {
    renderer,
    updateRenderer (width: number, height: number) {
      renderer.setSize(width, height, false)
    }
  }
}