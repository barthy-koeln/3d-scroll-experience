import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { KeyboardControls } from '@/controls/KeyboardControls'
import type { Camera } from 'three'
import { Vector3 } from 'three'
import type { BeforeStartCallback } from '@/controls/ControlsInterface'
import { ControlsInterface } from '@/controls/ControlsInterface'

export class FirstPersonControls extends ControlsInterface {
  private readonly pointerLockControls: PointerLockControls
  private readonly keyboardControls: KeyboardControls
  private readonly copyVector: Vector3 = new Vector3()
  private readonly camera: Camera
  private readonly canvas: HTMLCanvasElement
  private enabled: boolean = false
  private readonly beforeStart: BeforeStartCallback

  constructor (camera: Camera, canvas: HTMLCanvasElement, beforeStart: BeforeStartCallback) {
    super()

    this.camera = camera
    this.canvas = canvas

    this.beforeStart = beforeStart
    this.pointerLockControls = new PointerLockControls(this.camera, this.canvas)
    this.keyboardControls = new KeyboardControls(this.canvas, {
      sprintFactor: 1.75,
      crouchFactor: 0.5
    })
  }

  public update (time: number, delta: number): void {
    if (!this.camera) {
      return
    }

    this.copyVector
      .copy(this.keyboardControls.velocity)
      .multiplyScalar(delta)
      .applyQuaternion(this.camera.quaternion)
      .setY(0)

    this.camera.position.add(this.copyVector)
  }

  private onClick = () => {
    this.pointerLockControls.lock()
  }

  public async start (): Promise<void> {
    if (this.enabled) {
      return
    }

    this.keyboardControls.start()
    await this.beforeStart()

    this.canvas?.addEventListener('click', this.onClick)
    this.pointerLockControls.connect()
    this.pointerLockControls.lock()

    this.enabled = true
  }

  public stop () : void {
    if (!this.enabled) {
      return
    }

    this.keyboardControls.stop()
    this.canvas?.removeEventListener('click', this.onClick)
    this.pointerLockControls.disconnect()
    this.pointerLockControls.unlock()

    this.enabled = false
  }
}
