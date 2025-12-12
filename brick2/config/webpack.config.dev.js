const path = require("path");

module.exports = {
	output: {
		path: path.resolve(__dirname, "../dist"),
		clean: true,
		filename: "js/[name].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "[name].[ext]", // images/test.png
	},
	mode: "development",
	devtool: "cheap-module-source-map",
	devServer: {
		client: {
			overlay: false,
		},
		static: path.resolve(__dirname, "./dist"),
		compress: true,
		port: 3002,
		// open: true,
		// hot: true,
		// historyApiFallback: true,
	},
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
			},
		],
	},
};
