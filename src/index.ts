import Stage from './Stage';
import Logger from './logger/Logger';
import LoggerFactory from './logger/LoggerFactory';
import Broadcaster from './messaging/Broadcaster';
import PubSub from './messaging/PubSub';
import * as Config from './Config';
import {Component, Mvvm, Decorator} from './Core';
import {Registry, RegistryStrategy} from './Registry';
import ClickElementDecorator from "./decorator/ClickDecorator";
import ChangeElementDecorator from "./decorator/ChangeDecorator";
import ValuedModelElementDecorator from "./decorator/ValuedModelDecorator";
import InnerHtmlElementDecorator from "./decorator/InnerHtmlDecorator";
import SelectOptionsElementDecorator from "./decorator/SelectOptionsDecorator";
import DisableableModelElementDecorator from "./decorator/DisableableModelDecorator";
import AttributeElementDecorator from "./decorator/AttributeDecorator";
import KeydownElementDecorator from "./decorator/KeydownDecorator";
import VisibleElementDecorator from "./decorator/VisibleDecorator";
import ComponentEachElementDecorator from "./decorator/ComponentEachDecorator";
import ForceFocusElementDecorator from "./decorator/ForceFocusDecorator";
import FilterInputElementDecorator from "./decorator/FilterInputDecorator";
import RegionDecorator from "./decorator/RegionDecorator";
import './messaging/';

function registerDecorator(name: string, supportedTags: string[], decoratorClass: any): void {
	Mvvm.register(name, supportedTags, decoratorClass);
}

function registerFilter(name: string, fn: Function): void {
	Mvvm.registerFilter(name, fn);
}

Mvvm.register('click', ['*'], ClickElementDecorator);
Mvvm.register('change', ['*'], ChangeElementDecorator);
Mvvm.register('model', ['input', 'select'], ValuedModelElementDecorator);
Mvvm.register('model', ['span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'label', 'div'], InnerHtmlElementDecorator);
Mvvm.register('options-model', ['select'], SelectOptionsElementDecorator);
Mvvm.register('enabled', ['select', 'input', 'textarea', 'button'], DisableableModelElementDecorator);
Mvvm.register('attribute', ['*'], AttributeElementDecorator);
Mvvm.register('keydown', ['*'], KeydownElementDecorator);
Mvvm.register('visible', ['*'], VisibleElementDecorator);
Mvvm.register('component-each', ['*'], ComponentEachElementDecorator);
Mvvm.register('force-focus', ['*'], ForceFocusElementDecorator);
Mvvm.register('filter', ['input', 'textarea'], FilterInputElementDecorator);
Mvvm.register('region', ['*'], RegionDecorator);

Mvvm.registerFilter('upper', (str: string) => str.toUpperCase());

export {Component, Stage, Decorator, Logger, LoggerFactory, Config, Broadcaster, PubSub, Registry, RegistryStrategy, registerDecorator, registerFilter};