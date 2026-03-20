const { merge } = require("webpack-merge");
const { createCommonConfig } = require("./common");
const { createDevConfig } = require("./dev");
const { createProdConfig } = require("./prod");

/**
 * 创建Rspack配置
 * @param {string} projectRoot - 项目根目录绝对路径
 * @param {Object} options - 配置选项
 * @param {string} options.entry - 入口文件路径
 * @param {number} options.port - 开发服务器端口
 * @param {string} options.template - HTML模板路径
 * @param {Array<{from: string, to: string}>} options.copyPatterns - 需要复制的文件模式
 * @returns {Object} 合并后的Rspack配置
 */
function createConfig(projectRoot, options = {}) {
	const env = process.env.NODE_ENV || "development";
	const commonConfig = createCommonConfig(projectRoot, options);

	switch (env) {
		case "development":
			const devConfig = createDevConfig(projectRoot, options);
			return merge(commonConfig, devConfig);
		case "production":
			const prodConfig = createProdConfig(projectRoot, options);
			return merge(commonConfig, prodConfig);
		default:
			throw new Error(`No matching configuration found for environment: ${env}`);
	}
}

module.exports = { createConfig, createCommonConfig, createDevConfig, createProdConfig };
