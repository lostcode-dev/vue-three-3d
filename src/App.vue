<template>
  <div>
    <ThreeScene gui animate backgroundColor="#123456">
      <!--
      <ThreeObject
        type="box"
        :position="{ x: 0, y: 0, z: 0 }"
        :rotation="{ x: 0, y: 0, z: 0 }"
        color="#ff0000"
      />
      -->
      <ThreeModel
        src="/lamborghini.glb"
        :scale="{ x: 1, y: 1, z: 1 }"
        :position="{ x: 0, y: 0, z: 0 }"
        :rotation="{ x: 0, y: 0, z: 0 }"
      />

      <ThreeAmbientLight color="#fff" :intensity="1" />
      <ThreeDirectionLight
        color="#fff"
        :intensity="3"
        :position="{ x: 1, y: 1, z: 1 }"
      />
      <ThreeGround
        :width="20"
        :height="20"
        color="#4CAF50"
        :position="{ x: 0, y: -0.1, z: 0 }"
      />
    </ThreeScene>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import ThreeScene from './components/ThreeScene'
import ThreePerspectiveCamera from './components/ThreePerspectiveCamera'
import ThreeDirectionLight from './components/light/ThreeDirectionLight'
import ThreeModel from './components/ThreeModel'
import ThreeAmbientLight from './components/light/ThreeAmbientLight'
import ThreeGround from './components/ThreeGround'

export default defineComponent({
  name: 'App',
  components: {
    ThreeScene,
    ThreePerspectiveCamera,
    ThreeDirectionLight,
    ThreeModel,
    ThreeAmbientLight,
    ThreeGround,
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
