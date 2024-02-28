import type { ResizeListenerCallback } from '@/composables/useResizeListener'
import { PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three'

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

  renderer.shadowMap.enabled = true
  renderer.outputColorSpace = SRGBColorSpace
  renderer.shadowMap.type = PCFSoftShadowMap

  return {
    renderer,
    updateRendererDimensions (width: number, height: number) {
      renderer.setSize(width, height, false)
    }
  }
}
