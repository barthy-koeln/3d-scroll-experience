import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export class CompressedGLTFLoader extends GLTFLoader {
  constructor () {
    super()

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    dracoLoader.preload()

    this.setDRACOLoader(dracoLoader)
  }
}

export const CompressedGLTFLoaderService = Symbol('DISymbol')
