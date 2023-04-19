import '@/mesh-bvh'
import { getClosestParentFromSet } from '@/utils/getClosestParentFromSet'
import { Object3D, Raycaster } from 'three'
import type { SetupContext } from 'vue'
import { ref } from 'vue'

export function useBVHRaycaster (context: SetupContext) {
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
          context.emit('update:hover', null)
        }

        return
      }

      const firstIntersection = intersects[0]
      const interactiveParent = getClosestParentFromSet(intersectionTargets, firstIntersection.object)

      if (interactiveParent?.uuid !== hoverObject?.uuid) {
        context.emit('update:hover', interactiveParent)
      }
    }
  }
}