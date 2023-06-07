import type { AnimationDirector } from '@/services/AnimationDirector'
import type { CameraOperator } from '@/services/CameraOperator'

export abstract class ControlsInterface {
  protected animationDirector: AnimationDirector
  protected cameraOperator: CameraOperator
  constructor (animationDirector: AnimationDirector, cameraOperator: CameraOperator) {
    this.animationDirector = animationDirector
    this.cameraOperator = cameraOperator
  }

  public abstract start(): Promise<void>
  public abstract stop(): void
  public abstract update(time: number, delta: number): void
}
