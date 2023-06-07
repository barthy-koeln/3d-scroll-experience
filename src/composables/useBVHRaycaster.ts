import '@/mesh-bvh'
import { pickObject3DParent } from '@/utils/pickObject3DParent'
import { Object3D, Raycaster } from 'three'
import { ref } from 'vue'

export function useBVHRaycaster (updateHoverItem: (value: null|Object3D) => void) {
  const raycaster = new Raycaster()
  const enabled = ref(false)

  raycaster.firstHitOnly = true

  return {
    raycaster,

    startRaycasting () {
      enabled.value = true
    },

    stopRaycasting () {
      enabled.value = false
    },

    /**
     * ! do not use reactivity here
     */
    updateIntersections (intersectionTargets: Object3D[], hoverObject: Object3D | null) {
      if (!enabled.value) {
        return
      }

      const intersects = raycaster.intersectObjects(intersectionTargets)

      if (!intersects.length) {
        if (hoverObject) {
          updateHoverItem(null)
        }

        return
      }

      const firstIntersection = intersects[0]
      const interactiveParent = pickObject3DParent(intersectionTargets, firstIntersection.object)

      if (interactiveParent?.uuid !== hoverObject?.uuid) {
        updateHoverItem(interactiveParent)
      }
    }
  }
}
