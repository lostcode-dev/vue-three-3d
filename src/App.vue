<template>
  <div>
    <ThreeScene backgroundColor="#123456">
      <ThreeObject
        type="box"
        :position="{ x: 0, y: 0, z: 0 }"
        :rotation="{ x: 0, y: 0, z: 0 }"
        color="#ff0000"
      />
      <ThreePerspectiveCamera />
    </ThreeScene>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import ThreeScene from './components/ThreeScene.vue'
import ThreeObject from './components/ThreeObject.vue'
import ThreePerspectiveCamera from './components/ThreePerspectiveCamera.vue'

export default defineComponent({
  name: 'App',
  components: {
    ThreeScene,
    ThreeObject,
    ThreePerspectiveCamera
  },
})
</script>



<style scoped>
div {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
