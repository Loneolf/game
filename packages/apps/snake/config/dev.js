const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	devtool: "cheap-module-source-map",
	output: {
		filename: "[name]_bounder.js",
	},
	plugins: [
		new HTMLWebpackPlugin({
			inject: "body",
			template: "./src/index.html",
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
		static: path.resolve(__dirname, "../dist"),
		compress: true,
		port: 3000,
	},
};
