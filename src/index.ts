import {
	Component,
	AbstractElementMediator,
	Filters,
	builder,
	create,
	CydranConfig,
	HooksImpl,
	ModulesContextImpl
} from "Component";
import {
	isDefined,
	requireNotNull,
	requireValid,
	setStrictTypeChecksEnabled
} from "Utils";
import { CYDRAN_KEY, Events, Ids } from "Constants";
import { ComponentOptions, ElementMediator, Hooks, PubSub, Renderer } from "Interfaces";
import { Disposable } from "interface/Ables";
import { Stage, StageBuilder } from "stage/Stage";
import { Validators } from "interface/Validators";
import { Logger } from "interface/Logger";
import { Level } from "log/Level";
import { LoggerFactory } from "log/LoggerImpl";
import { MachineContext, Machine, stateMachineBuilder } from "state/StateImpl";
import { RegistryStrategy } from "interface/Strategy";
import { Filter, PagedFilter, LimitOffsetFilter } from "interface/Filter";

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
