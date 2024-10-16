import { defineComponent, inject, onMounted, onUnmounted } from 'vue-demi'
import * as THREE from 'three'

export default defineComponent({
  name: 'ThreeRaycaster',
  emits: ['object-selected', 'object-dragged', 'object-released'],
  setup(_, { emit }) {
    const scene = inject<THREE.Scene>('scene')
    const camera = inject<THREE.PerspectiveCamera>('camera')
    const renderer = inject<THREE.WebGLRenderer>('renderer')

    if (!scene || !camera || !renderer) {
      console.error(
        'ThreeRaycaster: Falta uma das injeções necessárias (scene, camera, renderer).',
      )
      return
    }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    let selectedObject: THREE.Object3D | null = null
    const offset = new THREE.Vector3()
    const intersectionPlane = new THREE.Plane()

    const onMouseDown = (event: MouseEvent) => {
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // Detectar interseção com os objetos na cena
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        selectedObject = intersects[0].object

        intersectionPlane.setFromNormalAndCoplanarPoint(
          camera.getWorldDirection(new THREE.Vector3()),
          selectedObject.position,
        )

        const intersectionPoint = new THREE.Vector3()
        raycaster.ray.intersectPlane(intersectionPlane, intersectionPoint)
        offset.copy(intersectionPoint).sub(selectedObject.position)

        // Emitir evento de seleção
        emit('object-selected', selectedObject)
      }
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!selectedObject) return

      // Normalizar as coordenadas do mouse
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      // Atualizar a posição do objeto
      const intersectionPoint = new THREE.Vector3()
      raycaster.ray.intersectPlane(intersectionPlane, intersectionPoint)
      selectedObject.position.copy(intersectionPoint.sub(offset))

      // Emitir evento de arraste
      emit('object-dragged', selectedObject)
    }

    const onMouseUp = () => {
      if (selectedObject) {
        emit('object-released', selectedObject)
        selectedObject = null
      }
    }

    onMounted(() => {
      window.addEventListener('mousedown', onMouseDown)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    })

    onUnmounted(() => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    })

    return {}
  },
})
