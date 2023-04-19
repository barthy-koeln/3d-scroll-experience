import { KeyboardControls } from '@/composables/KeyboardControls'
import type { Object3D, PerspectiveCamera } from 'three'
import { Vector3 } from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { ref } from 'vue'

export function useFirstPersonControls (camera: PerspectiveCamera, cameraTarget: Object3D, canvas: HTMLCanvasElement) {
  const pointerLockControls = ref<null | PointerLockControls>(null)
  const keyBoardControls = ref<null | KeyboardControls>(null)
  const copyVector = new Vector3()

  const firstPersonControls = {
    pointerLockControls,
    keyBoardControls,
    enabled: false,
    update (delta: number) {
      if (!keyBoardControls.value) {
        return
      }

      copyVector
        .copy(keyBoardControls.value?.velocity)
        .multiplyScalar(delta)
        .applyQuaternion(camera.quaternion)

      copyVector.y = 0

      camera.position.add(copyVector)
    }
  }

  function onClick () {
    pointerLockControls.value?.lock()
  }

  return {
    firstPersonControls,

    async startFPSControls () {
      if (!pointerLockControls.value) {
        pointerLockControls.value = new PointerLockControls(camera, canvas)
        firstPersonControls.enabled = false
      }

      if (!keyBoardControls.value) {
        keyBoardControls.value = new KeyboardControls(canvas, {
          sprintFactor: 1.75,
          crouchFactor: .5
        })
      }

      if (firstPersonControls.enabled) {
        return
      }

      keyBoardControls.value.start()
      await camera.userData.tweenCamera(camera.position, { y: 0.8 })
      canvas.addEventListener('click', onClick)
      pointerLockControls.value.connect()
      pointerLockControls.value.lock()

      firstPersonControls.enabled = true
    },

    async stopFPSControls () {
      if (!firstPersonControls.enabled) {
        return
      }

      keyBoardControls.value?.stop()
      canvas.removeEventListener('click', onClick)
      pointerLockControls.value?.disconnect()
      pointerLockControls.value?.unlock()
      firstPersonControls.enabled = false
    }
  }
}