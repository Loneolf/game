const path = require("path");
const { createConfig } = require("../../config");

module.exports = createConfig(__dirname, {
	port: 3002,
});
