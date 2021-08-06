import "behavior/core/";

import Component from "component/Component";
import Filters from "filter/Filters";
import { builder, argumentsBuilder } from "const/Builder";
import create from "config/Create";
import CydranConfig from "config/CydranConfig";
import { isDefined, requireNotNull, requireValid, setStrictTypeChecksEnabled, merge, overlay } from "util/Utils";
import Events from "const/EventsFields";
import { CYDRAN_KEY, Ids } from "Constants";
import Renderer from "component/Renderer";
import ComponentOptions from "component/ComponentOptions";
import Behavior from "behavior/Behavior";
import PubSub from "message/PubSub";
import Disposable from "interface/ables/Disposable";
import { Stage, StageBuilder, ArgumentsResolversBuilder } from "stage/Stage";
import Validators from "validator/Validators";

import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import MachineContext from "machine/MachineContext";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";

import RegistryStrategy from "register/RegistryStrategy";
import { Filter, PagedFilter, LimitOffsetFilter } from "filter/Filter";

import Hooks from "digest/Hooks";
import HooksImpl from "digest/HooksImpl";

import ModulesContextImpl from "module/ModulesContextImpl";
import AbstractBehavior from "behavior/AbstractBehavior";
import AbstractSingleBehavior from "behavior/AbstractSingleBehavior";

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
	AbstractBehavior,
	AbstractSingleBehavior,
	ArgumentsResolversBuilder,
	Component,
	ComponentOptions,
	CydranConfig,
	Disposable,
	Behavior,
	Events,
	Filter,
	Filters,
	HOOKS,
	LimitOffsetFilter,
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
	argumentsBuilder,
	create,
	isDefined,
	noConflict,
	requireNotNull,
	requireValid,
	setStrictTypeChecksEnabled,
	Ids,
	reset,
	merge,
	overlay
};
