import { Mesh, MeshPhysicalMaterial, Object3D, PlaneGeometry, Scene, ShadowMaterial, SpotLight, Texture } from 'three'

type PhysicallyRenderedMesh = Mesh & { material: MeshPhysicalMaterial }

function createPointLight (intensity: number, x: number, y: number, z: number) {
  const light = new SpotLight(0xffffff, intensity * 100, 50, Math.PI / 3, 0, 2)

  light.position.set(x, y, z)
  light.target.position.set(0, 0, 0)

  light.castShadow = true

  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512
  light.shadow.bias = -0.0001

  return light
}

export function useDefaultScene (envMap: Texture): Scene {
  const scene = new Scene()
  let debugPrepared = false

  scene.environment = envMap

  const planeGeometry = new PlaneGeometry(20, 20, 32, 32)
  const planeMaterial = new ShadowMaterial()
  const plane = new Mesh(planeGeometry, planeMaterial)
  plane.position.y = -.73
  plane.rotation.x = -Math.PI / 2
  plane.material.opacity = 0.2
  plane.receiveShadow = true
  scene.add(plane)

  const lights = [
    createPointLight(2, -4, 4.9, 8), // BACK
    createPointLight(2, 11, 4.9, -4), // FILL
    createPointLight(3, 3, 4.9, -14) // KEY
  ]

  lights.map(light => scene.add(light))

  const resetDebug = (mesh: PhysicallyRenderedMesh) => {
    const material = mesh.material as MeshPhysicalMaterial
    mesh.userData.debugMap = material.map
    material.wireframe = false
  }

  const setDebug = (callback?: (child: PhysicallyRenderedMesh) => void) => {
    scene.traverse((child: Object3D) => {
      if (!(child instanceof Mesh)) {
        return
      }

      if (!debugPrepared) {
        child.userData.debugMap = child.material.map
      }

      resetDebug(child)
      if (callback) {
        callback(child)
      }

      child.material.needsUpdate = true
    })

    debugPrepared = true
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

  return scene
}