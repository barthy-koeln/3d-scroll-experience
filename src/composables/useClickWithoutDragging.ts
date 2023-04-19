import type { SetupContext } from 'vue'
import { ref } from 'vue'

export function useClickWithoutDragging (context: SetupContext, maximumClickDistance = 5) {
  const lastPointerDownX = ref<number | null>(null)
  const lastPointerDownY = ref<number | null>(null)

  return {
    onPointerDown (event: MouseEvent): void {
      lastPointerDownX.value = event.clientX
      lastPointerDownY.value = event.clientY
    },

    onPointerUp (event: MouseEvent): void {
      if (lastPointerDownX.value === null || lastPointerDownY.value === null) {
        return
      }

      const distanceX = Math.abs(event.clientX - lastPointerDownX.value)
      const distanceY = Math.abs(event.clientY - lastPointerDownY.value)

      if (distanceX <= maximumClickDistance && distanceY <= maximumClickDistance) {
        context.emit('click', event)
      }
    }
  }
}