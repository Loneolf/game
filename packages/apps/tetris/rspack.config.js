const { merge } = require("webpack-merge");
const { common, development, production } = require("../../config");

const env = process.env.NODE_ENV || "development";

if (env === "development") {
	module.exports = merge(common, development);
} else {
	module.exports = merge(common, production);
}
