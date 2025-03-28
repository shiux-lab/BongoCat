import { Live2DModel } from "pixi-live2d-display";
import { Application } from "pixi.js";
import { type RefObject, useCallback, useState } from "react";

interface Motion {
	Name: string;
	File: string;
	Sound?: string;
	FadeInTime: number;
	FadeOutTime: number;
}

interface Expression {
	Name: string;
	File: string;
}

export const useModel = (container: RefObject<HTMLCanvasElement>) => {
	const [model, setModel] = useState<Live2DModel>();
	const [motions, setMotions] = useState<Record<string, Motion[]>>({});
	const [expressions, setExpressions] = useState<Expression[]>([]);

	const loadModel = async (url: string) => {
		if (!container.current) return;

		destroyModel();

		const app = new Application({
			view: container.current,
			resizeTo: window,
			backgroundAlpha: 0,
		});

		const model = await Live2DModel.from(url);

		app.stage.addChild(model);

		const { definitions, expressionManager } =
			model.internalModel.motionManager;

		setModel(model);
		setMotions(definitions as Record<string, Motion[]>);
		setExpressions(expressionManager?.definitions as Expression[]);
	};

	const destroyModel = () => {
		model?.destroy();
	};

	const setParameterValue = useCallback(
		(id: string, value: number | boolean) => {
			return model?.internalModel.coreModel.setParameterValueById(
				id,
				Number(value),
			);
		},
		[model],
	);

	return {
		model,
		motions,
		expressions,
		loadModel,
		destroyModel,
		setParameterValue,
	};
};
