import path from "path";

import { DefinePlugin } from "@rspack/core";

export default {
	entry: {
		app: "./src/app.ts",
	},
	output: {
		environment: {
			arrowFunction: false,
			const: false,
			destructuring: false,
			forOf: false,
		}
	},
	plugins: [
		new DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
		}),
	],
	module: {
		rules: [
			{
				test: /\.(jp?eg|png|svg|webp|gif)$/,
				type: "asset",
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024,
					},
				},
			},
			{
				test: /\.(woff|woff2|ttf|otf|eot|txt)$/,
				type: "asset/resource",
			},
			{
				test: /\.(js|mjs|cjs|ts)$/,
				exclude: /node_modules[\\/]core-js/,
				use: {
					loader: "builtin:swc-loader",
					options: {
						env: {
							mode: "usage",
							coreJs: "3.26.1",
							targets: [
								"Android >= 6",
								"iOS >= 9",
								"not dead",
							],
						},
						jsc: {
							parser: {
								syntax: "typescript",
							},
						},
						isModule: "unknown",
					},
				},
			},
		],
	},
	resolve: {
		extensions: [".js", ".ts", ".json"],
		alias: {
			"@": path.resolve(process.cwd(), "./src"),
			"@u": path.resolve(process.cwd(), "./src/util"),
			"@sa": path.resolve(process.cwd(), "./src/assets"),
			"@c": path.resolve(process.cwd(), "./src/commponet"),
		},
	},
};
