import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Object3D } from 'three'

export const useInteractiveObjectsStore = defineStore('interactive-objects', () => {
  const hoverObject = ref<null|Object3D>(null)
  const activeObject = ref<null|Object3D>(null)

  function setHoverObject (object: Object3D | null) {
    hoverObject.value = object
  }

  return {
    hoverObject,
    activeObject,
    setHoverObject
  }
})
