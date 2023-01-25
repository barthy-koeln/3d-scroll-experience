import type { Camera, Scene, WebGLRenderer } from 'three'
import { Vector2, WebGLRenderTarget } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

export function useResponsiveEffectComposer (canvas: HTMLCanvasElement, renderer: WebGLRenderer, scene: Scene, camera: Camera) {
  const size = renderer.getDrawingBufferSize(new Vector2())
  const renderTarget = new WebGLRenderTarget(size.width, size.height, { samples: 4 })

  const composer = new EffectComposer(renderer, renderTarget)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const outlinePass = new OutlinePass(new Vector2(canvas.width, canvas.height), scene, camera)
  composer.addPass(outlinePass)

  // const effectFXAA = new ShaderPass(FXAAShader)
  // effectFXAA.renderToScreen = true
  // composer.addPass(effectFXAA)

  renderer.autoClear = false
  renderer.setPixelRatio(window.devicePixelRatio)

  return {
    composer,
    outlinePass,
    updateEffectComposer (width: number, height: number) {
      composer.setSize(width, height)
      // effectFXAA.uniforms['resolution'].value.set(1 / (width * renderer.pixelRatio), 1 / (height * renderer.pixelRatio))
    }
  }
}