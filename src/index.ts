import Component from "component/Component";
import Filters from "filter/Filters";
import builder from "const/Builder";
import create from "config/Create";
import CydranConfig from "config/CydranConfig";
import {
	isDefined,
	requireNotNull,
	requireValid,
	setStrictTypeChecksEnabled
} from "util/Utils";
import Events from "const/EventsFields";
import { CYDRAN_KEY, Ids } from "Constants";
import Renderer from "element/Renderer";
import ComponentOptions from "component/ComponentOptions";
import ElementMediator from "mediator/ElementMediator";
import PubSub from "message/PubSub";
import Disposable from "interface/ables/Disposable";
import { Stage, StageBuilder } from "stage/Stage";
import Validators from "validator/Validators";

import Logger from "log/Logger";
import Level from "log/Level";
import LoggerFactory from "log/LoggerImpl";

import MachineContext from "machine/MachineContext";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";

import RegistryStrategy from "register/RegistryStrategy";
import { Filter, PagedFilter, LimitOffsetFilter } from "filter/Filter";

import Hooks from "digest/Hooks";
import HooksImpl from "digest/HooksImpl";

import ModulesContextImpl from "module/ModulesContextImpl";
import { AbstractElementMediator } from "mediator/AbstractElementMediator";

const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];
const HOOKS: Hooks = HooksImpl.INSTANCE;

function noConflict() {
	const currentCydran: any = window[CYDRAN_KEY];
	window[CYDRAN_KEY] = ORIGINAL_CYDRAN;

	return currentCydran;
}

function reset(): void {
	ModulesContextImpl.resetInstances();
}

export {
	AbstractElementMediator,
	Component,
	ComponentOptions,
	CydranConfig,
	Disposable,
	ElementMediator,
	Events,
	Filter,
	Filters,
	HOOKS,
	LimitOffsetFilter,
	Level,
	Logger,
	LoggerFactory,
	PagedFilter,
	PubSub,
	RegistryStrategy,
	Renderer,
	Stage,
	StageBuilder,
	Validators,
	MachineContext,
	Machine,
	stateMachineBuilder,
	builder,
	create,
	isDefined,
	noConflict,
	requireNotNull,
	requireValid,
	setStrictTypeChecksEnabled,
	Ids,
	reset
};
