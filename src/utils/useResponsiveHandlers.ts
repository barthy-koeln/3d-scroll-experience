import type { PerspectiveCamera, Renderer } from 'three'
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import type { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

export function useResponsiveHandlers (
  canvas: HTMLCanvasElement,
  composer: EffectComposer,
  renderer: Renderer,
  effectFXAA: ShaderPass,
  camera: PerspectiveCamera
) {

  function onResize () {
    const { width, height, clientWidth, clientHeight } = canvas

    if (width === clientWidth && height === clientHeight) {
      return
    }

    renderer.setSize(clientWidth, clientHeight, false)
    composer.setSize(clientWidth, clientHeight)
    effectFXAA.uniforms['resolution'].value.set(1 / clientWidth, 1 / clientHeight)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  function startResponsivenessHandlers () {
    window.addEventListener('resize', onResize)
  }

  function stopResponsivenessHandlers () {
    window.removeEventListener('resize', onResize)
  }

  return {
    startResponsivenessHandlers,
    stopResponsivenessHandlers
  }
}