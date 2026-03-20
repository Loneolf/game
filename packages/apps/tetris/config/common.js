const path = require("path");
const { DefinePlugin, CopyRspackPlugin } = require("@rspack/core");

module.exports = {
	entry: {
		app: "./src/app.ts",
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
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
			patterns: [
				{
					from: path.resolve(__dirname, "../src/mp3"),
					to: path.resolve(__dirname, "../dist/mp3"),
				},
				{
					from: path.resolve(__dirname, "../src/assets/ico"),
					to: path.resolve(__dirname, "../dist/assets/ico"),
				},
			],
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
			"@": path.resolve(__dirname, "../src"),
			"@u": path.resolve(__dirname, "../src/util"),
		},
	},
};
