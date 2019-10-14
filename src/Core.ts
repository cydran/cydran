import _ from "lodash";
import Disposable from "./Disposable";
import MalformedOnEventError from "./error/MalformedOnEventError";
import RegistrationError from "./error/RegistrationError";
import SetComponentError from "./error/SetComponentError";
import TemplateError from "./error/TemplateError";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import Broker from "./messaging/Broker";
import Listener from "./messaging/Listener";
import PubSub from "./messaging/PubSub";
import ModelMediator from "./ModelMediator";
import ModelMediatorImpl from "./ModelMediatorImpl";
import Module from "./Module";
import Register from "./Register";
import { Registry, RegistryImpl } from "./Registry";
import RegistryStrategy from "./RegistryStrategy";
import SequenceGenerator from "./SequenceGenerator";

const MAX_EVALUATIONS: number = 10000;

const encodeHtmlMap: any = {
	'"': "&quot;",
	"&": "&amp;",
	"'": "&#39;",
	"<": "&lt;",
	">": "&gt;",
};

class Properties {

	public static setWindow(window: Window): void {
		Properties.window = window;
	}

	public static getWindow(): Window {
		return Properties.window;
	}

	private static window: Window;

}

Properties.setWindow(global["window"]);

function lookupEncodeHtmlMap(key: string): string {
	return encodeHtmlMap[key];
}

