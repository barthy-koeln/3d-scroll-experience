import { Mesh, MeshPhysicalMaterial, Object3D, Scene } from 'three'
import { ref } from 'vue'

type PhysicallyRenderedMesh = Mesh & { material: MeshPhysicalMaterial }

export function useDebuggableMaterials (scene: Scene) {
  const debugPrepared = ref(false)

  function resetDebug (mesh: PhysicallyRenderedMesh) {
    const material = mesh.material as MeshPhysicalMaterial
    mesh.userData.debugMap = material.map
    material.wireframe = false
  }

  function setDebug (callback?: (child: PhysicallyRenderedMesh) => void) {
    scene.traverse((child: Object3D) => {
      if (!(child instanceof Mesh)) {
        return
      }

      if (!debugPrepared.value) {
        child.userData.debugMap = child.material.map
      }

      resetDebug(child)
      if (callback) {
        callback(child)
      }

      child.material.needsUpdate = true
    })

    debugPrepared.value = true
  }

  (window as any).debug = {
    debugWireframe () {
      setDebug(mesh => {
        mesh.material.wireframe = true
      })
    },

    debugNormal () {
      setDebug(mesh => {
        if (!mesh.material.normalMap) {
          return
        }

        mesh.material.map = mesh.material.normalMap
      })
    },

    debugMetal () {
      setDebug(mesh => {
        if (!mesh.material.metalnessMap) {
          return
        }

        mesh.material.map = mesh.material.metalnessMap
      })
    },

    reset: setDebug
  }
}