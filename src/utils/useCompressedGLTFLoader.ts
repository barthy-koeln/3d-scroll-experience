import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let dracoLoader = null as DRACOLoader | null
let gltfLoader = null as GLTFLoader | null

export function useCompressedGLTFLoader (): GLTFLoader {
  if (!gltfLoader) {
    dracoLoader = new DRACOLoader()
    gltfLoader = new GLTFLoader()

    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)
    dracoLoader.preload()
  }

  return gltfLoader
}