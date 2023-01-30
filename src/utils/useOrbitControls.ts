import { DURATION } from '@/utils/constants'
import { Easing, Tween } from '@tweenjs/tween.js'

import { Box3, Object3D, PerspectiveCamera, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { SetupContext } from 'vue'
import { ref } from 'vue'

export function useOrbitControls (camera: PerspectiveCamera, cameraTarget: Object3D, canvas: HTMLCanvasElement, context: SetupContext) {
  const orbitControls = ref<null | OrbitControls>(null)
  const lastStartPosition = new Vector3()

  function tweenOrbitVec3 (from: Vector3, to: Vector3) {
    return new Promise(resolve => {
      if (!orbitControls.value) {
        return
      }

      new Tween(from)
        .duration(DURATION)
        .easing(Easing.Cubic.InOut)
        .to(to)
        .onUpdate(orbitControls.value.update)
        .onComplete(resolve)
        .start()
    })
  }

  return {
    orbitControls,

    async startOrbitControls (): Promise<void> {
      if (!orbitControls.value) {
        orbitControls.value = new OrbitControls(camera, canvas)
        orbitControls.value.minDistance = 1
        orbitControls.value.maxDistance = 17
        orbitControls.value.maxPolarAngle = Math.PI / 2
        orbitControls.value.enableDamping = true
        orbitControls.value.enabled = false
      }

      if (orbitControls.value.enabled) {
        return
      }

      camera.getWorldPosition(lastStartPosition)
      cameraTarget.getWorldPosition(orbitControls.value.target)
      orbitControls.value.update()

      orbitControls.value.enabled = true

      context.emit('start-orbit-controls')
    },

    async stopOrbitControls (): Promise<void> {
      if (!orbitControls.value) {
        return
      }

      await Promise.all([
        tweenOrbitVec3(camera.position, lastStartPosition),
        tweenOrbitVec3(orbitControls.value.target, cameraTarget.position)
      ])

      orbitControls.value.enabled = false
      context.emit('stop-orbit-controls')
    },

    async frameObject (box: Box3, offset?: Vector3) {
      if (!orbitControls.value) {
        return
      }

      const boxSize = box.getSize(new Vector3()).length()
      const boxCenter = box.getCenter(new Vector3())

      if (offset) {
        boxCenter.add(offset)
      }

      camera.near = boxSize / 100
      camera.far = boxSize * 100
      camera.updateProjectionMatrix()

      await tweenOrbitVec3(orbitControls.value.target, boxCenter)
    }
  }
}