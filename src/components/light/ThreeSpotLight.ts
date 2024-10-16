import { defineComponent, inject, onMounted, watch } from 'vue-demi'
import * as THREE from 'three'
import { useGui } from '@/composables/useGui'

export default defineComponent({
  name: 'ThreeSpotLight',
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
    angle: {
      type: Number,
      default: Math.PI / 3,
    },
    penumbra: {
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
    let spotLight: THREE.SpotLight | null = null

    const { addControl, addLight } = useGui(scene as THREE.Scene)

    const initLight = () => {
      if (!scene) {
        console.error('Cena não encontrada.')
        return
      }

      spotLight = new THREE.SpotLight(
        props.color,
        props.intensity,
        props.distance,
        props.angle,
        props.penumbra,
        props.decay,
      )
      spotLight.position.set(
        props.position.x,
        props.position.y,
        props.position.z,
      )

      scene.add(spotLight)

      addControl(spotLight, 'Spot Light Controls')

      addLight(spotLight, 'Spot Light Props', {
        lightColor: '0xffffff',
      })

      if (render) render()
    }

    const updateLight = () => {
      if (spotLight) {
        spotLight.color.set(props.color)
        spotLight.intensity = props.intensity
        spotLight.distance = props.distance
        spotLight.angle = props.angle
        spotLight.penumbra = props.penumbra
        spotLight.decay = props.decay
        spotLight.position.set(
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
    watch(() => props.angle, updateLight)
    watch(() => props.penumbra, updateLight)
    watch(() => props.decay, updateLight)
    watch(() => props.position, updateLight, { deep: true })

    return {}
  },
})
