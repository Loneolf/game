const { CssExtractRspackPlugin } = require("@rspack/core");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "production",
	devtool: "source-map",
	output: {
		filename: "[name]_bounder_[contenthash:10].js",
	},
	plugins: [
		new HTMLWebpackPlugin({
			inject: "body",
			template: "./src/index.html",
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
