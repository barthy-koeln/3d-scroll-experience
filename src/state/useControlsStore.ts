import { defineStore } from 'pinia'

import { AnimationDirector, AnimationDirectorService } from '@/services/AnimationDirector'
import { CameraOperator, CameraOperatorService } from '@/services/CameraOperator'
import { ControlsInterface } from '@/services/controls/ControlsInterface'
import { inject, ref } from 'vue'

export type ControlsType = 'scroll' | 'orbit' | 'firstPerson'

type ControlsConstructor = new (animationDirector: AnimationDirector, cameraOperator: CameraOperator) => ControlsInterface;
type ControlsFactory = () => Promise<ControlsConstructor>

const factories: Record<ControlsType, ControlsFactory> = {
  firstPerson: () => import('../services/controls/FirstPersonControls').then(module => module.FirstPersonControls),
  orbit: () => import('../services/controls/OrbitControls').then(module => module.OrbitControls),
  scroll: () => import('../services/controls/ScrollControls').then(module => module.ScrollControls)
}
export const useControlsStore = defineStore('controls', () => {
  const controls: Map<ControlsType, ControlsInterface> = new Map()
  const currentControlsType = ref<ControlsType>()
  const nextControlsType = ref<ControlsType|null>()
  const availableControls = ref<ControlsType[]>(['scroll', 'orbit', 'firstPerson'])

  const animationDirector = inject<AnimationDirector>(AnimationDirectorService) as AnimationDirector
  const cameraOperator = inject<CameraOperator>(CameraOperatorService) as CameraOperator

  let currentControls: ControlsInterface|null = null

  async function change (type: ControlsType) {
    nextControlsType.value = type

    if (!controls.has(type)) {
      const factory = factories[type]
      const Constructor = await factory()
      controls.set(type, new Constructor(animationDirector, cameraOperator))
    }

    const newControls = controls.get(type) as ControlsInterface

    currentControls?.stop()
    await newControls.start()

    currentControls = newControls
    currentControlsType.value = type
    nextControlsType.value = null
  }

  async function start (): Promise<void> {
    if (!currentControls) {
      await change('scroll')
    }

    currentControls?.start()
  }

  function stop (): void {
    currentControls?.stop()
  }

  function update (time: number, delta: number) {
    currentControls?.update(time, delta)
  }

  function setAvailableControls (controls: ControlsType[]): void {
    availableControls.value = controls
  }

  return {
    currentControlsType,
    nextControlsType,
    availableControls,
    setAvailableControls,
    change,
    start,
    stop,
    update
  }
})
