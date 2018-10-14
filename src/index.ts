import * as Config from "./Config";
import {Component, Decorator, Modules, Mvvm} from "./Core";
import AttributeElementDecorator from "./decorator/AttributeDecorator";
import ChangeElementDecorator from "./decorator/ChangeDecorator";
import ClickElementDecorator from "./decorator/ClickDecorator";
import ComponentEachElementDecorator from "./decorator/ComponentEachDecorator";
import DisableableModelElementDecorator from "./decorator/DisableableModelDecorator";
import FilterInputElementDecorator from "./decorator/FilterInputDecorator";
import ForceFocusElementDecorator from "./decorator/ForceFocusDecorator";
import InnerHtmlElementDecorator from "./decorator/InnerHtmlDecorator";
import KeydownElementDecorator from "./decorator/KeydownDecorator";
import RegionDecorator from "./decorator/RegionDecorator";
import SelectOptionsElementDecorator from "./decorator/SelectOptionsDecorator";
import ValuedModelElementDecorator from "./decorator/ValuedModelDecorator";
import VisibleElementDecorator from "./decorator/VisibleDecorator";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import "./messaging/";
import PubSub from "./messaging/PubSub";
import Module from "./Module";
import {Registry, RegistryStrategy} from "./Registry";
import Stage from "./Stage";

function registerDecorator(name: string, supportedTags: string[], decoratorClass: any): void {
	Mvvm.register(name, supportedTags, decoratorClass);
}

function registerFilter(name: string, fn: Function): void {
	Mvvm.registerFilter(name, fn);
}

Mvvm.register("click", ["*"], ClickElementDecorator);
Mvvm.register("change", ["*"], ChangeElementDecorator);
Mvvm.register("model", ["input", "select"], ValuedModelElementDecorator);
Mvvm.register("model", ["span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "label", "div"], InnerHtmlElementDecorator);
Mvvm.register("options-model", ["select"], SelectOptionsElementDecorator);
Mvvm.register("enabled", ["select", "input", "textarea", "button"], DisableableModelElementDecorator);
Mvvm.register("attribute", ["*"], AttributeElementDecorator);
Mvvm.register("keydown", ["*"], KeydownElementDecorator);
Mvvm.register("visible", ["*"], VisibleElementDecorator);
Mvvm.register("component-each", ["*"], ComponentEachElementDecorator);
Mvvm.register("force-focus", ["*"], ForceFocusElementDecorator);
Mvvm.register("filter", ["input", "textarea"], FilterInputElementDecorator);
Mvvm.register("region", ["*"], RegionDecorator);

export {
	Component,
	Stage,
	Decorator,
	Logger,
	LoggerFactory,
	Config,
	PubSub,
	Registry,
	RegistryStrategy,
	Module,
	Modules,
	registerDecorator,
	registerFilter,
};
