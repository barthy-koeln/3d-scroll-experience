import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { KeyboardControls } from '@/services/controls/KeyboardControls'
import type { Camera } from 'three'
import { Vector3 } from 'three'
import { ControlsInterface } from '@/services/controls/ControlsInterface'
import type { CameraOperator } from '@/services/CameraOperator'
import type { AnimationDirector } from '@/services/AnimationDirector'

export class FirstPersonControls extends ControlsInterface {
  private readonly pointerLockControls: PointerLockControls
  private readonly keyboardControls: KeyboardControls
  private readonly copyVector: Vector3 = new Vector3()

  private enabled: boolean = false

  constructor (animationDirector: AnimationDirector, cameraOperator: CameraOperator) {
    super(animationDirector, cameraOperator)

    const camera = this.cameraOperator.camera as Camera
    const canvas = this.cameraOperator.canvas as HTMLCanvasElement

    this.pointerLockControls = new PointerLockControls(camera, canvas)
    this.keyboardControls = new KeyboardControls(canvas, {
      sprintFactor: 1.75,
      crouchFactor: 0.5
    })
  }

  public update (time: number, delta: number): void {
    if (!this.cameraOperator.camera) {
      return
    }

    this.copyVector
      .copy(this.keyboardControls.velocity)
      .multiplyScalar(delta)
      .applyQuaternion(this.cameraOperator.camera.quaternion)
      .setY(0)

    this.cameraOperator.camera.position.add(this.copyVector)
  }

  private onClick = () => {
    this.pointerLockControls.lock()
  }

  public async start (): Promise<void> {
    if (this.enabled || !this.cameraOperator.camera) {
      return
    }

    this.keyboardControls.start()
    await this.cameraOperator.tween<Vector3>(this.cameraOperator.camera.position, { y: 0.8 })

    this.cameraOperator.canvas?.addEventListener('click', this.onClick)
    this.pointerLockControls.connect()
    this.pointerLockControls.lock()

    this.enabled = true
  }

  public stop () : void {
    if (!this.enabled) {
      return
    }

    this.keyboardControls.stop()
    this.cameraOperator.canvas?.removeEventListener('click', this.onClick)
    this.pointerLockControls.disconnect()
    this.pointerLockControls.unlock()

    this.enabled = false
  }
}
