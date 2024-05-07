import { useCompressedGLTFLoader } from '@/composables/useCompressedGLTFLoader'
import { AnimationMixer, Light, Mesh, Object3D, PerspectiveCamera, Scene } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useAnimationsStore } from '@/state/useAnimationsStore'

export interface InteractiveGltf {
  camera: PerspectiveCamera,
  cameraTarget: Object3D,
  interactiveObjects: Object3D[]
}

export async function useInteractiveGLTF (url: string, interactiveElementNames: string[], scene: Scene, anisotropy: number): Promise<InteractiveGltf> {
  const gltfLoader = useCompressedGLTFLoader()
  const adjustableMaps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap']

  const animationsStore = useAnimationsStore()

  function prepareObjectForInteractivity (object: Object3D) {
    object.userData.initialPosition = object.position.clone()
  }

  function adjustVisibleItem (child: Object3D) {
    if (child instanceof Light) {
      child.intensity *= 0.01
      child.castShadow = true
      child.shadow.mapSize.width = 1024
      child.shadow.mapSize.height = 1024
      child.shadow.bias = -0.001
      return
    }

    if (child instanceof Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      child.material.envMapIntensity = 0.5

      for (const map of adjustableMaps) {
        const texture = child.material[map]

        if (texture) {
          texture.anisotropy = anisotropy
        }
      }
    }
  }

  const gltf: GLTF = await gltfLoader.loadAsync(`${import.meta.env.BASE_URL}${url}`)

  const interactiveObjects = [] as Object3D[]
  for (const objectName of interactiveElementNames) {
    const object = gltf.scene.getObjectByName(objectName)
    if (!object) {
      continue
    }

    prepareObjectForInteractivity(object)
    interactiveObjects.push(object)
  }

  const camera = gltf.scene.getObjectByName('camera') as PerspectiveCamera
  const cameraTarget = gltf.scene.getObjectByName('cameraTarget') as Object3D

  gltf.scene.traverseVisible(adjustVisibleItem)
  scene.add(gltf.scene)

  animationsStore.setMixer(new AnimationMixer(gltf.scene))
  animationsStore.addClips(gltf.animations)

  return {
    camera,
    cameraTarget,
    interactiveObjects
  }
}
