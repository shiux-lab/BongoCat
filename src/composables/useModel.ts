import type { IApplicationOptions } from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display'
import { Application } from 'pixi.js'
import { ref } from 'vue'

interface Options extends IApplicationOptions {
  url: string
}

interface Motion {
  Name: string
  File: string
  Sound?: string
  FadeInTime: number
  FadeOutTime: number
}

interface Expression {
  Name: string
  File: string
}

export function useModel() {
  const model = ref<Live2DModel>()
  const motions = ref<Record<string, Motion[]>>({})
  const expressions = ref<Expression[]>([])

  const loadModel = async (options: Options) => {
    const { url, ...rest } = options

    destroyModel()

    const app = new Application({
      resizeTo: window,
      backgroundAlpha: 0,
      ...rest,
    })

    const loadedModel = await Live2DModel.from(url)

    app.stage.addChild(loadedModel)

    const { definitions, expressionManager }
      = loadedModel.internalModel.motionManager

    model.value = loadedModel
    motions.value = definitions as Record<string, Motion[]>
    expressions.value = expressionManager?.definitions as Expression[]
  }

  const destroyModel = () => {
    model.value?.destroy()
  }

  const setParameterValue = (id: string, value: number | boolean) => {
    return model.value?.internalModel.coreModel.setParameterValueById(id, Number(value))
  }

  return {
    model,
    motions,
    expressions,
    loadModel,
    destroyModel,
    setParameterValue,
  }
}
