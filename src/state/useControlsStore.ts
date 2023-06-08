import { defineStore } from 'pinia'

import { ControlsInterface } from '@/controls/ControlsInterface'
import { ref, shallowRef } from 'vue'
import { useAnimationsStore } from '@/state/useAnimationsStore'
import type { Camera, Vector3 } from 'three'
import { useCameraStore } from '@/state/useCameraStore'

export type ControlsType = 'scroll' | 'orbit' | 'firstPerson'

type ControlsFactory = () => Promise<ControlsInterface>

export const useControlsStore = defineStore('controls', () => {
  const controls: Map<ControlsType, ControlsInterface> = new Map()
  const currentControlsType = ref<ControlsType>()
  const nextControlsType = ref<ControlsType|null>()
  const availableControls = ref<ControlsType[]>(['scroll', 'orbit', 'firstPerson'])
  const currentControls = shallowRef<ControlsInterface|null>()

  const animationsStore = useAnimationsStore()
  const cameraStore = useCameraStore()

  const factories: Record<ControlsType, ControlsFactory> = {
    firstPerson: async () => {
      const module = await import('@/controls/FirstPersonControls')

      return new module.FirstPersonControls(
        cameraStore.camera as Camera,
        cameraStore.canvas as HTMLCanvasElement,
        cameraStore.goToPersonHeight
      )
    },

    orbit: async () => {
      const module = await import('@/controls/OrbitControls')

      return new module.OrbitControls(
        cameraStore.camera as Camera,
        cameraStore.canvas as HTMLCanvasElement,
        cameraStore.cameraTarget?.position as Vector3,
        cameraStore.lookAtTarget
      )
    },

    scroll: async () => {
      const module = await import('@/controls/ScrollControls')

      return new module.ScrollControls(
        animationsStore.setFactor,
        cameraStore.restore
      )
    }
  }

  async function change (type: ControlsType) {
    nextControlsType.value = type

    if (!controls.has(type)) {
      const factory = factories[type]
      controls.set(type, await factory())
    }

    const newControls = controls.get(type) as ControlsInterface

    currentControls.value?.stop()
    await newControls.start()

    currentControls.value = newControls
    currentControlsType.value = type
    nextControlsType.value = null
  }

  function setAvailableControls (controls: ControlsType[]): void {
    availableControls.value = controls
  }

  return {
    currentControls,
    currentControlsType,
    nextControlsType,
    availableControls,
    setAvailableControls,
    change
  }
})
