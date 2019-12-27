import { ComponentConfigBuilder } from "@/ComponentConfig";
import { Component, ElementMediator, Events, Modules } from "@/Core";
import * as CydranConfig from "@/CydranConfig";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import "@/mediator/";
import "@/messaging/";
import PubSub from "@/messaging/PubSub";
import RegistryStrategy from "@/RegistryStrategy";
import Stage from "@/Stage";

const CYDRAN_KEY: string = "cydran";
const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];

function noConflict() {
	const currentCydran: any = window[CYDRAN_KEY];
	window[CYDRAN_KEY] = ORIGINAL_CYDRAN;

	return currentCydran;
}

export {
	ComponentConfigBuilder,
	Component,
	Events,
	Stage,
	ElementMediator,
	Logger,
	LoggerFactory,
	CydranConfig,
	PubSub,
	RegistryStrategy,
	Modules,
	noConflict,
};
