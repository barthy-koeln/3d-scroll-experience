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

      const maxWidth = Math.min(1920, width)
      const maxHeight = Math.floor(maxWidth / desiredAspect)

      const viewOffsetX = (width - maxWidth) / 2
      const viewOffsetY = (height - maxHeight) / 2

      document.body.style.setProperty('--camera-view-width', maxWidth + 'px')
      document.body.style.setProperty('--camera-view-height', maxHeight + 'px')
      document.body.style.setProperty('--camera-view-offset-x', viewOffsetX + 'px')
      document.body.style.setProperty('--camera-view-offset-y', viewOffsetY + 'px')

      camera.fov = camera.userData.initialFov * fovFactor
      camera.setViewOffset(
        maxWidth,
        maxHeight,
        -viewOffsetX,
        -viewOffsetY,
        width,
        height
      )

      camera.updateProjectionMatrix()
    }
  }
}