import { Vector2 } from 'three'


export function useTrackedPointer () {
  const pointer = new Vector2()

  function onPointerMove (event: MouseEvent) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  function startTrackingPointer () {
    window.addEventListener('pointermove', onPointerMove)
  }

  function stopTrackingPointer () {
    window.addEventListener('pointermove', onPointerMove)
  }

  return {
    pointer,
    startTrackingPointer,
    stopTrackingPointer
  }
}