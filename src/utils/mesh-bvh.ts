import { BufferGeometry, Mesh } from 'three'
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh'

// @ts-ignore
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
// @ts-ignore
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree

Mesh.prototype.raycast = acceleratedRaycast

// @ts-ignore
BufferGeometry.prototype.hasBVH = true
// @ts-ignore
Mesh.prototype.hasBVH = true
