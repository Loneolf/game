const path = require('path');

const rspack = require('@rspack/core');

module.exports = {
	output: {
		path: path.resolve(process.cwd(), './dist'),
		clean: true,
		filename: 'components/[name].js',
		chunkFilename: 'components/[name].chunk.js',
		assetModuleFilename: 'components/[name][ext]',
		library: {
			type: 'umd',
			name: 'GameComponents',
		},
		globalObject: 'typeof self !== \'undefined\' ? self : this',
	},
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new rspack.CssExtractRspackPlugin({
			filename: 'components/[name].css',
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
	},
};
