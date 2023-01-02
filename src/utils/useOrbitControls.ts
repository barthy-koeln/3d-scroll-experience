import { DURATION, ORBIT_MIN_DISTANCE } from '@/utils/constants'
import { Easing, Tween } from '@tweenjs/tween.js'
import { Box3, PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function useOrbitControls (camera: PerspectiveCamera, canvas: HTMLCanvasElement) {
  const orbitControls = new OrbitControls(camera, canvas)
  orbitControls.minDistance = ORBIT_MIN_DISTANCE
  orbitControls.enableDamping = true
  orbitControls.update()

  return {
    orbitControls,

    startOrbitControls (): void {
      orbitControls.enabled = true
    },

    stopOrbitControls (): void {
      orbitControls.enabled = false
    },

    frameObject (box: Box3, offset: Vector3 | undefined = undefined) {
      const boxSize = box.getSize(new Vector3()).length()
      const boxCenter = box.getCenter(new Vector3())

      if (offset) {
        boxCenter.add(offset)
      }

      new Tween(orbitControls)
        .duration(DURATION)
        .easing(Easing.Cubic.InOut)
        .to({
          target: boxCenter,
          minDistance: ORBIT_MIN_DISTANCE
        })
        .onUpdate(() => orbitControls.update())
        .onComplete(() => {
          orbitControls.minDistance = ORBIT_MIN_DISTANCE
          orbitControls.update()
        })
        .start()

      camera.near = boxSize / 100
      camera.far = boxSize * 100
      camera.updateProjectionMatrix()

      orbitControls.maxDistance = boxSize * 10
      orbitControls.update()
    }
  }
}