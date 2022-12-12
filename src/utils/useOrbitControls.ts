import { ORBIT_MIN_DISTANCE } from '@/utils/constants'
import type { Camera } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export function useOrbitControls (camera: Camera, canvas: HTMLCanvasElement): OrbitControls {
  const orbitControls = new OrbitControls(camera, canvas)
  orbitControls.minDistance = ORBIT_MIN_DISTANCE
  orbitControls.update()

  return orbitControls
}