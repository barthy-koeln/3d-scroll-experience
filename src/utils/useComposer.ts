import type { Camera, Scene, WebGLRenderer } from 'three'
import { Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

export function useComposer (renderer: WebGLRenderer, scene: Scene, camera: Camera) {
  const composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), scene, camera)
  composer.addPass(outlinePass)

  const effectFXAA = new ShaderPass(FXAAShader)
  effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight)
  effectFXAA.renderToScreen = true
  composer.addPass(effectFXAA)

  return {
    composer,
    outlinePass,
    effectFXAA
  }
}