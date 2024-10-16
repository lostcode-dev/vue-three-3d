import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  watch,
} from 'vue-demi'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeModel',
  props: {
    src: {
      type: String,
      required: true,
    },
    scale: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 1, y: 1, z: 1 }),
    },
    position: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 0, z: 0 }),
    },
    rotation: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 0, z: 0 }),
    },
  },
  setup(props) {
    const animateScene = inject<boolean>('animateScene')
    const scene = inject<THREE.Scene>('scene')
    const render = inject<() => void>('render')
    const loader = new GLTFLoader()
    let model: THREE.Group

    const initModel = () => {
      if (!scene) {
        console.error('Scene not provided.')
        return
      }

      console.log(props.src)

      loader.load(
        props.src,
        gltf => {
          model = gltf.scene

          model.scale.set(props.scale.x, props.scale.y, props.scale.z)
          model.position.set(
            props.position.x,
            props.position.y,
            props.position.z,
          )
          model.rotation.set(
            props.rotation.x,
            props.rotation.y,
            props.rotation.z,
          )

          scene.add(model)

          const directionalLight = new THREE.DirectionalLight(0xffffff, 1) // Luz direcional
          directionalLight.position.set(5, 10, 7.5)
          scene.add(directionalLight)

          if (render) render()
        },
        undefined,
        error => {
          console.error('Erro ao carregar o modelo:', error)
        },
      )
    }

    const updateModel = () => {
      if (model) {
        model.scale.set(props.scale.x, props.scale.y, props.scale.z)
        model.position.set(props.position.x, props.position.y, props.position.z)
        model.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
        if (animateScene) return

        if (render) render()
      }
    }

    watch(
      () => props.scale,
      () => {
        updateModel()
      },
      { deep: true },
    )

    watch(
      () => props.position,
      () => {
        updateModel()
      },
      { deep: true },
    )

    watch(
      () => props.rotation,
      () => {
        updateModel()
      },
      { deep: true },
    )

    onMounted(() => {
      initModel()
    })

    onUnmounted(() => {
      if (model && scene) {
        scene.remove(model)
        if (render) render()
      }
    })

    return
  },
})
