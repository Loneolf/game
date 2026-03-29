const fs = require('fs');
const path = require('path');

const rspack = require('@rspack/core');

module.exports = {
	output: {
		path: path.resolve(process.cwd(), './dist'),
		clean: {
			keep: 'components',
		},
		filename: 'js/[name].js',
		chunkFilename: 'js/[name].chunk.js',
		assetModuleFilename: 'asset/[name][ext]',
	},
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new rspack.HtmlRspackPlugin({
			template: path.resolve(process.cwd(), './src/index.html'),
			inject: 'body',
		}),
		new rspack.CssExtractRspackPlugin({
			filename: 'style/[name].css',
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|scss|sass)$/,
				use: [
					rspack.CssExtractRspackPlugin.loader,
					'css-loader',
					'postcss-loader',
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								silenceDeprecations: ['import'],
							},
						}
					}
				],
				type: 'javascript/auto',
			},
		]
	},
	optimization: {
		minimizer: [
			new rspack.SwcJsMinimizerRspackPlugin({
				minimizerOptions: {
					format: {
						comments: false,
					},
					mangle: false,
				},
				sourceMap: true,
				extractComments: false,
			}),
		],
		splitChunks: {
			chunks: 'all',
			cacheGroups: {
				libs: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors-chunk',
					priority: 20,
				},
			},
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime~${entrypoint.name}`,
		},
		removeEmptyChunks: false,
		chunkIds: 'named',
		usedExports: true,
	},
};
