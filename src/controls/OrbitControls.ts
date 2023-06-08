import type { BeforeStartCallback } from '@/controls/ControlsInterface'
import { ControlsInterface } from '@/controls/ControlsInterface'
import { OrbitControls as BaseOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { Camera, Vector3 } from 'three'

export class OrbitControls extends ControlsInterface {
  private readonly baseOrbit: BaseOrbitControls
  private readonly beforeStart: BeforeStartCallback

  update () {
    this.baseOrbit.update()
  }

  constructor (camera: Camera, canvas: HTMLCanvasElement, target: Vector3, beforeStart: BeforeStartCallback) {
    super()

    this.beforeStart = beforeStart
    this.baseOrbit = new BaseOrbitControls(camera, canvas)

    Object.assign(this.baseOrbit, {
      enabled: false,
      minDistance: 0.2,
      maxDistance: 17,
      maxPolarAngle: Math.PI / 2,
      enableDamping: true,
      target
    })

    this.baseOrbit.update()
  }

  async start (): Promise<void> {
    if (this.baseOrbit.enabled) {
      return
    }

    await this.beforeStart()

    this.baseOrbit.enabled = true
  }

  stop (): void {
    if (!this.baseOrbit.enabled) {
      return
    }

    this.baseOrbit.enabled = false
  }
}
