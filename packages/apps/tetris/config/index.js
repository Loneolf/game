const { merge } = require("webpack-merge");

const commonConfig = require("./common");
const devConfig = require("./dev");
const prodConfig = require("./prod");

module.exports = () => {
	const env = process.env.NODE_ENV || "development";

	switch (env) {
		case "development":
			return merge(commonConfig, devConfig);
		case "production":
			return merge(commonConfig, prodConfig);
		default:
			return new Error(`No matching configuration found for environment: ${env}`);
	}
};
