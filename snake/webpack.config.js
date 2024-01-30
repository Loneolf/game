const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require('webpack')

module.exports = () => {
	return {
		entry: {
			app: "./src/app.ts",
		},
		output: {
			path: path.resolve(__dirname, "./dist"),
			clean: true,
			filename: "[name]_bounder.js",
			// 不使用箭头函数和const
			environment: {
				arrowFunction: false,
				const: false,
			},
		},
		devtool: "cheap-module-source-map",
		mode: process.env.NODE_ENV, // development / production
		plugins: [
			new HTMLWebpackPlugin({
				inject: "body",
				template: "./src/index.html",
			}),
			new CopyPlugin({
				patterns: [
					{
						from: path.resolve(__dirname, "./src/mp3"),
						to: path.resolve(__dirname, "./dist/mp3"),
					},
					{
						from: path.resolve(__dirname, "./src/assets/ico"),
						to: path.resolve(__dirname, "./dist/assets/ico"),
					}
				],
			}),
			new DefinePlugin({
				ENV: JSON.stringify(process.env.NODE_ENV),
				process: JSON.stringify(process.env),

			}),
		],
		devServer: {
			client: {
				overlay: false,
			},
			static: path.resolve(__dirname, "./dist"),
			compress: true,
			port: 3000,
		},
		module: {
			rules: [
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
											// targets:{
											// 	"chrome":"58",
											// 	"ie":"11"
											// },
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
				{
					test: /\.png$/, // 用正则匹配以png为结尾的资源
					type: "asset/resource",
					// asset/resource, 打包资源文件，输出对应文件
					generator: {
						filename: "images/[name]_[contenthash][ext]",
					},
					// 优先级高于output中的assetModuleFilename
				},
				{
					test: /\.(css|scss)$/,
					use: [
						"style-loader",
						"css-loader",
						"postcss-loader",
						"sass-loader",
					],
				},
			],
		},
		resolve: {
			extensions: [".ts", ".js"],
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@u": path.resolve(__dirname, "./src/util"),
			},
		},
	};
};
