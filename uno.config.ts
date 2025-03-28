import presetRemToPx from "@unocss/preset-rem-to-px";
import {
	defineConfig,
	presetIcons,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	presets: [
		presetWind3(),
		presetIcons(),
		presetRemToPx({
			baseFontSize: 4,
		}),
	],
	transformers: [
		transformerVariantGroup(),
		transformerDirectives({
			applyVariable: ["--uno"],
		}),
	],
});
