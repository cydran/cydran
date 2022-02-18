import "behavior/core/";

import Component from "component/Component";
import Filters from "filter/Filters";
import { builder, argumentsBuilder } from "const/Builder";
import create from "config/Create";
import { isDefined, requireNotNull, requireValid, setStrictTypeChecksEnabled, merge, overlay, padText } from "util/Utils";
import Events from "const/EventsFields";
import { CYDRAN_KEY, Ids } from "Constants";
import JSType from "const/JSType";
import Renderer from "component/Renderer";
import ComponentOptions from "component/ComponentOptions";
import Behavior from "behavior/Behavior";
import PubSub from "message/PubSub";
import Disposable from "interface/ables/Disposable";
import { Stage, StageBuilder, ArgumentsResolversBuilder } from "stage/Stage";

import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import MachineContext from "machine/MachineContext";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";

import RegistryStrategy from "registry/RegistryStrategy";
import { Filter, PagedFilter, LimitOffsetFilter } from "filter/Filter";

import ModulesContextImpl from "module/ModulesContextImpl";
import AbstractBehavior from "behavior/AbstractBehavior";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import Level from "log/Level";

const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];

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
	AbstractValueBehavior,
	ArgumentsResolversBuilder,
	Component,
	ComponentOptions,
	Disposable,
	Behavior,
	Events,
	Filter,
	Filters,
	LimitOffsetFilter,
	Logger,
	LoggerFactory,
	Level,
	PagedFilter,
	PubSub,
	RegistryStrategy,
	Renderer,
	Stage,
	StageBuilder,
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
	padText,
	setStrictTypeChecksEnabled,
	Ids,
	JSType,
	reset,
	merge,
	overlay,
	ArgumentsResolvers
};
