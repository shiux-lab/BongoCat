import { listen } from "@tauri-apps/api/event";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type MouseButtonValue = "Left" | "Right" | "Middle";

type MouseButtonEvent = {
	kind: "MousePress" | "MouseRelease";
	value: MouseButtonValue;
};

type MouseMoveValue = {
	x: number;
	y: number;
};

type MouseMoveEvent = {
	kind: "MouseMove";
	value: MouseMoveValue;
};

type KeyboardEvent = {
	kind: "KeyboardPress" | "KeyboardRelease";
	value: string;
};

type DeviceEvent = MouseButtonEvent | MouseMoveEvent | KeyboardEvent;

type Setter<T> = Dispatch<SetStateAction<T[]>>;

export const useDevice = () => {
	const [pressedMouses, setPressedMouses] = useState<MouseButtonValue[]>([]);
	const [mousePosition, setMousePosition] = useState<MouseMoveValue>();
	const [pressedKeys, setPressedKeys] = useState<string[]>([]);

	useEffect(() => {
		listen<DeviceEvent>("change", ({ payload }) => {
			const { kind, value } = payload;

			switch (kind) {
				case "MousePress":
					return handlePress(setPressedMouses, value);
				case "MouseRelease":
					return handleRelease(setPressedMouses, value);
				case "MouseMove":
					return setMousePosition(value);
				case "KeyboardPress":
					return handlePress(setPressedKeys, value);
				case "KeyboardRelease":
					return handleRelease(setPressedKeys, value);
			}
		});
	}, []);

	const handlePress = <T>(setter: Setter<T>, value: T) => {
		setter((prev) => [...new Set([...prev, value])]);
	};

	const handleRelease = <T>(setter: Setter<T>, value: T) => {
		setter((prev) => prev.filter((item) => item !== value));
	};

	return {
		pressedMouses,
		pressedKeys,
		mousePosition,
	};
};
