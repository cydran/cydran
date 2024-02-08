import { CYDRAN_KEY, Ids } from "Constants";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import AbstractBehavior from "behavior/AbstractBehavior";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";
import Behavior from "behavior/Behavior";
import BehaviorFlags from "behavior/BehaviorFlags";
import DigestableSource from "behavior/DigestableSource";
import Component from "component/Component";
import ComponentOptions from "component/ComponentOptions";
import ElementComponent from "component/ElementComponent";
import ElementOperations from "component/ElementOperations";
import MetadataContinuation from "component/MetadataContinuation";
import Renderer from "component/Renderer";
import create from "config/Create";
import { argumentsBuilder } from "const/Builder";
import Events from "const/EventsFields";
import JSType from "const/JSType";
import PropertyKeys from "const/PropertyKeys";
import { Context, Stage } from "context/Context";
import GlobalContextImpl from "context/GlobalContextImpl";
import ForChannelContinuation from "continuation/ForChannelContinuation";
import OnContinuation from "continuation/OnContinuation";
import { Filter, FilterBuilder, LimitOffsetFilter, PagedFilter } from "filter/Filter";
import { Nestable } from "interface/ComponentInterfaces";
import { BiConsumer, BiPredicate, Consumer, Predicate, VarConsumer, VarPredicate } from "interface/Predicate";
import SimpleMap from "interface/SimpleMap";
import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";
import Gettable from "interface/ables/Gettable";
import Watchable from "interface/ables/Watchable";
import Level from "log/Level";
import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";
import { OutputStrategy } from "log/OutputStrategy";
import Machine from "machine/Machine";
import MachineBuilder from "machine/MachineBuilder";
import MachineState from "machine/MachineState";
import stateMachineBuilder from "machine/StateMachineBuilder";
import PubSub from "message/PubSub";
import { MutableProperties, PropFlagVals, Properties } from "properties/Property";
import RegistryStrategy from "registry/RegistryStrategy";
import Scope from "scope/Scope";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import StageImpl from "stage/StageImpl";
import { enumKeys, isDefined, merge, overlay, padLeft, padRight, requireNotNull, requireValid, setStrictTypeChecksEnabled, uuidV4 } from "util/Utils";

import "element/index";

const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];

function noConflict() {
	const currentCydran: any = window[CYDRAN_KEY];
	window[CYDRAN_KEY] = ORIGINAL_CYDRAN;

	return currentCydran;
}

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

export {
	AbstractBehavior,
	AbstractValueBehavior,
	ArgumentsResolvers,
	ArgumentsResolversBuilder,
	Behavior,
	BehaviorFlags,
	BiConsumer,
	BiPredicate,
	Component,
	ComponentOptions,
	Consumer,
	Context,
	DigestableSource,
	Disposable,
	ElementOperations,
	Events,
	Filter,
	FilterBuilder,
	ForChannelContinuation,
	Gettable,
	Ids,
	JSType,
	Level,
	LimitOffsetFilter,
	Logger,
	LoggerFactory,
	Machine,
	MachineBuilder,
	MachineState,
	MetadataContinuation,
	MutableProperties,
	Nestable,
	OnContinuation,
	OutputStrategy,
	PagedFilter,
	Predicate, PropFlagVals, Properties,
	PropertyKeys, PubSub,
	RegistryStrategy,
	Renderer,
	Scope,
	SimpleMap,
	Stage,
	StageImpl,
	Type,
	VarConsumer,
	VarPredicate,
	Watchable,
	argumentsBuilder,
	create,
	enumKeys,
	isDefined,
	merge,
	noConflict,
	overlay,
	padLeft,
	padRight,
	requireNotNull,
	requireValid,
	setStrictTypeChecksEnabled,
	stateMachineBuilder,
	uuidV4,

	// Experimental items
	ElementComponent

};

