import '@/mesh-bvh'
import { pickObject3DParent } from '@/utils/pickObject3DParent'
import { Object3D, Raycaster } from 'three'
import { ref } from 'vue'
import { useInteractiveObjectsStore } from '@/state/useInteractiveObjectsStore'

export function useBVHRaycaster () {
  const raycaster = new Raycaster()
  const enabled = ref(false)

  const interactiveObjectsStore = useInteractiveObjectsStore()

  // @ts-ignore
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
    updateIntersections (intersectionTargets: Object3D[]) {
      if (!enabled.value) {
        return
      }

      const intersects = raycaster.intersectObjects(intersectionTargets)

      if (!intersects.length) {
        if (interactiveObjectsStore.hoverObject) {
          interactiveObjectsStore.setHoverObject(null)
        }

        return
      }

      const firstIntersection = intersects[0]
      const interactiveParent = pickObject3DParent(intersectionTargets, firstIntersection.object)

      if (interactiveParent?.uuid !== interactiveObjectsStore.hoverObject?.uuid) {
        interactiveObjectsStore.setHoverObject(interactiveParent)
      }
    }
  }
}
