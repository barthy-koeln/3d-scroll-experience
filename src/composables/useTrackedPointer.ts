import {Vector2} from 'three'
import {onBeforeUnmount, onMounted} from "vue";


export function useTrackedPointer (): Vector2 {
  const pointer = new Vector2()

  function onPointerMove (event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  onMounted(() => {
    window.addEventListener('pointermove', onPointerMove)
  })

  onBeforeUnmount(() => {
    window.addEventListener('pointermove', onPointerMove)
  })

  return pointer
}