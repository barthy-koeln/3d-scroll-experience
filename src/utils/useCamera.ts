import { PerspectiveCamera } from 'three'

export function useCamera (x: number, y: number, z: number): PerspectiveCamera {
  const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight)
  camera.position.set(x, y, z)

  return camera
}