import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  watch,
} from 'vue-demi'
import * as THREE from 'three'
import { useGui } from '@/composables/useGui'

export default defineComponent({
  name: 'ThreeDirectionLight',
  props: {
    color: {
      type: [Number, String],
      default: 0xffffff,
    },
    intensity: {
      type: Number,
      default: 1,
    },
    position: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 1, z: 1 }),
    },
  },
  setup(props) {
    const animateScene = inject<boolean>('animateScene')
    const scene = inject<THREE.Scene>('scene')
    const render = inject<() => void>('render')
    let light: THREE.DirectionalLight | null = null

    const { addControl, addLight } = useGui(scene as THREE.Scene)

    const initLight = () => {
      if (!scene) {
        console.error('Scene not provided.')
        return
      }

      light = new THREE.DirectionalLight(props.color, props.intensity)
      light.position.set(props.position.x, props.position.y, props.position.z)
      scene.add(light)

      const helper = new THREE.DirectionalLightHelper(light)
      addControl(light, 'Directional Light Controls', {
        helper,
      })

      addLight(light, 'Directional Light Props', {
        lightColor: '0xffffff',
        helper,
      })

      if (render) render()
    }

    const updateLight = () => {
      if (light) {
        light.color.set(props.color)
        light.intensity = props.intensity
        light.position.set(props.position.x, props.position.y, props.position.z)

        if (animateScene) return
        if (render) render()
      }
    }

    onMounted(() => {
      initLight()
    })

    onUnmounted(() => {
      if (light && scene) {
        scene.remove(light)
        if (render) render()
      }
    })

    watch(() => props.color, updateLight)
    watch(() => props.intensity, updateLight)
    watch(() => props.position, updateLight)

    return {}
  },
})
