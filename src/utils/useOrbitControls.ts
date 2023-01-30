import type { Object3D, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ref } from 'vue'

export function useOrbitControls (camera: PerspectiveCamera, cameraTarget: Object3D, canvas: HTMLCanvasElement) {
  const orbitControls = ref<null | OrbitControls>(null)

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

      await camera.userData.lookAtTarget()
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