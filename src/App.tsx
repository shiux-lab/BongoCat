import { listen } from "@tauri-apps/api/event";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { LISTEN_KEY } from "./constants";
import { hideWindow, showWindow } from "./plugins/window";
import { router } from "./router";

const App = () => {
	useEffect(() => {
		const appWindow = getCurrentWebviewWindow();

		listen(LISTEN_KEY.SHOW_WINDOW, ({ payload }) => {
			if (appWindow.label !== payload) return;

			showWindow();
		});

		listen(LISTEN_KEY.HIDE_WINDOW, ({ payload }) => {
			if (appWindow.label !== payload) return;

			hideWindow();
		});
	}, []);

	return <RouterProvider router={router} />;
};

export default App;
