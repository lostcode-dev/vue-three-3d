<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  provide,
  watch
} from 'vue-demi'
import * as THREE from 'three'
import { useElementSize } from '@vueuse/core';

export default defineComponent({
  name: 'ThreeScene',
  props: {
    backgroundColor: {
      type: String,
      required: false,
      default: '#000000',
    },
  },
  setup(props) {
    const sceneContainer = ref<HTMLDivElement | null>(null)
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer()
    const { width: widthScene, height: heightScene } = useElementSize(sceneContainer)
    let camera = new THREE.PerspectiveCamera(75, widthScene.value / heightScene.value, 0.1, 1000) 
    camera.position.set(0, 0, 5);

    provide('scene', scene)
    provide('widthScene', widthScene)
    provide('heightScene', heightScene)

    provide('renderer', renderer)
    provide('render', render)

    provide('camera', camera)
    provide('setCamera', (cam: THREE.PerspectiveCamera) => {
      camera = cam
      render()
    })

    function render(){
      renderer.render(scene, camera)
    }

    const initScene = () => {
      renderer.setSize(widthScene.value, heightScene.value)
      renderer.setClearColor(props.backgroundColor)

      sceneContainer.value?.appendChild(renderer.domElement)

      renderer.render(scene, camera)

    }

    onMounted(() => {
      initScene()
    })

    onUnmounted(() => {
      renderer.dispose()
    })

    const onResize = () => {
      camera.aspect = widthScene.value / heightScene.value
      camera.updateProjectionMatrix()
      renderer.setSize(widthScene.value, heightScene.value)
      renderer.render(scene, camera)
    }

    watch(() => [widthScene.value, heightScene.value], onResize)

    return {
      sceneContainer,
    }
  },
})
</script>

<template>
  <div ref="sceneContainer" class="three-scene-container"><slot /></div>
</template>

<style scoped>
.three-scene-container {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
