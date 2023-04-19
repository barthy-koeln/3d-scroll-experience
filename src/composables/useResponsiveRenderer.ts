import type { ResizeListenerCallback } from '@/composables/useResizeListeners'
import { PCFSoftShadowMap, sRGBEncoding, WebGLRenderer } from 'three'

type ResponsiveRenderer = {
  renderer: WebGLRenderer,
  updateRendererDimensions: ResizeListenerCallback
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
    updateRendererDimensions (width: number, height: number) {
      renderer.setSize(width, height, false)
    }
  }
}