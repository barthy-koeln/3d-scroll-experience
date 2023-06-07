import { ref } from 'vue'
import type { Object3D } from 'three'

export function useInteractiveObject3Ds (interactiveElementNames: string[]) {
  const hoverObject = ref<null|Object3D>(null)
  const activeObject = ref<null|Object3D>(null)
  function setHoverObject (object: Object3D | null) {
    hoverObject.value = object
  }

  function promoteHoverObject () {
    if (!hoverObject.value) {
      return
    }

    if (hoverObject.value === activeObject.value) {
      activeObject.value = null
      return
    }

    activeObject.value = hoverObject.value
  }

  return {
    hoverObject,
    activeObject,
    setHoverObject,
    promoteHoverObject
  }
}
