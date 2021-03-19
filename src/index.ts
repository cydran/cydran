import { Component, AbstractElementMediator, Filters, builder, create, CydranConfig, HooksImpl, ModulesContextImpl } from '@/Component';
import { isDefined, requireNotNull, requireValid, setStrictTypeChecksEnabled } from "@/Utils";
import { CYDRAN_KEY, Events, Ids } from "@/Constants";
import { LoggerFactory } from "@/Logger";
import { MachineContext, Machine, stateMachineBuilder } from "@/State";
import Disposable from "@/interface/ables/Disposable";
import Renderer from "@/element/Renderer";
import ComponentOptions from "@/component/ComponentOptions";
import { Stage, StageBuilder } from "@/stage/Stage";
import { Filter, LimitOffsetFilter, PagedFilter } from "@/filter/Filter";
import Hooks from "@/digest/Hooks";
import ElementMediator from "@/mediator/ElementMediator";
import PubSub from "@/message/PubSub";
import Logger from "@/log/Logger";
import Validators from "@/validator/Validators";
import RegistryStrategy from "@/register/RegistryStrategy";

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
