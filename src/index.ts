import Component from "component/Component";
import { builder, argumentsBuilder } from "const/Builder";
import create from "config/Create";
import { isDefined, requireNotNull, requireValid, setStrictTypeChecksEnabled, merge, overlay, enumKeys, padLeft, padRight } from "util/Utils";
import Events from "const/EventsFields";
import { CYDRAN_KEY, Ids } from "Constants";
import JSType from "const/JSType";
import Renderer from "component/Renderer";
import ComponentOptions from "component/ComponentOptions";
import Behavior from "behavior/Behavior";
import PubSub from "message/PubSub";
import Disposable from "interface/ables/Disposable";
import Stage from "stage/Stage";

import Logger from "log/Logger";
import LoggerFactory from "log/LoggerFactory";

import MachineContext from "machine/MachineContext";
import Machine from "machine/Machine";
import stateMachineBuilder from "machine/StateMachineBuilder";

import RegistryStrategy from "registry/RegistryStrategy";
import { Filter, PagedFilter, LimitOffsetFilter, FilterBuilder } from "filter/Filter";

import ModulesContextImpl from "module/ModulesContextImpl";
import AbstractBehavior from "behavior/AbstractBehavior";
import AbstractValueBehavior from "behavior/AbstractValueBehavior";
import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import Level from "log/Level";
import BehaviorFlags from "behavior/BehaviorFlags";
import OutputStrategy from "log/OutputStrategy";
import Module from "module/Module";
import PropertyKeys from "const/PropertyKeys";
import { Properties, MutableProperties, PropFlagVals } from "properties/Property";
import SimpleMap from "interface/SimpleMap";
import MachineBuilder from "machine/MachineBuilder";
import OnContinuation from "message/OnContinuation";
import MetadataContinuation from "component/MetadataContinuation";
import ElementOperations from "component/ElementOperations";
import DigestableSource from "behavior/DigestableSource";
import Nestable from "interface/ables/Nestable";
import Watchable from "interface/ables/Watchable";
import Type from "interface/Type";
import Gettable from "interface/ables/Gettable";
import ForChannelContinuation from "./message/ForChannelContinuation";
import { BiConsumer, BiPredicate, Predicate, VarConsumer, VarPredicate, Consumer } from "interface/Predicate";
import Scope from "scope/Scope";
import Dom from "dom/Dom";
import ArgumentsResolversBuilder from "stage/ArgumentsResolversBuilder";
import StageBuilder from "stage/StageBuilder";
import { Bundle, BundleContext, BundleGroup, BundleCategory, BundleItem } from "i18n/Bundle";
import AbstractBundleResolver from "i18n/AbstractBundleResolver";
import Nameable from "interface/ables/Nameable";

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
	BehaviorFlags,
	AbstractBehavior,
	AbstractValueBehavior,
	AbstractBundleResolver,
	ArgumentsResolvers,
	ArgumentsResolversBuilder,
	Bundle, BundleContext, BundleGroup, BundleCategory, BundleItem,
	Dom,
	Nameable,
	Component,
	Nestable,
	ElementOperations,
	Module,
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
	StageBuilder,
	Scope,
	MachineBuilder,
	MachineContext,
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
	builder,
	argumentsBuilder,
	create,
	isDefined,
	noConflict,
	requireNotNull,
	requireValid,
	enumKeys,
	padLeft,
	padRight,
	setStrictTypeChecksEnabled,
	Ids,
	JSType,
	reset,
	merge,
	overlay
};
