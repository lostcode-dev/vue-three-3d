import { defineComponent, inject, onMounted, watch } from 'vue-demi'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeGround',
  props: {
    width: {
      type: Number,
      default: 10,
    },
    height: {
      type: Number,
      default: 10,
    },
    color: {
      type: String,
      default: '#808080',
    },
    position: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 0, z: 0 }),
    },
    rotation: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: -Math.PI / 2, y: 0, z: 0 }),
    },
  },
  setup(props) {
    const animateScene = inject<boolean>('animateScene')
    const scene = inject<THREE.Scene>('scene')
    const render = inject<() => void>('render')
    let ground: THREE.Mesh | null = null

    const initGround = () => {
      if (!scene) {
        console.error('Cena não encontrada.')
        return
      }

      const geometry = new THREE.PlaneGeometry(props.width, props.height)
      const material = new THREE.MeshStandardMaterial({ color: props.color })

      ground = new THREE.Mesh(geometry, material)
      ground.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
      ground.position.set(props.position.x, props.position.y, props.position.z)

      ground.receiveShadow = true

      scene.add(ground)

      if (render) render()
    }

    const updateGround = () => {
      if (ground) {
        ground.position.set(
          props.position.x,
          props.position.y,
          props.position.z,
        )
        ground.rotation.set(
          props.rotation.x,
          props.rotation.y,
          props.rotation.z,
        )
        if (animateScene) return
        if (render) render()
      }
    }

    onMounted(() => {
      initGround()
    })

    watch(() => props.position, updateGround, { deep: true })
    watch(() => props.rotation, updateGround, { deep: true })
    watch(() => props.width, updateGround)
    watch(() => props.height, updateGround)

    return {}
  },
})
