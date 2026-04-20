import rspack from "@rspack/core";
import { merge } from "webpack-merge";

import common from "./rspack.config.common.js";
import components from "./rspack.config.components.js";
import development from "./rspack.config.dev.js";
import production from "./rspack.config.prod.js";

function filterHtmlRspackPlugin(config) {
	if (!config.plugins) return config;
	config.plugins = config.plugins.filter(plugin => {
		return !(plugin instanceof rspack.HtmlRspackPlugin);
	});
	return config;
}

export default {
	common,
	development,
	production,
	components,
	filterHtmlRspackPlugin,

	"rspack.config.dev": merge(common, development),
	"rspack.config.prod": merge(common, production),
	"rspack.config.components": merge(common, components),
};
