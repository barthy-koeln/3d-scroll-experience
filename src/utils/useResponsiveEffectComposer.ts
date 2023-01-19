import type { Camera, Scene, WebGLRenderer } from 'three'
import { Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

export function useResponsiveEffectComposer (canvas: HTMLCanvasElement, renderer: WebGLRenderer, scene: Scene, camera: Camera) {
  const composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const outlinePass = new OutlinePass(new Vector2(canvas.width, canvas.height), scene, camera)
  composer.addPass(outlinePass)

  const effectFXAA = new ShaderPass(FXAAShader)
  effectFXAA.renderToScreen = true
  composer.addPass(effectFXAA)

  return {
    composer,
    outlinePass,
    updateEffectComposer (width: number, height: number) {
      composer.setSize(width, height)
      effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height)
    }
  }
}