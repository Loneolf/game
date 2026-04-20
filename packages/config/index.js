const rspack = require("@rspack/core");
const { merge } = require("webpack-merge");

const common = require("./rspack.config.common");
const components = require("./rspack.config.components");
const development = require("./rspack.config.dev");
const production = require("./rspack.config.prod");

function filterHtmlRspackPlugin(config) {
	if (!config.plugins) return config;
	config.plugins = config.plugins.filter(plugin => {
		return !(plugin instanceof rspack.HtmlRspackPlugin);
	});
	return config;
}

module.exports = {
	common,
	development,
	production,
	components,
	filterHtmlRspackPlugin,

	"rspack.config.dev": merge(common, development),
	"rspack.config.prod": merge(common, production),
	"rspack.config.components": merge(common, components),
};
