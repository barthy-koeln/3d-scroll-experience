import type { ResizeListenerCallback } from '@/utils/useResizeListeners'
import { PerspectiveCamera } from 'three'

type ResponsiveCamera = {
  camera: PerspectiveCamera,
  updateCamera: ResizeListenerCallback
}

export function useResponsiveCamera (cameraIn?: PerspectiveCamera): ResponsiveCamera {
  const camera = cameraIn || new PerspectiveCamera()

  camera.userData.initialFov = camera.fov

  return {
    camera,
    updateCamera (width: number, height: number) {
      camera.aspect = width / height

      const desiredAspect = 16 / 9
      const fovFactor = desiredAspect / camera.aspect

      camera.fov = camera.userData.initialFov * fovFactor

      camera.updateProjectionMatrix()
    }
  }
}