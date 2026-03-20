const { CssExtractRspackPlugin } = require("@rspack/core");
const HTMLWebpackPlugin = require("html-webpack-plugin");

/**
 * 创建生产环境配置
 * @param {string} projectRoot - 项目根目录绝对路径
 * @param {Object} options - 可选配置
 * @param {string} options.template - HTML模板路径，默认 './src/index.html'
 * @returns {Object} Rspack生产环境配置
 */
function createProdConfig(projectRoot, options = {}) {
	const { template = "./src/index.html" } = options;

	return {
		mode: "production",
		devtool: "source-map",
		output: {
			filename: "[name]_bounder_[contenthash:10].js",
		},
		plugins: [
			new HTMLWebpackPlugin({
				inject: "body",
				template: template,
				minify: {
					collapseWhitespace: true,
					removeComments: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					useShortDoctype: true,
					minifyCSS: true,
					minifyJS: true,
				},
			}),
			new CssExtractRspackPlugin({
				filename: "style/[name]_[contenthash].css",
			}),
		],
		module: {
			rules: [
				{
					test: /\.(css|scss)$/,
					use: [
						CssExtractRspackPlugin.loader,
						"css-loader",
						"postcss-loader",
						"sass-loader",
					],
					type: "javascript/auto",
				},
			],
		},
		optimization: {
			minimize: true,
		},
	};
}

module.exports = { createProdConfig };
