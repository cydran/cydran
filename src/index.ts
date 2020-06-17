import "@/component/";
import "@/config/";
import "@/constant/";
import "@/element/";
import "@/error/";
import "@/logger/";
import "@/message/";
import "@/model/";
import "@/module/";
import "@/mvvm/";
import "@/pattern/";
import "@/registry/";
import "@/stage/";
import "@/util/";

import { ComponentConfigBuilder } from "@/component/ComponentConfig";
import * as CydranConfig from "@/config/CydranConfig";
import Events from "@/constant/Events";
import Logger from "@/logger/Logger";
import LoggerFactory from "@/logger/LoggerFactory";
import PubSub from "@/message/PubSub";
import { builder, Stage, StageBuilder } from "@/stage/Stage";
import ElementMediator from "@/element/ElementMediator";
import Component from "@/component/Component";
import RegistryStrategy from "@/registry/RegistryStrategy";
import { isDefined, requireNotNull, requireValid, setStrictTypeChecksEnabled } from "@/util/ObjectUtils";
import Filters from "@/filter/Filters";
import { Filter, PagedFilter, LimitOffsetFilter } from "@/filter/Interfaces";
import HooksImpl from "@/support/HooksImpl";
import Hooks from "@/support/Hooks";

const CYDRAN_KEY: string = "cydran";
const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];
const HOOKS: Hooks = HooksImpl.INSTANCE;

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
	noConflict,
	isDefined,
	requireNotNull,
	requireValid,
	Filter,
	PagedFilter,
	LimitOffsetFilter,
	Filters,
	setStrictTypeChecksEnabled,
	HOOKS
};
