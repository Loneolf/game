const path = require("path");
const { DefinePlugin, CopyRspackPlugin } = require("@rspack/core");

/**
 * 创建公共配置
 * @param {string} projectRoot - 项目根目录绝对路径
 * @param {Object} options - 可选配置
 * @param {string} options.entry - 入口文件路径，默认为 './src/app.ts'
 * @param {Array<{from: string, to: string}>} options.copyPatterns - 需要复制的文件模式
 * @returns {Object} Rspack公共配置
 */
function createCommonConfig(projectRoot, options = {}) {
	const { entry = "./src/app.ts", copyPatterns = [] } = options;

	// 默认复制mp3和ico资源
	const defaultPatterns = [
		{
			from: path.resolve(projectRoot, "./src/mp3"),
			to: path.resolve(projectRoot, "./dist/mp3"),
		},
		{
			from: path.resolve(projectRoot, "./src/assets/ico"),
			to: path.resolve(projectRoot, "./dist/assets/ico"),
		},
	];

	const patterns = copyPatterns.length > 0 ? copyPatterns : defaultPatterns;

	return {
		entry: {
			app: entry,
		},
		output: {
			path: path.resolve(projectRoot, "./dist"),
			clean: true,
			environment: {
				arrowFunction: false,
				const: false,
			},
		},
		plugins: [
			new DefinePlugin({
				ENV: JSON.stringify(process.env.NODE_ENV),
				process: JSON.stringify(process.env),
			}),
			new CopyRspackPlugin({
				patterns: patterns,
			}),
		],
		module: {
			rules: [
				{
					test: /\.ts$/,
					use: [
						{
							loader: "builtin:swc-loader",
							options: {
								jsc: {
									target: "es5",
									parser: {
										syntax: "typescript",
									},
								},
							},
						},
					],
					exclude: /node_modules/,
				},
				{
					test: /\.png$/,
					type: "asset/resource",
					generator: {
						filename: "images/[name]_[contenthash][ext]",
					},
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
			alias: {
				"@": path.resolve(projectRoot, "./src"),
				"@u": path.resolve(projectRoot, "./src/util"),
			},
		},
	};
}

module.exports = { createCommonConfig };
