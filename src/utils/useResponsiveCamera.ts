import type { ResizeListenerCallback } from '@/utils/useResizeListeners'
import { DirectionalLight, PerspectiveCamera } from 'three'

type ResponsiveCamera = {
  camera: PerspectiveCamera,
  updateCamera: ResizeListenerCallback
}

export function useResponsiveCamera (cameraIn?: PerspectiveCamera): ResponsiveCamera {
  const camera = cameraIn || new PerspectiveCamera()

  camera.userData.initialFov = camera.fov

  const light = new DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 1)
  camera.add(light)

  return {
    camera,
    updateCamera (width: number, height: number) {
      camera.aspect = width / height

      const desiredAspect = 16 / 9
      const fovFactor = desiredAspect / camera.aspect

      const maxWidth = 1920
      const maxHeight = 1080

      camera.fov = camera.userData.initialFov * fovFactor
      camera.setViewOffset(
        maxWidth,
        maxHeight,
        -1 * (width - maxWidth) / 2,
        -1 * (height - maxHeight) / 2,
        width,
        height
      )

      camera.updateProjectionMatrix()
    }
  }
}