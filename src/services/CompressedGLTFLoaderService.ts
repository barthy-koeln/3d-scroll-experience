import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


export function compressedGLTGLoaderFactory (): GLTFLoader {
  const dracoLoader = new DRACOLoader()
  const gltfLoader = new GLTFLoader()

  dracoLoader.setDecoderPath('/draco/')
  gltfLoader.setDRACOLoader(dracoLoader)
  dracoLoader.preload()

  return gltfLoader
}

export const CompressedGLTFLoaderService = Symbol()