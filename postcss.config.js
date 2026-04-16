module.exports = {
	plugins: {
		autoprefixer: {},
		"postcss-px-to-viewport": {
			viewportWidth: 375,
			viewportUnit: "vw",
			fontViewportUnit: "vw",
			unitPrecision: 5,
			propList: ["*"],
			exclude: [/node_modules/],
		},
	},
};
