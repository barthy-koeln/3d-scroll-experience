import { ControlsInterface } from '@/services/controls/ControlsInterface'
import { OrbitControls as BaseOrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { Camera } from 'three'

export class OrbitControls extends ControlsInterface {
  private baseOrbit: BaseOrbitControls|null = null

  update () {
    this.baseOrbit?.update()
  }

  async start (): Promise<void> {
    if (!this.baseOrbit) {
      const camera = this.cameraOperator.camera as Camera
      const canvas = this.cameraOperator.canvas as HTMLCanvasElement

      this.baseOrbit = new BaseOrbitControls(camera, canvas)

      Object.assign(this.baseOrbit, {
        enabled: false,
        minDistance: 0.2,
        maxDistance: 17,
        maxPolarAngle: Math.PI / 2,
        enableDamping: true,
        target: this.cameraOperator.cameraTarget?.position
      })

      this.baseOrbit.update()
    }

    if (this.baseOrbit?.enabled) {
      return
    }

    await this.cameraOperator?.lookAtTarget()

    this.baseOrbit.enabled = true
  }

  stop (): void {
    if (!this.baseOrbit || !this.baseOrbit.enabled) {
      return
    }

    this.baseOrbit.enabled = false
  }
}
