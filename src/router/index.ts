import { createHashRouter } from "react-router-dom";
import Main from "../pages/Main";
import Preference from "../pages/Preference";

export const router = createHashRouter([
	{
		path: "/",
		Component: Main,
	},
	{
		path: "/preference",
		Component: Preference,
	},
]);
