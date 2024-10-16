import { onMounted, onUnmounted } from 'vue-demi'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import * as THREE from 'three'

let gui: GUI | null = null

export type TLights =
  | THREE.DirectionalLight
  | THREE.AmbientLight
  | THREE.PointLight
  | THREE.SpotLight

export type THelpers =
  | THREE.DirectionalLightHelper
  | THREE.PointLightHelper
  | THREE.SpotLightHelper

export const initGui = () => {
  gui = new GUI()
  document.body.appendChild(gui.domElement)
}

export const clearGui = () => {
  if (gui) {
    document.body.removeChild(gui.domElement)
    gui = null
  }
}
export function useGui(scene: THREE.Scene) {
  function addLight(
    object: TLights,
    folderName: string,
    data: Partial<{
      lightColor: string
      helper: THelpers
    }>,
  ) {
    const helper = data.helper

    if (!gui) {
      console.warn('GUI is not initialized.')
      return
    }

    const folderControl = gui.addFolder(folderName)
    folderControl.addColor(data, 'lightColor').onChange(() => {
      if (data?.lightColor) object.color.set(data.lightColor)
    })
    folderControl.add(object, 'intensity', 0, Math.PI * 10)

    if (
      object instanceof THREE.PointLight ||
      object instanceof THREE.SpotLight
    ) {
      folderControl
        .add(object, 'distance', 0, 20)
        .onChange(() => helper && helper.update())

      folderControl
        .add(object, 'decay', 0, 10)
        .onChange(() => helper && helper.update())
    }
  }

  function addControl(
    object: THREE.Object3D,
    folderName: string,
    data: Partial<{
      helper: THelpers
    }> | null = null,
  ) {
    if (!gui) {
      console.warn('GUI não está inicializado.')
      return
    }

    const helper = data?.helper
    if (helper) {
      helper.visible = false
      scene.add(helper)
    }

    const folderControl = gui.addFolder(folderName)
    folderControl.add(object, 'visible')
    folderControl
      .add(object.position, 'x', -1, 1, 0.001)
      .onChange(() => helper && helper.update())
    folderControl
      .add(object.position, 'y', -1, 1, 0.001)
      .onChange(() => helper && helper.update())
    folderControl
      .add(object.position, 'z', -1, 1, 0.001)
      .onChange(() => helper && helper.update())
    if (helper) folderControl.add(helper, 'visible').name('Helper Visible')
    folderControl.close()
  }

  onMounted(() => {
    initGui()
  })

  onUnmounted(() => {
    if (gui) {
      gui.destroy()
      gui = null
    }
  })

  return {
    addControl,
    addLight,
    getGui: () => gui,
  }
}
