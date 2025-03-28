import { LogicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Live2DModel } from "pixi-live2d-display";
import { Ticker } from "pixi.js";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDevice } from "../../hooks/useDevice";
import { useModel } from "../../hooks/useModel";

Live2DModel.registerTicker(Ticker);

const Main = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [mode] = useState("standard");
	const { pressedKeys, pressedMouses, mousePosition } = useDevice();
	const { model, loadModel, setParameterValue } = useModel(canvasRef);

	useEffect(() => {
		loadModel(`/models/${mode}/cat.model3.json`);
	}, [mode]);

	useEffect(() => {
		if (!model) return;

		handleResized();

		window.removeEventListener("resize", handleResized);

		window.addEventListener("resize", handleResized);
	}, [model]);

	useEffect(() => {
		const hasArrowKey = pressedKeys.some((key) => key.endsWith("Arrow"));
		const hasNonArrowKey = pressedKeys.some((key) => !key.endsWith("Arrow"));

		setParameterValue("CatParamRightHandDown", hasArrowKey);
		setParameterValue("CatParamLeftHandDown", hasNonArrowKey);
	}, [pressedKeys]);

	useEffect(() => {
		const isLeftDown = pressedMouses.includes("Left");
		const isRightDown = pressedMouses.includes("Right");

		setParameterValue("ParamMouseLeftDown", isLeftDown);
		setParameterValue("ParamMouseRightDown", isRightDown);
	}, [pressedMouses]);

	useEffect(() => {
		if (!mousePosition) return;

		const { innerWidth, innerHeight } = window;

		const x = -30 + (mousePosition.x / innerWidth) * 60;
		const y = -30 + (mousePosition.y / innerHeight) * 60;

		setParameterValue("ParamMouseX", -x);
		setParameterValue("ParamMouseY", -y);
		setParameterValue("ParamAngleX", x);
		setParameterValue("ParamAngleY", -y);
	}, [mousePosition]);

	const handleResized = async () => {
		if (!model) return;

		const { innerWidth } = window;

		await getCurrentWebviewWindow().setSize(
			new LogicalSize({
				width: innerWidth,
				height: innerWidth * (354 / 612),
			}),
		);

		model.scale.set(innerWidth / 612);
	};

	const handleMouseDown = () => {
		const appWindow = getCurrentWebviewWindow();

		appWindow.startDragging();
	};

	return (
		<div
			className="children:absolute relative children:h-screen children:w-screen"
			onMouseDown={handleMouseDown}
		>
			<img src={`/images/backgrounds/${mode}.png`} />

			<canvas ref={canvasRef} />

			{pressedKeys.map((item) => (
				<Fragment key={item}>
					<img src={`/images/keys/${item}.png`} />
					<img src={`/images/hands/${item}.png`} />
				</Fragment>
			))}
		</div>
	);
};

export default Main;
