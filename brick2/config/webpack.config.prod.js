const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpakPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	output: {
		path: path.resolve(__dirname, "../dist"),
		clean: true,
		filename: "js/[name]_[contenthash:10].js",
		chunkFilename: "js/[name].chunk.js",
		assetModuleFilename: "asset/[name]_[contenthash:10][ext]", // images/test.png
	},
	mode: "production", // development | production
	devtool: "source-map",
	plugins: [
		new MiniCssExtractPlugin({
			// 默认生成main.css
			filename: "style/[name]_[contenthash].css", // 生成的文件放在dest/style目录下，文件名为hash值
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "./src/mp3"),
					to: path.resolve(__dirname, "./dist/mp3"),
				},
				{
					from: path.resolve(__dirname, "../public"),
					to: path.resolve(__dirname, "../dist"),
					globOptions: {
						// 忽略index.html文件
						ignore: ["**/index.html"],
					},
				}
			],
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"postcss-loader",
					"sass-loader",
				],
			},
		],
	},
	optimization: {
		minimizer: [new CssMinimizerWebpakPlugin(), new TerserPlugin()],
	},
};
