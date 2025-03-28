<script setup lang="ts">
import { LogicalSize } from '@tauri-apps/api/dpi'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { Live2DModel } from 'pixi-live2d-display'
import { Ticker } from 'pixi.js'
import { ref, useTemplateRef, watch, watchEffect } from 'vue'
import { useDevice } from '../composables/useDevice'
import { useModel } from '../composables/useModel'

Live2DModel.registerTicker(Ticker)

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvasRef')
const mode = ref('standard')
const { pressedKeys, pressedMouses, mousePosition } = useDevice()
const { model, loadModel, setParameterValue } = useModel()

watch([mode, canvasRef], (value) => {
  const [mode, canvas] = value

  if (!canvas) return

  loadModel({
    view: canvas,
    url: `/models/${mode}/cat.model3.json`,
  })
}, { immediate: true })

watchEffect(() => {
  if (!model.value) return

  handleResized()

  window.removeEventListener('resize', handleResized)
  window.addEventListener('resize', handleResized)
})

watchEffect(() => {
  const hasArrowKey = pressedKeys.value.some(key => key.endsWith('Arrow'))
  const hasNonArrowKey = pressedKeys.value.some(key => !key.endsWith('Arrow'))

  setParameterValue('CatParamRightHandDown', hasArrowKey)
  setParameterValue('CatParamLeftHandDown', hasNonArrowKey)
})

watchEffect(() => {
  const isLeftDown = pressedMouses.value.includes('Left')
  const isRightDown = pressedMouses.value.includes('Right')

  setParameterValue('ParamMouseLeftDown', isLeftDown)
  setParameterValue('ParamMouseRightDown', isRightDown)
})

watchEffect(() => {
  if (!mousePosition.value) return

  const { innerWidth, innerHeight } = window

  const x = -30 + (mousePosition.value.x / innerWidth) * 15
  const y = -30 + (mousePosition.value.y / innerHeight) * 15

  setParameterValue('ParamMouseX', -x)
  setParameterValue('ParamMouseY', -y)
  setParameterValue('ParamAngleX', x)
  setParameterValue('ParamAngleY', -y)
})

async function handleResized() {
  if (!model.value) return

  const { innerWidth } = window

  await getCurrentWebviewWindow().setSize(
    new LogicalSize({
      width: innerWidth,
      height: innerWidth * (354 / 612),
    }),
  )

  model.value.scale.set(innerWidth / 612)
}

function handleMouseDown() {
  const appWindow = getCurrentWebviewWindow()

  appWindow.startDragging()
}
</script>

<template>
  <div
    class="relative children:(absolute h-screen w-screen)"
    @mousedown="handleMouseDown"
  >
    <img :src="`/images/backgrounds/${mode}.png`">

    <canvas ref="canvasRef" />

    <template v-for="item in pressedKeys" :key="item">
      <img :src="`/images/keys/${item}.png`">
      <img :src="`/images/hands/${item}.png`">
    </template>
  </div>
</template>
