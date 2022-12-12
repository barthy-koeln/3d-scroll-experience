import '@/utils/mesh-bvh'
import { Raycaster } from 'three'

export function useBVHRaycaster (): Raycaster {
  const raycaster = new Raycaster()
  raycaster.firstHitOnly = true

  return raycaster
}