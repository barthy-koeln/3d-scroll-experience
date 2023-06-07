import type { Object3D, PerspectiveCamera, Quaternion, Vector3 } from 'three'
import { DirectionalLight } from 'three'
import { Easing, Tween } from '@tweenjs/tween.js'
import { DURATION } from '@/constants'
import { getLargestRectInRect } from '@/utils/getLargestRectInRect'
import type { InjectionKey } from 'vue'

class CameraOperatorNotInitializedError extends Error {
  constructor () {
    super('CameraOperator not initialized')
  }
}

export class CameraOperator {
  private startPosition: Vector3|null = null
  private startRotation: Quaternion|null = null
  private initialFov: number|null = null
  private desiredAspect: number|null = null
  private light: DirectionalLight|null = null
  public camera: PerspectiveCamera|null = null
  public canvas: HTMLCanvasElement|null = null
  public cameraTarget: Object3D|null = null

  public setCameraTarget (cameraTarget: Object3D): void {
    this.cameraTarget = cameraTarget
  }

  public setCanvas (canvas: HTMLCanvasElement): void {
    this.canvas = canvas
  }

  public setCamera (camera: PerspectiveCamera, desiredAspect: number): void {
    this.camera = camera

    this.initialFov = camera.fov
    this.desiredAspect = desiredAspect
    this.startPosition = this.camera.position.clone()
    this.startRotation = this.camera.quaternion.clone()
  }

  public tween<T extends Object> (from: T, to: Partial<T>, onUpdate?: (object: T, elapsed: number) => void): Promise<T> {
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

  public moveToStartPosition (): Promise<Vector3> {
    if (this.camera === null || this.startPosition === null) {
      throw new CameraOperatorNotInitializedError()
    }

    return this.tween<Vector3>(this.camera.position, this.startPosition)
  }

  public lookAtTarget (): Promise<Quaternion> {
    if (this.camera === null || this.cameraTarget === null) {
      throw new CameraOperatorNotInitializedError()
    }

    const start = this.camera.quaternion.clone()
    this.camera.lookAt(this.cameraTarget.position)

    const end = this.camera.quaternion.clone()
    this.camera.quaternion.copy(start)

    return this.tween(this.camera.quaternion, end)
  }

  public restore (): Promise<unknown> {
    if (this.camera === null || this.startRotation === null) {
      throw new CameraOperatorNotInitializedError()
    }

    return Promise.all([
      this.moveToStartPosition(),
      this.tween(this.camera.quaternion, this.startRotation)
    ])
  }

  public updateCameraDimensions (width: number, height: number): void {
    if (this.camera === null || this.desiredAspect === null || this.initialFov === null) {
      throw new CameraOperatorNotInitializedError()
    }

    this.camera.aspect = width / height
    const fovFactor = this.desiredAspect / this.camera.aspect

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

    this.camera.fov = this.initialFov * fovFactor
    this.camera.setViewOffset(
      maxWidth,
      maxHeight,
      -1 * viewOffsetX,
      -1 * viewOffsetY,
      width,
      height
    )

    this.camera.updateProjectionMatrix()
  }

  addDirectLighting () {
    if (this.camera === null) {
      throw new CameraOperatorNotInitializedError()
    }

    if (this.light === null) {
      this.light = new DirectionalLight(0xffffff, 1)
      this.light.position.set(0, 0, 1)
    }

    this.camera.add(this.light)
  }
}

export const CameraOperatorService = Symbol('DISymbol') as InjectionKey<CameraOperator>
