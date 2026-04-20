import "./style/index.scss";
import "./lib/remFlex";
import VConsole from "vconsole";
import Contrl from "./commponet/contrl";
new Contrl();

if (process.env.NODE_ENV === "development") {
	new VConsole();
}

