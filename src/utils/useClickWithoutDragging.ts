import type { SetupContext } from 'vue'
import { ref } from 'vue'

export function useClickWithoutDragging (context: SetupContext) {
  const lastDownPosition = ref<[number, number] | null>(null)

  return {
    onPointerDown (event: MouseEvent): void {
      lastDownPosition.value = [event.clientX, event.clientY]
    },

    onPointerUp (event: MouseEvent): void {
      if (!lastDownPosition.value) {
        return
      }

      const [lastX, lastY] = lastDownPosition.value
      const distanceX = Math.abs(event.clientX - lastX)
      const distanceY = Math.abs(event.clientY - lastY)

      if (distanceX < 5 && distanceY < 5) {
        context.emit('click', event)
      }
    }
  }
}