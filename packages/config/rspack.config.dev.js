const fs = require("fs");
const path = require("path");

const rspack = require("@rspack/core");
const ESLintPlugin = require("eslint-webpack-plugin");


module.exports = {
	output: {
		path: undefined,
		filename: "js/[name].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "[name]_[hash:10].[ext]",
	},
	mode: "development",
	devtool: "source-map",
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: path.resolve(process.cwd(), "./src/index.html"),
			inject: "body",
		}),
		new ESLintPlugin({
			extensions: ["js", "ts"],
			exclude: ["node_modules"],
			fix: process.env.NODE_ENV === "development",
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|scss|sass)$/,
				use: [
					"style-loader",
					"css-loader",
					"postcss-loader",
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								silenceDeprecations: ["import"],
							},
						}
					}
				],
				type: "javascript/auto",
			},
		],
	},
	devServer: {
		client: {
			overlay: false,
		},
		compress: true,
		host: "0.0.0.0",
		port: "auto",
		open: false,
		hot: true,
		historyApiFallback: true,
		static: {
			directory: path.resolve(__dirname, "../../public"),
			publicPath: "/",
		},
	},
};
