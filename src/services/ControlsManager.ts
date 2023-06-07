import type { ControlsInterface } from '@/services/controls/ControlsInterface'
import type { InjectionKey, Ref } from 'vue'
import { ref } from 'vue'
import type { AnimationDirector } from '@/services/AnimationDirector'
import type { CameraOperator } from '@/services/CameraOperator'

export type ControlsType = 'scroll' | 'orbit' | 'firstPerson'

type ControlsConstructor = new (animationDirector: AnimationDirector, cameraOperator: CameraOperator) => ControlsInterface;
type ControlsFactory = () => Promise<ControlsConstructor>

const factories: Record<ControlsType, ControlsFactory> = {
  firstPerson: () => import('./controls/FirstPersonControls').then(module => module.FirstPersonControls),
  orbit: () => import('./controls/OrbitControls').then(module => module.OrbitControls),
  scroll: () => import('./controls/ScrollControls').then(module => module.ScrollControls)
}

export class ControlsManager {
  private readonly controls: Map<ControlsType, ControlsInterface> = new Map()
  public readonly currentControlsType: Ref<ControlsType|null>
  private currentControls: ControlsInterface|null = null
  private readonly animationDirector: AnimationDirector
  private readonly cameraOperator: CameraOperator
  public availableControls: ControlsType[] = ['scroll', 'orbit', 'firstPerson']

  constructor (animationDirector: AnimationDirector, cameraOperator: CameraOperator) {
    this.currentControlsType = ref<ControlsType|null>(null)

    this.animationDirector = animationDirector
    this.cameraOperator = cameraOperator
  }

  public setAvailableControls (controls: ControlsType[]): void {
    this.availableControls = controls
  }

  async switchControls (type: ControlsType) {
    if (!this.controls.has(type)) {
      const factory = factories[type]
      const Constructor = await factory()
      this.controls.set(type, new Constructor(this.animationDirector, this.cameraOperator))
    }

    const newControls = this.controls.get(type) as ControlsInterface

    this.currentControls?.stop()
    await newControls.start()

    this.currentControls = newControls
    this.currentControlsType.value = type
  }

  async start (): Promise<void> {
    if (!this.currentControls) {
      await this.switchControls('scroll')
    }

    this.currentControls?.start()
  }

  stop (): void {
    this.currentControls?.stop()
  }

  updateControls (time: number, delta: number) {
    this.currentControls?.update(time, delta)
  }
}

export const ControlsManagerService = Symbol('DISymbol') as InjectionKey<ControlsManager>
