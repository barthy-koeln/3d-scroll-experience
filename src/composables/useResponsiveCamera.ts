import type { ResizeListenerCallback } from '@/composables/useResizeListeners'
import { getLargestRectInRect } from '@/utils/getLargestRectInRect'
import { DirectionalLight, PerspectiveCamera } from 'three'

type ResponsiveCamera = {
  camera: PerspectiveCamera,
  updateCameraDimensions: ResizeListenerCallback
}

export function useResponsiveCamera (cameraIn?: PerspectiveCamera): ResponsiveCamera {
  const camera = cameraIn || new PerspectiveCamera()
  const initialFov = camera.fov

  const light = new DirectionalLight(0xffffff, 1)
  light.position.set(0, 0, 1)
  camera.add(light)

  return {
    camera,
    updateCameraDimensions (width: number, height: number) {
      camera.aspect = width / height

      const desiredAspect = 16 / 9
      const fovFactor = desiredAspect / camera.aspect

      const {
        width: maxWidth,
        height: maxHeight
      } = getLargestRectInRect(
        {
          width,
          height
        },
        {
          width: 1920,
          height: 1080
        }
      )

      const viewOffsetX = (width - maxWidth) / 2
      const viewOffsetY = (height - maxHeight) / 2

      document.body.style.setProperty('--camera-view-width', maxWidth + 'px')
      document.body.style.setProperty('--camera-view-height', maxHeight + 'px')
      document.body.style.setProperty('--camera-view-offset-x', viewOffsetX + 'px')
      document.body.style.setProperty('--camera-view-offset-y', viewOffsetY + 'px')

      camera.fov = initialFov * fovFactor
      camera.setViewOffset(
        maxWidth,
        maxHeight,
        -1 * viewOffsetX,
        -1 * viewOffsetY,
        width,
        height
      )

      camera.updateProjectionMatrix()
    }
  }
}