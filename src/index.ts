import { ComponentConfigBuilder } from "@/ComponentConfig";
import * as CydranConfig from "@/CydranConfig";
import Events from "@/Events";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import "@/element/";
import "@/messaging/";
import PubSub from "@/messaging/PubSub";
import { RegistryStrategy } from "@/Registry";
import { builder, Stage, StageBuilder } from "@/Stage";
import ElementMediator from "@/element/ElementMediator";
import Component from "@/Component";

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
	StageBuilder,
	builder,
	ElementMediator,
	Logger,
	LoggerFactory,
	CydranConfig,
	PubSub,
	RegistryStrategy,
	noConflict
};
