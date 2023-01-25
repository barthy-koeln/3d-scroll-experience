import { DURATION } from '@/utils/constants'
import { Easing, Tween } from '@tweenjs/tween.js'
import CameraControls from 'camera-controls'
import {
  Box3,
  MathUtils,
  Matrix4,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Sphere,
  Spherical,
  Vector2,
  Vector3,
  Vector4
} from 'three'
import type { SetupContext } from 'vue'

const subsetOfTHREE = {
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Spherical,
  Box3,
  Sphere,
  Raycaster,
  MathUtils: {
    DEG2RAD: MathUtils.DEG2RAD,
    clamp: MathUtils.clamp
  }
}

export function useOrbitControls (camera: PerspectiveCamera, cameraTarget: Object3D, canvas: HTMLCanvasElement, context: SetupContext) {
  CameraControls.install({ THREE: subsetOfTHREE })
  const orbitControls = new CameraControls(camera, canvas)
  const copyVector = new Vector3()
  const lastStartPosition = new Vector3()

  orbitControls.minDistance = 150
  orbitControls.maxDistance = 750
  orbitControls.maxPolarAngle = Math.PI / 2
  orbitControls.enabled = false

  function tweenOrbitFunction<T extends Record<string | number | symbol, unknown>> (method: Function, from: T, to: T) {
    return new Promise(resolve => {
      new Tween(from)
        .duration(DURATION)
        .easing(Easing.Cubic.InOut)
        .to(to)
        .onUpdate((updatedValues: T) => {
          const args = Object.values(updatedValues) as []
          method.apply(orbitControls, args)
        })
        .onComplete(resolve)
        .start()
    })
  }

  function tweenOrbitFunctionVec3 (method: Function, from: Vector3, to: Vector3) {
    return tweenOrbitFunction(
      method,
      {
        x: from.x,
        y: from.y,
        z: from.z
      },
      {
        x: to.x,
        y: to.y,
        z: to.z
      }
    )
  }

  return {
    orbitControls,

    async startOrbitControls (): Promise<void> {
      if (orbitControls.enabled) {
        return
      }

      lastStartPosition.copy(camera.position)

      await orbitControls.setPosition(lastStartPosition.x, lastStartPosition.y, lastStartPosition.z, false)
      await orbitControls.setTarget(cameraTarget.position.x, cameraTarget.position.y, cameraTarget.position.z, false)
      orbitControls.enabled = true
      context.emit('start-orbit-controls')
    },

    async stopOrbitControls (): Promise<void> {
      const promises = []

      orbitControls.getPosition(copyVector)
      promises.push(tweenOrbitFunctionVec3(orbitControls.setPosition, copyVector, lastStartPosition))

      orbitControls.getTarget(copyVector)
      promises.push(tweenOrbitFunctionVec3(orbitControls.setTarget, copyVector, cameraTarget.position))

      await Promise.all(promises)

      orbitControls.enabled = false
      context.emit('stop-orbit-controls')
    },

    frameObject (box: Box3, offset?: Vector3) {
      const boxSize = box.getSize(new Vector3()).length()
      const boxCenter = box.getCenter(new Vector3())
      orbitControls.getTarget(copyVector)

      if (offset) {
        boxCenter.add(offset)
      }

      tweenOrbitFunctionVec3(orbitControls.setTarget, copyVector, boxCenter)

      camera.near = boxSize / 100
      camera.far = boxSize * 100
      camera.updateProjectionMatrix()
    }
  }
}