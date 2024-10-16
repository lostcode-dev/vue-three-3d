import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  provide,
  watch,
  h,
} from 'vue-demi'
import * as THREE from 'three'
import { useElementSize } from '@vueuse/core'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { clearGui, initGui, useGui } from '@/composables/useGui'

export default defineComponent({
  name: 'ThreeScene',
  props: {
    backgroundColor: {
      type: String,
      required: false,
      default: '#000000',
    },
    animate: Boolean,
    gui: Boolean,
  },
  setup(props, { slots }) {
    const sceneContainer = ref<HTMLDivElement | null>(null)
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer()
    const { width: widthScene, height: heightScene } =
      useElementSize(sceneContainer)
    let animationFrameId: number | null = null
    let controls: OrbitControls | null = null

    let camera = new THREE.PerspectiveCamera(
      75,
      widthScene.value / heightScene.value,
      0.1,
      1000,
    )
    camera.position.set(0, 1, 5)

    const { addControl } = useGui(scene as THREE.Scene)

    const gui = props.gui ? initGui() : false

    provide('scene', scene)
    provide('animateScene', props.animate)
    provide('widthScene', widthScene)
    provide('heightScene', heightScene)

    provide('renderer', renderer)
    provide('render', render)

    provide('camera', camera)
    provide('setCamera', (cam: THREE.PerspectiveCamera) => {
      camera = cam
      controls = createControls()
      render()
    })

    provide('gui', gui)

    function render() {
      controls?.update()
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    function createControls() {
      const orbitControls = new OrbitControls(camera, renderer.domElement)
      orbitControls.enableDamping = true
      return orbitControls
    }

    const initScene = () => {
      renderer.setSize(widthScene.value, heightScene.value)
      renderer.setClearColor(props.backgroundColor)
      sceneContainer.value?.appendChild(renderer.domElement)

      controls = createControls()
      addControl(scene, 'Scene Controls')
      addControl(camera, 'Camera Controls')

      renderer.render(scene, camera)
    }

    onMounted(() => {
      initScene()
    })

    onUnmounted(() => {
      controls?.dispose()
      renderer.dispose()
    })

    const onResize = () => {
      camera.aspect = widthScene.value / heightScene.value
      camera.updateProjectionMatrix()
      renderer.setSize(widthScene.value, heightScene.value)
      renderer.render(scene, camera)
    }

    function reload() {
      camera.updateProjectionMatrix()
      if (render) render()
    }

    watch(() => [widthScene.value, heightScene.value], onResize)

    watch(
      () => props.backgroundColor,
      newBackgroundColor => {
        renderer.setClearColor(newBackgroundColor)
        reload()
      },
    )

    watch(
      () => props.animate,
      newAnimate => {
        if (newAnimate) {
          animate()
        } else if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
      },
    )

    watch(
      () => props.gui,
      newGui => {
        if (newGui) {
          initGui()
        } else {
          clearGui()
        }
      },
    )

    function animate() {
      if (props.animate) {
        controls?.update()
        animationFrameId = requestAnimationFrame(animate)
        camera.updateProjectionMatrix()
        renderer.render(scene, camera)
      }
    }

    animate()

    return () =>
      h(
        'div',
        {
          ref: sceneContainer,
          style: {
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: 'grab',
          },
          class: 'three-scene-container',
        },
        [
          slots.default
            ? slots.default({
                scene,
                width: widthScene,
                height: heightScene,
                aspect: widthScene.value / heightScene.value,
                renderer,
                camera,
              })
            : null,
        ],
      )
  },
})