function encodeHtml(source: string): string {
	return (source === null) ? null : (source + "").replace(/[&"'<>]/g, lookupEncodeHtmlMap);
}

class BrokerImpl implements Broker {

	public static INSTANCE: Broker;

	private logger: Logger;

	private listeners: {
		[channelName: string]: Listener[];
	};

	constructor() {
		this.logger = LoggerFactory.getLogger("Broker");
		this.listeners = {};
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.logger.trace({
			channelName: channelName,
			messageName: messageName,
			payload: payload,
		});

		if (!this.listeners[channelName]) {
			this.logger.trace("no listeners for channel, returning");
			return;
		}

		const listeners = this.listeners[channelName];

		for (const listener of listeners) {
			listener.receive(messageName, payload);
		}
	}

	public addListener(listener: Listener): void {
		const channelName: string = listener.getChannelName();

		if (!this.listeners[channelName]) {
			this.listeners[channelName] = [];
		}

		const listeners: Listener[] = this.listeners[channelName];

		if (!this.contains(listeners, listener)) {
			listeners.push(listener);
		}
	}

	public removeListener(listener: Listener): void {
		const channelName: string = listener.getChannelName();

		const listeners: Listener[] = this.listeners[channelName];

		if (!listeners) {
			return;
		}

		this.remove(listeners, listener);

		if (0 === listeners.length) {
			delete this.listeners[channelName];
		}
	}

	public dispose(): void {
		this.listeners = {};
	}

	private contains(array: any[], instance: any): boolean {
		let i = array.length;

		while (i--) {
			if (array[i] === instance) {
				return true;
			}
		}

		return false;
	}

	private remove(array: any[], instance: any): void {
		let i = array.length;

		while (i--) {
			if (array[i] === instance) {
				array.splice(i, 1);
				break;
			}
		}
	}

}

const ALIASES: {
	[id: string]: string;
} = {};

const TOBE: {
	"A": string,
	"D": string,
} = {
	A: "associate",
	D: "disassociate",
};

class ModuleImpl implements Module, Register {

	private name: string;
	private registry: Registry;
	private broker: Broker;

	constructor(name: string) {
		this.name = name;
		this.registry = new RegistryImpl();
		this.broker = new BrokerImpl();
	}

	public getLogger(): Logger {
		return LoggerFactory.getLogger(this.name);
	}

	public getName(): string {
		return this.name;
	}

	public associate(...componentClasses: any[]): Module {
		componentClasses.forEach((cClass) => {
			cClass[TOBE.A](this);
		});

		return this;
	}

	public disassociate(...componentClasses: any[]): Module {
		componentClasses.forEach((componentClass) => {
			componentClass[TOBE.D](this);
		});

		return this;
	}

	public clear(): Module {
		return this;
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.broker.broadcast(channelName, messageName, payload);
	}

	public addListener(listener: Listener): void {
		this.broker.addListener(listener);
	}

	public removeListener(listener: Listener): void {
		this.broker.removeListener(listener);
	}

	public get<T>(id: string): T {
		let result: T = this.registry.get(id);

		if (!result) {
			result = Modules.get(id);
		}

		return result;
	}

	public getLocal<T>(id: string): T {
		return this.registry.get(id);
	}

	public registerConstant(id: string, instance: any): Module {
		try {
			this.registry.registerConstant(id, instance);
		} catch (e) {
			this.logError(e);
			throw e;
		}
		return this;
	}

	public registerPrototype(id: string, classInstance: any): Module {
		try {
			this.registry.registerPrototype(id, classInstance);
		} catch (e) {
			this.logError(e);
			throw e;
		}
		return this;
	}

	public registerSingleton(id: string, classInstance: any): Module {
		try {
			this.registry.registerSingleton(id, classInstance);
		} catch (e) {
			this.logError(e);
			throw e;
		}
		return this;
	}

	public addStrategy(strategy: RegistryStrategy): Module {
		this.registry.addStrategy(strategy);
		return this;
	}

	public expose(id: string): Module {
		ALIASES[id] = this.name;

		return this;
	}

	private logError(e: RegistrationError) {
		this.getLogger().error(e);
	}

}

const DEF_KEY: string = "DEFAULT";
const DEFAULT_MODULE: Module = new ModuleImpl(DEF_KEY);

class Modules {

	public static getModule(name: string): Module {
		if (!Modules.modules[name]) {
			Modules.modules[name] = new ModuleImpl(name);
		}

		return Modules.modules[name];
	}

	public static getDefaultModule(): Module {
		return this.getModule(DEF_KEY);
	}

	public static forEach(fn: (instace: Module) => void): void {
		for (const name in Modules.modules) {
			if (!Modules.modules.hasOwnProperty(name)) {
				continue;
			}

			const current: Module = Modules.modules[name];

			fn(current);
		}
	}

	public static broadcast(channelName: string, messageName: string, payload: any): void {
		Modules.forEach((instance) => instance.broadcast(channelName, messageName, payload));
	}

	public static registerConstant(id: string, instance: any): void {
		this.getDefaultModule().registerConstant(id, instance);
	}

	public static registerPrototype(id: string, classInstance: any): void {
		this.getDefaultModule().registerPrototype(id, classInstance);
	}

	public static registerSingleton(id: string, classInstance: any): void {
		this.getDefaultModule().registerSingleton(id, classInstance);
	}

	public static registerDecorator(name: string, supportedTags: string[], decoratorClass: any): void {
		try {
			Mvvm.register(name, supportedTags, decoratorClass);
		} catch (e) {
			this.logger.error(e.message);
		}
	}

	public static registerFilter(name: string, fn: Function): void {
		try {
			Mvvm.registerFilter(name, fn);
		} catch (e) {
			this.logger.error(e);
		}
	}

	public static get<T>(id: string): T {
		let result: T = null;

		const moduleId: string = ALIASES[id];

		if (moduleId) {
			result = Modules.getModule(id).getLocal(id);
		}

		if (!result) {
			result = DEFAULT_MODULE.getLocal(id);
		}

		return result;
	}

	private static logger: Logger = LoggerFactory.getLogger("Modules:static");

	private static modules: {
		[id: string]: Module;
	} = {
			DEFAULT: DEFAULT_MODULE,
		};

}

abstract class Component {

	public static associate(moduleInstance: Module): void {
		if (moduleInstance) {
			this.prototype["moduleInstance"] = moduleInstance;
		}
	}

	public static disassociate(): void {
		this.prototype["moduleInstance"] = DEFAULT_MODULE;
	}

	private logger: Logger;

	private el: HTMLElement;

	private regions: { [id: string]: Region; };

	private parent: Component;

	private componentName: string;

	private id: number;

	private template: string;

	private mvvm: Mvvm;

	private pubSub: PubSub;

	private metadata: {
		[id: string]: any;
	};

	constructor(componentName: string, template: string, attributePrefix?: string) {
		if (typeof template !== "string") {
			throw new TemplateError("Template must be a non-null string");
		}

		const prefix: string = attributePrefix || "data-c";

		this.componentName = componentName;
		this.template = template.trim();
		this.id = SequenceGenerator.INSTANCE.next();
		this.logger = LoggerFactory.getLogger(componentName + " Component " + this.id);
		this.init();
		this.mvvm = new Mvvm(this, this.getModule(), prefix);
		this.regions = {};
		this.pubSub = new PubSub(this, this.getModule());
		this.render();
		this.mvvm.init(this.el, this);
	}

	public hasMetadata(name: string): boolean {
		return this.getMetadata(name) ? true : false;
	}

	public getMetadata(name: string): any {
		return this.metadata[name];
	}

	public setParent(parent: Component): void {
		if (parent === null) {
			this.pubSub.disableGlobal();
			this.getLogger().trace("Clearing parent view");
		} else {
			this.pubSub.enableGlobal();
			this.getLogger().trace("Setting parent view " + parent.getId());
		}

		this.digest();

		this.parent = parent;
	}

	public getRegion(name: string): Region {
		if (!this.regions[name]) {
			this.getLogger().trace("Creating region " + name);
			this.regions[name] = new Region(name, this);
		}

		return this.regions[name];
	}

	public digest(): void {
		this.$apply(() => {
			// Intentionally do nothing
		});
	}

	public setChild(name: string, component: Component): void {
		this.getRegion(name).setComponent(component);
	}

	public setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void {
		let component: Component = this.get(componentName);

		if (!component && defaultComponentName) {
			component = this.get(defaultComponentName);
		}

		if (component) {
			this.setChild(name, component);
		} else {
			this.getLogger().error(new SetComponentError("Unable to set component %cName% on region %name%", { "%cName%": componentName, "%name%": name }));
		}
	}

	public message(channelName: string, messageName: string, payload: any): void {
		this.pubSub.message(channelName, messageName, payload);
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	public dispose(): void {
		this.pubSub.dispose();
		this.parent = null;
	}

	public getId(): number {
		return this.id;
	}

	public getEl(): HTMLElement {
		return this.el;
	}

	public get<T>(id: string): T {
		return this.getModule().get(id);
	}

	protected watch(expression: string, target: (previous: any, current: any) => void): void {
		this.mvvm.mediate(expression).watch(this, target);
	}

	protected withMetadata(name: string, value: any): void {
		this.metadata[name] = value;
	}

	protected listenTo(channel: string, messageName: string, target: Function): void {
		this.pubSub.listenTo(channel, messageName, (payload) => {
			this.$apply(target, payload);
		});
	}

	protected $apply(fn: Function, ...args: any[]): void {
		this.mvvm.$apply(fn, args);
	}

	protected getParent(): Component {
		return this.parent;
	}

	protected getLogger(): Logger {
		return this.logger;
	}

	protected getTemplate(): string {
		return this.template;
	}

	protected init(): void {
		// Intentionally do nothing, but allow child classes to override
	}

	protected getModule(): Module {
		return this["moduleInstance"] as Module;
	}

	protected render(): void {
		this.getLogger().trace("Rendering");
		const topElement: HTMLElement = Properties.getWindow().document.createElement("div");
		topElement.innerHTML = this.template;
		const count: number = topElement.childElementCount;

		if (count !== 1) {
			const parmObj = { "%count%": "" + count, "%template%": this.template };
			const errmsg = "Component template must have a single top level element, but had %count% top level elements:\n\n%template%\n\n";
			const error = new TemplateError(errmsg, parmObj);
			this.getLogger().fatal(error);
			throw error;
		}

		this.el = topElement.firstChild as HTMLElement;
	}

	protected setEl(el: HTMLElement): void {
		this.el = el;
	}

	private notify(messageName: string): void {
		this.message("component", messageName, {});
	}

}

Component["prototype"]["moduleInstance"] = DEFAULT_MODULE;

interface DecoratorDependencies {
	mvvm: Mvvm;
	parent: Component;
	el: HTMLElement;
	expression: string;
	model: any;
	prefix: string;
}

abstract class Decorator<T> implements Disposable {

	private logger: Logger;

	private el: HTMLElement;

	private model: any;

	private expression: string;

	private previous: any;

	private value: any;

	private mvvm: Mvvm;

	private parent: Component;

	private moduleInstance: Module;

	private prefix: string;

	private mediator: ModelMediator;

	private pubSub: PubSub;

	private params: {
		[name: string]: string;
	};

	private domListeners: {
		[name: string]: any;
	};

	constructor(dependencies: DecoratorDependencies) {
		this.logger = LoggerFactory.getLogger("Decorator: " + dependencies.prefix);
		this.parent = dependencies.parent;
		this.el = dependencies.el;
		this.expression = dependencies.expression;
		this.model = dependencies.model;
		this.previous = null;
		this.value = null;
		this.mvvm = dependencies.mvvm;
		this.prefix = dependencies.prefix;
		this.params = {};
		this.domListeners = {};
		this.pubSub = new PubSub(this, this.getModule());
	}

	/**
	 * Dispose of [[Decorator|decorator]] when released.
	 * + All event listeners will be removed.
	 * + This decorator will be unwired from any other DOM entanglements
	 * + The mediator reference to the model is released/nulled
	 * + Any value representation of this decorator is released/nulled
	 * + The [[Mvvm|mvvm]] refernce is released/nulled
	 * + The parental reference is released/nulled
	 */
	public dispose(): void {
		this.removeDomListeners();
		this.unwire();
		this.mediator = null;
		this.model = null;
		this.value = null;
		this.mvvm = null;
		this.parent = null;
	}

	/**
	 * Initialize this decorator
	 */
	public init(): void {
		this.mediator = this.mediate(this.getExpression());
		this.wire();
	}

	/**
	 * Get the active module instance reference by id
	 * @return U
	 */
	public get<U>(id: string): U {
		return this.moduleInstance.get(id);
	}

	/**
	 * Set the [[Module|module]] instance reference
	 * @param {Module} moduleInstance
	 */
	public setModule(moduleInstance: Module): void {
		this.moduleInstance = moduleInstance;
	}

	/**
	 * [message description]
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public message(channelName: string, messageName: string, payload: any): void {
		this.pubSub.message(channelName, messageName, payload);
	}

	/**
	 * Broadcast a message
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	/**
	 * Broadcast a message in the Global context
	 * @param {string} channelName [description]
	 * @param {string} messageName [description]
	 * @param {any}    payload     [description]
	 */
	public broadcastGlobally(channelName: string, messageName: string, payload: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	/**
	 * Listen to specific messages
	 * @param {string}   channel     [description]
	 * @param {string}   messageName [description]
	 * @param {Function} target      [description]
	 */
	protected listenTo(channel: string, messageName: string, target: Function): void {
		this.pubSub.listenTo(channel, messageName, (payload) => {
			target.apply(this, [payload]);
		});
	}

	/**
	 * Enable bridging of DOM events to the "dom" channel.
	 * @param {string} name [description]
	 */
	protected bridge(name: string): void {
		const listener = (event) => {
			this.message("dom", name, event);
		};

		if (!this.domListeners[name]) {
			this.domListeners[name] = listener;
			this.getEl().addEventListener(name, listener, false);
		}
	}

	/**
	 * Get the associated {HTMLElement html element} of this decorator.
	 * @return {HTMLElement} [description]
	 */
	protected getEl(): HTMLElement {
		return this.el;
	}

	/**
	 * [getModule description]
	 * @return {Module} [description]
	 */
	protected getModule(): Module {
		return this["moduleInstance"] as Module;
	}

	/**
	 * [mediate description]
	 * @param  {string}        expression [description]
	 * @return {ModelMediator}            [description]
	 */
	protected mediate(expression: string): ModelMediator {
		return this.mvvm.mediate(expression);
	}

	/**
	 * [getModel description]
	 * @return {any} [description]
	 */
	protected getModel(): any {
		return this.model;
	}

	/**
	 * [getParent description]
	 * @return {Component} [description]
	 */
	protected getParent(): Component {
		return this.parent;
	}

	/**
	 * [getMediator description]
	 * @return {ModelMediator} [description]
	 */
	protected getMediator(): ModelMediator {
		return this.mediator;
	}

	/**
	 * [notifyModelInteraction description]
	 */
	protected notifyModelInteraction(): void {
		if (this.mvvm) {
			this.mvvm.evaluateModel();
		}
	}

	/**
	 * Get the expression specified
	 * @return {string} [description]
	 */
	protected getExpression(): string {
		return this.expression;
	}

	/**
	 * Wire the [[Decorator|decorator]]
	 */
	protected abstract wire(): void;

	/**
	 * Unwire the [[Decorator|decorator]]
	 */
	protected abstract unwire(): void;

	private removeDomListeners(): void {
		for (const name in this.domListeners) {
			if (!this.domListeners.hasOwnProperty(name)) {
				continue;
			}

			const listener: any = this.domListeners[name];

			this.getEl().removeEventListener(name, listener);
		}

		this.domListeners = {};
	}

}

class Region {

	private logger: Logger;

	private defaultEl: HTMLElement;

	private component: Component;

	private parent: Component;

	private name: string;

	constructor(name: string, parent: Component) {
		this.defaultEl = null;
		this.component = null;
		this.parent = parent;
		this.name = name;
		this.logger = LoggerFactory.getLogger("Region " + this.name + " for " + parent.getId());
	}

	public setDefaultEl(defaultEl: HTMLElement): void {
		this.defaultEl = defaultEl;
	}

	public setComponent(component: Component): void {
		this.logger.trace("Setting component");

		if (this.component === component) {
			return;
		}

		if (component !== null && this.component === null) {
			this.component = component;
			const newComponentEl: HTMLElement = component.getEl();
			const parentElement: HTMLElement = this.defaultEl.parentElement;
			parentElement.replaceChild(newComponentEl, this.defaultEl);
			this.component.setParent(this.parent);
		} else if (component === null && this.component !== null) {
			this.component.setParent(null);
			const oldComponentEl: HTMLElement = this.component.getEl();
			this.component = null;
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(this.defaultEl, oldComponentEl);
		} else if (component !== null && this.component !== null) {
			this.component.setParent(null);
			const newComponentEl: HTMLElement = component.getEl();
			const oldComponentEl: HTMLElement = this.component.getEl();
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(newComponentEl, oldComponentEl);
			this.component = component;
			this.component.setParent(this.parent);
		}
	}

	public dispose() {
		if (this.component) {
			this.component.dispose();
		}

		this.setComponent(null);
	}

}

class TextDecorator extends Decorator<string> {

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		const replacement: string = encodeHtml(current);
		this.getEl().innerHTML = replacement;
	}

}

class EventDecorator extends Decorator<Function> {

	private eventKey: string;

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleEvent(event: Event): void {
		this.getMediator().invoke(event);
		this.notifyModelInteraction();
	}

	public wire(): void {
		this.bridge(this.eventKey);
		this.listenTo("dom", this.eventKey, this.handleEvent);
	}

	public setEventKey(eventKey: string): void {
		this.eventKey = eventKey;
	}

}

class AttributeDecorator extends Decorator<string> {

	private attributeName: string;

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	public setAttributeName(attributeName: string): void {
		this.attributeName = attributeName;
	}

	protected onTargetChange(previous: any, current: any): void {
		this.getEl().setAttribute(this.attributeName, current + "");
	}

}

class Mvvm {

	public static register(name: string, supportedTags: string[], elementDecoratorClass: any): void {
		if (!Mvvm.factories[name]) {
			Mvvm.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			Mvvm.factories[name][supportedTag] = elementDecoratorClass;
		}
	}

	public static registerFilter(name: string, fn: Function) {
		Mvvm.filters[name] = fn;

		let code: string = "";

		for (const key in Mvvm.filters) {
			if (Mvvm.filters.hasOwnProperty(key)) {
				const statement: string = "var " + key + " = arguments[0]['" + key + "'];\n";
				code += statement;
			}
		}

		Mvvm.filtersCode = code;
	}

	public static getFilters(): { [name: string]: Function; } {
		return Mvvm.filters;
	}

	public static getFiltersCode(): string {
		return Mvvm.filtersCode;
	}

	private static factories: {
		[decoratorType: string]: {
			[tag: string]: new () => Decorator<any>;
		},
	} = {};

	private static filters: {
		[name: string]: Function;
	} = {};

	private static filtersCode: string = "";

	private logger: Logger;

	private el: HTMLElement;

	private decorators: Array<Decorator<any>>;

	private mediators: ModelMediator[];

	private model: any;

	private parent: Component;

	private moduleInstance: Module;

	private decoratorPrefix: string;

	private eventDecoratorPrefix: string;

	private regionPrefix: string;

	constructor(model: any, moduleInstance: Module, prefix: string) {
		this.decoratorPrefix = prefix + "-";
		this.eventDecoratorPrefix = prefix + "-on";
		this.regionPrefix = prefix + "-region";
		this.logger = LoggerFactory.getLogger("Mvvm");
		// TODO: needs to exist a PrefixFactory right here to get values about system prefix
		this.decorators = [];
		this.mediators = [];
		this.model = model;
		this.moduleInstance = moduleInstance;
	}

	public init(el: HTMLElement, parent: Component): void {
		this.el = el;
		this.parent = parent;
		this.populateDecorators();
	}

	public dispose(): void {
		for (const decorator of this.decorators) {
			decorator.dispose();
		}

		this.decorators = [];
		this.parent = null;
	}

	public mediate(expression: string): ModelMediator {
		const mediator: ModelMediator = new ModelMediatorImpl(this.model, expression, Mvvm.getFiltersCode(), Mvvm.getFilters());
		this.mediators.push(mediator);

		return mediator;
	}

	public evaluateModel(): void {
		let remainingEvaluations: number = MAX_EVALUATIONS;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			remainingEvaluations--;

			const changedMediators: ModelMediator[] = [];

			for (const mediator of this.mediators) {
				const changed: boolean = mediator.digest();

				if (changed) {
					changedMediators.push(mediator);
				}
			}

			if (changedMediators.length === 0) {
				pending = false;
				break;
			}

			for (const changedMediator of changedMediators) {
				changedMediator.notifyWatcher();
			}
		}

		if (remainingEvaluations === 0) {
			// TODO - Make this error handling better
			throw new Error("Loop detected in digest cycle.");
		}
	}

	public $apply(fn: Function, args: any[]): any {
		const result: any = fn.apply(this.model, args);
		this.evaluateModel();

		return result;
	}

	private populateDecorators(): void {
		this.processChildren(this.el.children);
		this.processTextChildren(this.el.childNodes);
	}

	private processChildren(children: HTMLCollection): void {
		const EVT_NAME_ERR = "Event expressor \'%eventName%\' MUST correspond to a valid event in the target environment: \'";
		const regex = /^[A-Za-z]+$/;

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const el: Element = children[i];

			this.processChildren(el.children);
			this.processTextChildren(el.childNodes);

			for (const name of el.getAttributeNames()) {
				const expression: string = el.getAttribute(name);
				if (name === (this.regionPrefix)) {
					const region: Region = this.parent.getRegion(expression);
					region.setDefaultEl(el as HTMLElement);
					el.removeAttribute(name);
				} else if (name.indexOf(this.eventDecoratorPrefix) === 0) {
					const eventName: string = name.substr(this.eventDecoratorPrefix.length);
					if (!regex.test(eventName)) {
						throw new MalformedOnEventError(EVT_NAME_ERR, { "%eventName%": eventName });
					}
					this.addEventDecorator(eventName.toLowerCase(), expression, el as HTMLElement);
				} else if (name.indexOf(this.decoratorPrefix) === 0) {
					const decoratorType: string = name.substr(this.decoratorPrefix.length);
					this.addDecorator(el.tagName.toLowerCase(), decoratorType, expression, el as HTMLElement);
					el.removeAttribute(name);
				} else if (expression.length > 4 && expression.indexOf("{{") === 0 && expression.indexOf("}}", expression.length - 2) !== -1) {
					const trimmedExpression: string = expression.substring(2, expression.length - 2);
					this.addAttributeDecorator(name, trimmedExpression, el as HTMLElement);
				}
			}
		}
	}

	private processTextChildren(children: NodeListOf<ChildNode>): void {
		const discoveredNodes: ChildNode[] = [];

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];
			if (Node.TEXT_NODE === child.nodeType) {
				discoveredNodes.push(child);
			}
		}

		for (const node of discoveredNodes) {
			const result: Node[] = this.splitChild(node);

			if (result.length > 1) {
				for (const newNode of result) {
					node.parentNode.insertBefore(newNode, node);
				}

				node.remove();
			}
		}
	}

	private splitChild(node: Node): Node[] {
		const source: string = node.textContent || "";
		const sections: string[] = source.split(/(\{\{|\}\})/);

		if (sections.length < 2) {
			return [node];
		}

		let inside: boolean = false;

		const collected: Node[] = [];

		for (const section of sections) {
			switch (section) {
				case "{{":
					inside = true;
					break;

				case "}}":
					inside = false;
					break;

				default:
					if (inside) {
						const span: HTMLElement = Properties.getWindow().document.createElement("span");
						span.innerHTML = "";
						this.addTextDecorator(section, span);
						collected.push(span);
					} else {
						const textNode: Text = Properties.getWindow().document.createTextNode(section);
						collected.push(textNode);
					}
					break;
			}
		}

		return collected;
	}

	private addTextDecorator(expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Text" };
		const decorator: TextDecorator = new TextDecorator(deps);
		decorator.setModule(this.moduleInstance);
		decorator.init();

		this.decorators.push(decorator);
	}

	private addEventDecorator(eventName: string, expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Event" };
		const decorator: EventDecorator = new EventDecorator(deps);
		decorator.setModule(this.moduleInstance);
		decorator.setEventKey(eventName);
		decorator.init();

		this.decorators.push(decorator);
	}

	private addAttributeDecorator(attributeName: string, expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Event" };
		const decorator: AttributeDecorator = new AttributeDecorator(deps);
		decorator.setModule(this.moduleInstance);
		decorator.setAttributeName(attributeName);
		decorator.init();

		this.decorators.push(decorator);
	}

	private addDecorator(tag: string, decoratorType: string, attributeValue: string, el: HTMLElement): void {
		const tags: { [tag: string]: new () => Decorator<any>; } = Mvvm.factories[decoratorType];
		const prefix: string = "data-p-" + decoratorType + "-";

		let decorator: Decorator<any> = null;

		if (!tags) {
			this.logger.error("Unsupported decorator type: " + decoratorType + ".");
			return;
		}

		let decoratorClass: any = tags[tag];

		if (!decoratorClass) {
			decoratorClass = tags["*"];
		}

		if (!decoratorClass) {
			this.logger.error("Unsupported tag: " + tag + " for decorator " + decoratorType + ".");
			return;
		}

		const deps = { mvvm: this, parent: this.parent, el: el, expression: attributeValue, model: this.model, prefix: prefix };
		decorator = new decoratorClass(deps);
		decorator.setModule(this.moduleInstance);
		decorator.init();

		this.decorators.push(decorator);
	}

}

export {
	Component,
	Decorator,
	Region,
	Mvvm,
	Modules,
	ModuleImpl,
	DecoratorDependencies,
	Properties,
};
