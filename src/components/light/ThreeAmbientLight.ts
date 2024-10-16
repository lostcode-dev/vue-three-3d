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
  name: 'ThreeAmbientLight',
  props: {
    color: {
      type: [String, Number],
      default: 0xffffff,
    },
    intensity: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const animateScene = inject<boolean>('animateScene')
    const scene = inject<THREE.Scene>('scene')
    const render = inject<() => void>('render')

    let ambientLight: THREE.AmbientLight | null = null

    const { addControl, addLight } = useGui(scene as THREE.Scene)

    const initLight = () => {
      if (!scene) {
        console.error(
          'Cena não encontrada. Verifique a hierarquia dos componentes.',
        )
        return
      }

      ambientLight = new THREE.AmbientLight(props.color, props.intensity)

      scene.add(ambientLight)

      addControl(ambientLight, 'Ambient Light Controls')

      addLight(ambientLight, 'Ambient Light Props', {
        lightColor: '0xffffff',
      })

      if (render) render()
    }

    const updateLight = () => {
      if (ambientLight) {
        ambientLight.color.set(props.color)
        ambientLight.intensity = props.intensity
        if (animateScene) return

        if (render) render()
      }
    }

    onMounted(() => {
      initLight()
    })

    onUnmounted(() => {
      if (ambientLight && scene) {
        scene.remove(ambientLight)
        if (render) render()
      }
    })

    watch(() => props.color, updateLight)
    watch(() => props.intensity, updateLight)

    return {}
  },
})
