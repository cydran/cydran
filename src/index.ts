import Component from "component/Component";
import { argumentsBuilder } from "const/Builder";
import create from "config/Create";
import { uuidV4, isDefined, requireNotNull, requireValid, setStrictTypeChecksEnabled, merge, overlay, enumKeys, padLeft, padRight } from "util/Utils";
import Events from "const/EventsFields";
import { CYDRAN_KEY, Ids } from "Constants";
import JSType from "const/JSType";
import Renderer from "component/Renderer";
import ComponentOptions from "component/ComponentOptions";
import Behavior from "behavior/Behavior";
import PubSub from "message/PubSub";
import Disposable from "interface/ables/Disposable";

import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import MachineState from "machine/MachineState";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";

import RegistryStrategy from "registry/RegistryStrategy";
import { Filter, PagedFilter, LimitOffsetFilter, FilterBuilder } from "filter/Filter";

import AbstractBehavior from "behavior/AbstractBehavior";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import Level from "log/Level";
import BehaviorFlags from "behavior/BehaviorFlags";
import OutputStrategy from "log/OutputStrategy";
import PropertyKeys from "const/PropertyKeys";
import { Properties, MutableProperties, PropFlagVals } from "properties/Property";
import SimpleMap from "interface/SimpleMap";
import MachineBuilder from "machine/MachineBuilder";
import MetadataContinuation from "component/MetadataContinuation";
import ElementOperations from "component/ElementOperations";
import DigestableSource from "behavior/DigestableSource";
import Watchable from "interface/ables/Watchable";
import Type from "interface/Type";
import Gettable from "interface/ables/Gettable";
import ForChannelContinuation from "./continuation/ForChannelContinuation";
import { BiConsumer, BiPredicate, Predicate, VarConsumer, VarPredicate, Consumer } from "interface/Predicate";
import Scope from "scope/Scope";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import OnContinuation from "continuation/OnContinuation";
import { Nestable } from "interface/ComponentInterfaces";
import { Context, Stage } from "context/Context";
import StageImpl from "context/RootContextImpl";

const ORIGINAL_CYDRAN: any = window[CYDRAN_KEY];

function noConflict() {
	const currentCydran: any = window[CYDRAN_KEY];
	window[CYDRAN_KEY] = ORIGINAL_CYDRAN;

	return currentCydran;
}

export {
	BehaviorFlags,
	AbstractBehavior,
	AbstractValueBehavior,
	ArgumentsResolvers,
	ArgumentsResolversBuilder,
	Component,
	Nestable,
	ElementOperations,
	Context,
	ComponentOptions,
	Disposable,
	Watchable,
	Gettable,
	DigestableSource,
	Behavior,
	OnContinuation,
	MetadataContinuation,
	Events,
	FilterBuilder,
	Filter,
	LimitOffsetFilter,
	Logger,
	LoggerFactory,
	Level,
	OutputStrategy,
	PagedFilter,
	PubSub,
	ForChannelContinuation,
	RegistryStrategy,
	Renderer,
	Stage,
	Scope,
	MachineBuilder,
	MachineState,
	Predicate,
	VarConsumer,
	VarPredicate,
	BiPredicate,
	BiConsumer,
	Consumer,
	Properties,
	MutableProperties,
	PropFlagVals,
	Machine,
	PropertyKeys,
	SimpleMap,
	Type,
	stateMachineBuilder,
	argumentsBuilder,
	create,
	isDefined,
	noConflict,
	requireNotNull,
	requireValid,
	uuidV4,
	enumKeys,
	padLeft,
	padRight,
	setStrictTypeChecksEnabled,
	Ids,
	JSType,
	merge,
	overlay,
	StageImpl
};
