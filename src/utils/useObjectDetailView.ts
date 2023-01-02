import type OInterActiveScene from '@/components/Organism/OInteractiveScene.vue'
import { DURATION } from '@/utils/constants'
import { Easing, Tween } from '@tweenjs/tween.js'
import { Box3, Object3D, Vector3 } from 'three'
import type { Ref } from 'vue'

const activeObjectOffset = new Vector3(125, 0, 0)

export function useObjectDetailView (scene: Ref<InstanceType<typeof OInterActiveScene> | null>) {

  return {
    toggleActiveObject (interactiveObjects: Object3D[], newActive: Object3D | null, previousActive: Object3D | null) {
      for (const object of interactiveObjects || []) {
        const isActive = newActive === object
        const wasActive = previousActive === object

        if (isActive === wasActive) {
          continue
        }

        new Tween(object.position)
          .duration(DURATION)
          .easing(Easing.Cubic.InOut)
          .to(
            isActive
              ? object.position.clone().add(activeObjectOffset)
              : object.userData.initialPosition
          )
          .start()
      }

      if (newActive) {
        scene.value?.frameObject(new Box3().setFromObject(newActive), activeObjectOffset)
        return
      }

      scene.value?.resetFrame()
    }
  }
}