import * as Config from "./Config";
import { Component, Decorator, Modules, RepeatComponent } from "./Core";
import "./decorator/";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import "./messaging/";
import PubSub from "./messaging/PubSub";
import RegistryStrategy from "./RegistryStrategy";
import Stage from "./Stage";

const CYDRAN_KEY: string = "cydran";
const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];

function noConflict() {
	const currentCydran: any = window[CYDRAN_KEY];
	window[CYDRAN_KEY] = ORIGINAL_CYDRAN;

	return currentCydran;
}

export { Component, Stage, Decorator, Logger, LoggerFactory, Config, PubSub, RegistryStrategy, RepeatComponent, Modules, noConflict };
