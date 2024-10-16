import { defineComponent, inject, onMounted, watch } from 'vue-demi'
import * as THREE from 'three'
import { useGui } from '@/composables/useGui'

export default defineComponent({
  name: 'ThreePointLight',
  props: {
    color: {
      type: [String, Number],
      default: 0xffffff,
    },
    intensity: {
      type: Number,
      default: 1,
    },
    distance: {
      type: Number,
      default: 0,
    },
    decay: {
      type: Number,
      default: 1,
    },
    position: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 5, z: 0 }),
    },
  },
  setup(props) {
    const scene = inject<THREE.Scene>('scene')
    const render = inject<() => void>('render')
    let pointLight: THREE.PointLight | null = null

    const { addControl, addLight } = useGui(scene as THREE.Scene)

    const initLight = () => {
      if (!scene) {
        console.error('Cena não encontrada.')
        return
      }

      pointLight = new THREE.PointLight(
        props.color,
        props.intensity,
        props.distance,
        props.decay,
      )
      pointLight.position.set(
        props.position.x,
        props.position.y,
        props.position.z,
      )

      scene.add(pointLight)

      addControl(pointLight, 'Spot Light Controls')

      addLight(pointLight, 'Spot Light Props', {
        lightColor: '0xffffff',
      })

      if (render) render()
    }

    const updateLight = () => {
      if (pointLight) {
        pointLight.color.set(props.color)
        pointLight.intensity = props.intensity
        pointLight.distance = props.distance
        pointLight.decay = props.decay
        pointLight.position.set(
          props.position.x,
          props.position.y,
          props.position.z,
        )

        if (render) render()
      }
    }

    onMounted(() => {
      initLight()
    })

    watch(() => props.color, updateLight)
    watch(() => props.intensity, updateLight)
    watch(() => props.distance, updateLight)
    watch(() => props.decay, updateLight)
    watch(() => props.position, updateLight, { deep: true })

    return {}
  },
})
