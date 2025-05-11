import { JSType, Events, CYDRAN_KEY, PropertyKeys, To } from "CydranConstants";
import { PropertyChangeCallback, PropertyChangeFallbackCallback, PropertyProvider, 
	PropertySubscriber, PropertyFallBackSubscriber, CallBackThisObject } from "CydranTypes";
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
import argumentsBuilder from "function/argumentsBuilder";
import { Context, Nestable, Stage } from "context/Context";
import GlobalContextImpl from "context/GlobalContextImpl";
import ForChannelContinuation from "continuation/ForChannelContinuation";
import OnContinuation from "continuation/OnContinuation";
import { Filter, FilterBuilder, LimitOffsetFilter, PagedFilter } from "filter/Filter";
import { BiConsumer, BiPredicate, Consumer, Predicate, VarConsumer, VarPredicate } from "interface/Predicate";
import SimpleMap from "interface/SimpleMap";
import Type from "interface/Type";
import Watchable from "interface/ables/Watchable";
import Logger from "log/Logger";
import { Appender } from "log/appender/Appender";
import Machine from "machine/Machine";
import MachineBuilder from "machine/MachineBuilder";
import MachineState from "machine/MachineState";
import stateMachineBuilder from "machine/StateMachineBuilder";
import { MutableProperties, PropFlagVals, Properties } from "properties/Property";
import Scope from "scope/Scope";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import StageImpl from "stage/StageImpl";
import { defaulted, enumKeys, isDefined, merge, overlay, padLeft, padRight, requireNotNull, requireValid, setStrictTypeChecksEnabled, uuidV4 } from "util/Utils";

import "element/index";
import MessageCallback from "message/MessageCallback";
import DigestionCandidate from "digest/DigestionCandidate";
import Releasable from "interface/ables/Releasable";
import Transmitter from 'message/Transmitter';
import Receiver from 'message/Receiver';
import getLogger from "log/getLogger";
import ArgumentType from "registry/ArgumentType";
import ArgumentOption from "registry/ArgumentOption";

const ORIGINAL_CYDRAN: unknown = window[CYDRAN_KEY];

function noConflict() {
	const currentCydran: unknown = window[CYDRAN_KEY];
	window[CYDRAN_KEY] = ORIGINAL_CYDRAN;

	return currentCydran;
}

// TODO - Move this

function create(rootSelector: string, properties: SimpleMap<unknown>, callback?: (context: Context) => void, thisObject?: Object): Stage {
	return new StageImpl(rootSelector, defaulted(properties, {}), callback, thisObject);
}

requireNotNull(GlobalContextImpl, "GlobalContextImpl");

export {
	// Experimental items
	ElementComponent,

	// Core functions
	getLogger,
	create,
	noConflict,
	argumentsBuilder,

	// Core classes
	Component,
	AbstractBehavior,

	// Core interfaces
	Properties,
	Renderer,
	Context,
	Logger,
	Stage,
	Type,

	// Cydran types
	PropertyChangeCallback,
	PropertyChangeFallbackCallback,
	PropertyProvider,
	PropertySubscriber,
	PropertyFallBackSubscriber,
	CallBackThisObject,

	// Utils
	requireNotNull,
	requireValid,
	isDefined,
	merge,
	overlay,
	padLeft,
	padRight,

	// Review and categorize
	AbstractValueBehavior,
	ArgumentsResolvers,
	ArgumentsResolversBuilder,
	Behavior,
	BehaviorFlags,
	BiConsumer,
	BiPredicate,
	ComponentOptions,
	Consumer,
	DigestableSource,
	Releasable,
	ElementOperations,
	Events,
	Filter,
	FilterBuilder,
	ForChannelContinuation,
	JSType,
	LimitOffsetFilter,
	Machine,
	MachineBuilder,
	MachineState,
	MessageCallback,
	MetadataContinuation,
	MutableProperties,
	Nestable,
	OnContinuation,
	Appender,
	PagedFilter,
	Predicate,
	PropFlagVals,
	PropertyKeys,
	Scope,
	SimpleMap,
	VarConsumer,
	VarPredicate,
	Watchable,
	enumKeys,
	setStrictTypeChecksEnabled,
	stateMachineBuilder,
	uuidV4,
	Transmitter,
	Receiver,
	To,
	DigestionCandidate, // TODO - Remove this from being publicly exposed
	ArgumentType,
	ArgumentOption

};

