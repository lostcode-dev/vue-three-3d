import {
  defineComponent,
  inject,
  onMounted,
  onUnmounted,
  watch,
  type Ref,
} from 'vue-demi'
import * as THREE from 'three'
import { useGui } from '@/composables/useGui'

export default defineComponent({
  name: 'ThreePerspectiveCamera',
  props: {
    fov: {
      type: Number,
      default: 75,
    },
    aspect: {
      type: Number,
      default: 0,
    },
    near: {
      type: Number,
      default: 0.1,
    },
    far: {
      type: Number,
      default: 1000,
    },
    position: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 0, z: 5 }),
    },
  },
  emits: ['camera-created'],
  setup(props, { emit }) {
    const animateScene = inject<boolean>('animateScene')
    const widthScene = inject<Ref<number, number>>('widthScene')
    const heightScene = inject<Ref<number, number>>('heightScene')
    const render = inject<() => void>('render')

    const scene = inject<THREE.Scene>('scene')
    const setCamera =
      inject<(camera: THREE.PerspectiveCamera) => void>('setCamera')

    const { addControl } = useGui(scene as THREE.Scene)

    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      props.fov,
      props.aspect ?? Number(widthScene?.value) / Number(heightScene?.value),
      props.near,
      props.far,
    )

    const initCamera = () => {
      if (!scene || !setCamera) {
        console.error(
          'Scene or setCamera function not provided. Check the order of the components.',
        )
        return
      }

      camera.position.set(props.position.x, props.position.y, props.position.z)
      emit('camera-created', camera)
      setCamera(camera)

      addControl(camera, 'Camera Controls')

      if (render) render()
    }

    function reload() {
      if (animateScene) return

      camera.updateProjectionMatrix()
      if (render) render()
    }

    onMounted(() => {
      initCamera()
    })

    onUnmounted(() => {
      if (camera && scene) {
        scene.remove(camera)
        if (render) render()
      }
    })

    watch(
      () => props.aspect,
      newAspect => {
        camera.aspect = newAspect
        reload()
      },
    )

    watch(
      () => props.near,
      newNear => {
        camera.near = newNear
        reload()
      },
    )

    watch(
      () => props.far,
      newFar => {
        camera.far = newFar
        reload()
      },
    )

    watch(
      () => props.position,
      newPosition => {
        camera.position.set(newPosition.x, newPosition.y, newPosition.z)
        reload()
      },
    )

    watch(
      () => props.fov,
      newFov => {
        camera.fov = newFov
        reload()
      },
    )

    return
  },
})
