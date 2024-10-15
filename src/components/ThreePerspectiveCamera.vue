<script lang="ts">
import { defineComponent, inject, onMounted, watch, type Ref } from 'vue-demi'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeCamera',
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
    const widthScene = inject<Ref<number, number>>('widthScene')
    const heightScene = inject<Ref<number, number>>('heightScene')

    const scene = inject<THREE.Scene>('scene')
    const setCamera =
      inject<(camera: THREE.PerspectiveCamera) => void>('setCamera')

    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      props.fov,
      props.aspect ?? (Number(widthScene?.value) / Number(heightScene?.value)),
      props.near,
      props.far,
    )
    camera.position.set(0, 0, 5);


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
    }

    const updateCameraAspect = () => {
      if (camera) {
        camera.aspect = props.aspect
        camera.updateProjectionMatrix()
      }
    }

    onMounted(() => {
      initCamera()
    })

    watch(() => props.aspect, updateCameraAspect)

    watch(
      () => props.position,
      newPosition => {
        camera.position.set(newPosition.x, newPosition.y, newPosition.z)
        camera.updateProjectionMatrix()
      },
    )

    return {
      camera,
    }
  },
})
</script>

<template>
  <div v-if="false"></div>
</template>
