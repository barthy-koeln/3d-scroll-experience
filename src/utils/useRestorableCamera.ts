import { DURATION } from '@/utils/constants'
import { Easing, Tween } from '@tweenjs/tween.js'
import type { Object3D } from 'three'
import { PerspectiveCamera } from 'three'

export function useRestorableCamera (cameraIn: PerspectiveCamera, cameraTarget: Object3D) {
  const camera = cameraIn || new PerspectiveCamera()
  const startPosition = camera.position.clone()
  const startRotation = camera.quaternion.clone()

  function tweenCamera<T extends Object> (from: T, to: T, onUpdate?: (object: T, elapsed: number) => void) {
    return new Promise(resolve => {
      const tween = new Tween(from)
        .duration(DURATION)
        .easing(Easing.Cubic.InOut)
        .to(to)
        .onComplete(resolve)

      if (onUpdate) {
        tween.onUpdate(onUpdate)
      }

      tween.start()
    })
  }

  camera.userData.tweenCamera = tweenCamera

  camera.userData.goToStartPoint = async () => {
    return await tweenCamera(camera.position, startPosition)
  }

  camera.userData.lookAtTarget = async () => {
    const start = camera.quaternion.clone()
    camera.lookAt(cameraTarget.position)
    const end = camera.quaternion.clone()
    camera.quaternion.copy(start)

    return await tweenCamera(camera.quaternion, end)
  }

  camera.userData.restoreInitialConfig = async function (): Promise<void> {

    await Promise.all([
      camera.userData.goToStartPoint(),
      tweenCamera(camera.quaternion, startRotation)
    ])
  }

  return camera
}