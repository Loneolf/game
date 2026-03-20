module.exports = {
    plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport": {
            unitToConvert: "px",
            viewportWidth: 10000,
            unitPrecision: 5,
            propList: ["*"],
            viewportUnit: "rem",
            fontViewportUnit: "rem",
            replace: true,
            exclude: [/node_modules/],
        }
    }
};
