module.exports = {
	plugins: {
		autoprefixer: {},
		"postcss-pxtorem": {
			rootValue: 100,
			propList: ["*"],
			mediaQuery: true,
			// 排除特定选择器
			selectorBlackList: ["noRem"],
			exclude: [/node_modules/],
		},
	},
};
