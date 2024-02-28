import { HalfFloatType, PMREMGenerator, Texture, WebGLRenderer } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

export async function useEnvMap (renderer: WebGLRenderer, url: string): Promise<Texture> {
  const pmremGenerator = new PMREMGenerator(renderer)
  const rgbeLoader = new RGBELoader()

  pmremGenerator.compileEquirectangularShader()
  return new Promise(function (resolve, reject) {
    rgbeLoader
      .setDataType(HalfFloatType)
      .load(
        url,
        function (texture: Texture) {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture

          texture.dispose()
          pmremGenerator.dispose()

          resolve(envMap)
        },
        undefined,
        reject
      )
  })
}
