import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import type { Quaternion, Vector3 } from 'three'
import { Object3D, PerspectiveCamera } from 'three'
import { Easing, Tween } from '@tweenjs/tween.js'
import { DURATION } from '@/constants'
import { getLargestRectInRect } from '@/utils/getLargestRectInRect'

class CameraOperatorNotInitializedError extends Error {
  constructor () {
    super('CameraOperator not initialized')
  }
}

export const useCameraStore = defineStore('camera', () => {
  const startPosition = shallowRef<Vector3>()
  const startRotation = shallowRef<Quaternion>()
  const initialFov = ref<number>()
  const desiredAspect = ref<number>()

  const camera = shallowRef<PerspectiveCamera>()
  const canvas = shallowRef<HTMLCanvasElement>()
  const cameraTarget = shallowRef<Object3D>()

  function setCameraTarget (newTarget: Object3D): void {
    cameraTarget.value = newTarget
  }

  function setCanvas (newCanvas: HTMLCanvasElement): void {
    canvas.value = newCanvas
  }

  function setCamera (newCamera: PerspectiveCamera, newAspect: number): void {
    camera.value = newCamera

    initialFov.value = newCamera.fov
    desiredAspect.value = newAspect
    startPosition.value = camera.value.position.clone()
    startRotation.value = camera.value.quaternion.clone()
  }

  function tween<T extends Object> (from: T, to: Partial<T>, onUpdate?: (object: T, elapsed: number) => void): Promise<T> {
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

  async function moveToStartPosition (): Promise<Vector3> {
    if (!camera.value || !startPosition.value) {
      throw new CameraOperatorNotInitializedError()
    }

    return tween<Vector3>(camera.value.position, startPosition.value)
  }

  async function lookAtTarget (): Promise<Quaternion> {
    if (!camera.value || !cameraTarget.value) {
      throw new CameraOperatorNotInitializedError()
    }

    const start = camera.value.quaternion.clone()
    camera.value.lookAt(cameraTarget.value.position)

    const end = camera.value.quaternion.clone()
    camera.value.quaternion.copy(start)

    return tween(camera.value.quaternion, end)
  }

  async function goToPersonHeight (): Promise<Vector3> {
    if (!camera.value) {
      throw new CameraOperatorNotInitializedError()
    }

    return tween<Vector3>(camera.value.position as Vector3, { y: 0.8 })
  }

  async function restore (): Promise<[Vector3, Quaternion]> {
    if (!camera.value || !startRotation.value) {
      throw new CameraOperatorNotInitializedError()
    }

    return Promise.all([
      moveToStartPosition(),
      tween(camera.value.quaternion, startRotation.value)
    ])
  }

  function updateCameraDimensions (width: number, height: number): void {
    if (!camera.value || !desiredAspect.value || !initialFov.value) {
      throw new CameraOperatorNotInitializedError()
    }

    camera.value.aspect = width / height
    const fovFactor = desiredAspect.value / camera.value.aspect

    const {
      width: maxWidth,
      height: maxHeight
    } = getLargestRectInRect(
      {
        width,
        height
      },
      {
        width: 1920,
        height: 1080
      }
    )

    const viewOffsetX = (width - maxWidth) / 2
    const viewOffsetY = (height - maxHeight) / 2

    document.body.style.setProperty('--camera-view-width', maxWidth + 'px')
    document.body.style.setProperty('--camera-view-height', maxHeight + 'px')
    document.body.style.setProperty('--camera-view-offset-x', viewOffsetX + 'px')
    document.body.style.setProperty('--camera-view-offset-y', viewOffsetY + 'px')

    camera.value.fov = initialFov.value * fovFactor
    camera.value.setViewOffset(
      maxWidth,
      maxHeight,
      -1 * viewOffsetX,
      -1 * viewOffsetY,
      width,
      height
    )

    camera.value.updateProjectionMatrix()
  }

  return {
    camera,
    cameraTarget,
    canvas,
    setCamera,
    setCameraTarget,
    setCanvas,
    tween,

    updateCameraDimensions,
    goToPersonHeight,
    lookAtTarget,
    restore
  }
})
