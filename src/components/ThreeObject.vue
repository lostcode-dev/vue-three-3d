<template>
  <div v-if="false"></div>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  onMounted,
  watch,
  onUnmounted,
} from 'vue-demi'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeObject',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['box', 'sphere'].includes(value),
    },
    position: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 0, z: 0 }),
    },
    rotation: {
      type: Object as () => { x: number; y: number; z: number },
      default: () => ({ x: 0, y: 0, z: 0 }),
    },
    color: {
      type: String,
      default: '#00ff00',
    },
  },
  setup(props) {
    const scene = inject<THREE.Scene>('scene')
    const render = inject<() => void>('render')

    let object: THREE.Mesh | null = null

    const createObject = () => {
      if (!scene) {
        console.error(
          'Cena não encontrada. Certifique-se de que o ThreeObject está dentro de um ThreeScene.',
        )
        return
      }

      let geometry: THREE.BufferGeometry
      const material = new THREE.MeshBasicMaterial({ color: props.color })

      if (props.type === 'box') {
        geometry = new THREE.BoxGeometry()
      } else if (props.type === 'sphere') {
        geometry = new THREE.SphereGeometry(1, 32, 32)
      } else {
        console.error('Tipo de objeto desconhecido:', props.type)
        return
      }

      object = new THREE.Mesh(geometry, material)

      object.position.set(props.position.x, props.position.y, props.position.z)
      object.rotation.set(props.rotation.x, props.rotation.y, props.rotation.z)
      console.log('b scene', scene)
      scene.add(object)
      console.log('a scene', scene)
      render()
    }

    const updateObjectPosition = () => {
      if (object) {
        object.position.set(
          props.position.x,
          props.position.y,
          props.position.z,
        )
      }
    }

    const updateObjectRotation = () => {
      if (object) {
        object.rotation.set(
          props.rotation.x,
          props.rotation.y,
          props.rotation.z,
        )
      }
    }

    onMounted(() => {
      createObject()
    })

    watch(() => props.position, updateObjectPosition)
    watch(() => props.rotation, updateObjectRotation)

    onUnmounted(() => {
      if (object && scene) {
        scene.remove(object)
      }
    })

    return {}
  },
})
</script>
