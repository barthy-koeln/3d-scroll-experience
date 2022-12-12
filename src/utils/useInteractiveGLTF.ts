import { useCompressedGLTFLoader } from '@/utils/useCompressedGLTFLoader'
import { Box3, Object3D } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export interface InteractiveGltf {
  gltf: GLTF,
  initialBox: Box3,
  interactiveObjects: Object3D[]
}

export async function useInteractiveGLTF (url: string, interactiveElementNames: string[]) {
  const gltfLoader = useCompressedGLTFLoader()

  function prepareObjectForInteractivity (object: Object3D) {
    // nothing yet...
  }

  const onLoad = (resolve: Function, interactiveElementNames: string[], interactiveObjects: Object3D[]) => (gltf: GLTF) => {
    for (const objectName of interactiveElementNames) {
      const object = gltf.scene.getObjectByName(objectName)
      if (!object) {
        continue
      }

      object.traverseVisible(prepareObjectForInteractivity)
      prepareObjectForInteractivity(object)

      interactiveObjects.push(object)
    }

    const initialBox = new Box3().setFromObject(gltf.scene)

    resolve({
      gltf,
      initialBox,
      interactiveObjects
    })
  }


  const interactiveObjects = [] as Object3D[]

  return new Promise<InteractiveGltf>(function (resolve, reject) {
    gltfLoader.load(
      url,
      onLoad(resolve, interactiveElementNames, interactiveObjects),
      undefined,
      reject
    )
  })
}