import qConfig from "@qgame/config";
import { merge } from "webpack-merge";

const { common, development, production } = qConfig;


const env = process.env.NODE_ENV || "development";

let config;

console.log('snake env:', env);

if (env === "development") {
	config = merge(common, development);
} else {
	config = merge(common, production);
}

export default config;