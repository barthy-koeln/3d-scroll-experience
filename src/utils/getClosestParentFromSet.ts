import type { Object3D } from 'three'

export function getClosestParentFromSet (parents: Object3D[], child: Object3D | null): Object3D | null {
  while (child) {
    if (parents.includes(child)) {
      return child
    }

    if (child.parent) {
      child = child.parent
      continue
    }

    child = null
  }

  return child
}