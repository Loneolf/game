const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { DefinePlugin } = require('webpack')

module.exports = {
	entry: "./src/app.ts",
	plugins: [
		new HTMLWebpackPlugin({
			template: path.resolve(__dirname, "../public/index.html"), // 以该文件为模板生成HTML
		}),
		new ESLintPlugin({
			context: path.resolve(__dirname, "../src"),
			exclude: "node_modules",
			cache: true,
			cacheLocation: path.resolve(__dirname,"../node_modules/.cache/.eslintcache"),
		}),
		new DefinePlugin({
			ENV: JSON.stringify(process.env.NODE_ENV),
			process: JSON.stringify(process.env),

		}),
	],
	module: {
		rules: [
			{
				test: /\.(jp?eg|png|svg|webp|gif)$/, // 用正则匹配以jpg为结尾的资源
				type: "asset",
				// asset 自动根据文件大小生成资源或者base64的url，默认值为8K 4*1024
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, //
					},
				},
			},
			{
				test: /\.(woff|woff2|ttf|otf|eot|txt)$/,
				type: "asset/resource",
			},
			{
				test: /\.ts$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/preset-env",
									{
										targets: ["last 1 version", "> 1%"],
										useBuiltIns: "usage",
										corejs: 3,
									},
								],
							],
						},
					},
					"ts-loader",
				],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json"], // 自动补全文件扩展名，让tsx可以使用
		alias: {
			'@': path.resolve(__dirname, '../src'),
		},
	},
	optimization: {
		splitChunks: {
			chunks: "all",
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}`,
		},
	},
};
