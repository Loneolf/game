const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

/**
 * 创建开发环境配置
 * @param {string} projectRoot - 项目根目录绝对路径
 * @param {Object} options - 可选配置
 * @param {number} options.port - 开发服务器端口，默认3000
 * @param {string} options.template - HTML模板路径，默认 './src/index.html'
 * @returns {Object} Rspack开发环境配置
 */
function createDevConfig(projectRoot, options = {}) {
	const { port = 3000, template = "./src/index.html" } = options;

	return {
		mode: "development",
		devtool: "cheap-module-source-map",
		output: {
			filename: "[name]_bounder.js",
		},
		plugins: [
			new HTMLWebpackPlugin({
				inject: "body",
				template: template,
				minify: false,
			}),
		],
		module: {
			rules: [
				{
					test: /\.(css|scss)$/,
					use: [
						"style-loader",
						"css-loader",
						"postcss-loader",
						"sass-loader",
					],
					type: "javascript/auto",
				},
			],
		},
		devServer: {
			client: {
				overlay: false,
			},
			static: path.resolve(projectRoot, "./dist"),
			compress: true,
			port: port,
		},
	};
}

module.exports = { createDevConfig };
