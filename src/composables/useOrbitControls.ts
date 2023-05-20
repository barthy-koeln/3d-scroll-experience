import type {Object3D, PerspectiveCamera} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {inject, ref} from 'vue'
import {CameraOperator, CameraOperatorService} from "@/services/CameraOperator";

export function useOrbitControls (camera: PerspectiveCamera, cameraTarget: Object3D, canvas: HTMLCanvasElement) {
  const orbitControls = ref<null | OrbitControls>(null)
  const cameraOperator = inject<CameraOperator>(CameraOperatorService)

  return {
    orbitControls,

    async startOrbitControls () {
      if (!orbitControls.value) {
        orbitControls.value = new OrbitControls(camera, canvas)
        orbitControls.value.enabled = false
        orbitControls.value.minDistance = 1
        orbitControls.value.maxDistance = 17
        orbitControls.value.maxPolarAngle = Math.PI / 2
        orbitControls.value.enableDamping = true
        orbitControls.value.target = cameraTarget.position
        orbitControls.value.update()
      }

      if (orbitControls.value.enabled) {
        return
      }

      await cameraOperator?.lookAtTarget()
      orbitControls.value.enabled = true
    },

    async stopOrbitControls (): Promise<void> {
      if (!orbitControls.value) {
        return
      }

      if (!orbitControls.value.enabled) {
        return
      }

      orbitControls.value.enabled = false
    }
  }
}