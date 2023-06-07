import type { Object3D } from 'three'

/**
 * Starts at a child and bubbled upwards until it finds one of the possible parents.
 */
export function pickObject3DParent (parents: Object3D[], child: Object3D | null): Object3D | null {
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
