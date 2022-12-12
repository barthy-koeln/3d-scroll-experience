import { WebGLRenderer } from 'three'

export function useRenderer (canvas: HTMLCanvasElement): WebGLRenderer {
  const renderer = new WebGLRenderer(
    {
      canvas,
      alpha: true,
      antialias: true
    }
  )

  renderer.physicallyCorrectLights = true

  return renderer
}