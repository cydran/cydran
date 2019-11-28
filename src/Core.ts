import Digestable from "./Digestable";
import Disposable from "./Disposable";
import MalformedOnEventError from "./error/MalformedOnEventError";
import RegistrationError from "./error/RegistrationError";
import SetComponentError from "./error/SetComponentError";
import TemplateError from "./error/TemplateError";
import UnknownRegionError from "./error/UnknownRegionError";
import Guard from "./Guard";
import GuardGenerator from "./GuardGenerator";
import Logger from "./logger/Logger";
import LoggerFactory from "./logger/LoggerFactory";
import Broker from "./messaging/Broker";
import Listener from "./messaging/Listener";
import PubSub from "./messaging/PubSub";
import ModelMediator from "./ModelMediator";
import ModelMediatorImpl from "./ModelMediatorImpl";
import Module from "./Module";
import ObjectUtils from "./ObjectUtils";
import Properties from "./Properties";
import Register from "./Register";
import { Registry, RegistryImpl } from "./Registry";
import RegistryStrategy from "./RegistryStrategy";
import Scope from "./Scope";
import ScopeImpl from "./ScopeImpl";
import SequenceGenerator from "./SequenceGenerator";

const MAX_EVALUATIONS: number = 10000;

const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";

const Events = {
	AFTER_PARENT_ADDED: "AFTER_PARENT_ADDED",
	AFTER_PARENT_CHANGED: "AFTER_PARENT_CHANGED",
	AFTER_PARENT_REMOVED: "AFTER_PARENT_REMOVED",
	BEFORE_PARENT_ADDED: "BEFORE_PARENT_ADDED",
	BEFORE_PARENT_CHANGED: "BEFORE_PARENT_CHANGED",
	BEFORE_PARENT_REMOVED: "BEFORE_PARENT_REMOVED",
};

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

	private scope: ScopeImpl;

	constructor(name: string, scope?: ScopeImpl) {
		this.name = name;
		this.registry = new RegistryImpl();
		this.broker = new BrokerImpl();
		this.scope = new ScopeImpl();

		if (scope) {
			this.scope.setParent(scope);
		}
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

	public getScope(): Scope {
		return this.scope;
	}

	public registerConstant(id: string, instance: any): Module {
		try {
			this.registry.registerConstant(id, instance);
		} catch (e) {
			this.logError(e);
		}
		return this;
	}

	public registerPrototype(id: string, classInstance: any): Module {
		try {
			this.registry.registerPrototype(id, classInstance);
		} catch (e) {
			this.logError(e);
		}
		return this;
	}

	public registerSingleton(id: string, classInstance: any): Module {
		try {
			this.registry.registerSingleton(id, classInstance);
		} catch (e) {
			this.logError(e);
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
			Modules.modules[name] = new ModuleImpl(name, DEFAULT_MODULE.getScope() as ScopeImpl);
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

	public static getScope(): Scope {
		return this.getDefaultModule().getScope();
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

abstract class Component implements Digestable {

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

	private data: any;

	private componentName: string;

	private id: number;

	private template: string;

	private mvvm: Mvvm;

	private pubSub: PubSub;

	private scope: ScopeImpl;

	private metadata: {
		[id: string]: any;
	};

	private readonly prefix: string;

	private guard: string;

	constructor(componentName: string, template: string, attributePrefix?: string) {
		if (typeof template !== "string") {
			throw new TemplateError("Template must be a non-null string");
		}

		this.parent = null;
		this.prefix = (attributePrefix || "c").toLocaleLowerCase();
		this.componentName = componentName;
		this.template = template.trim();
		this.id = SequenceGenerator.INSTANCE.next();
		this.logger = LoggerFactory.getLogger(componentName + " Component " + this.id);
		this.scope = new ScopeImpl();

		if (this.getModule()) {
			this.scope.setParent(this.getModule().getScope() as ScopeImpl);
		}

		this.init();
		this.mvvm = new Mvvm(this, this.getModule(), this.prefix, this.scope);
		this.regions = {};
		this.pubSub = new PubSub(this, this.getModule());
		this.render();
		this.mvvm.init(this.el, this, (name: string) => this.getRegion(name));
		this.guard = GuardGenerator.INSTANCE.generate();
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

		const parentAdded: boolean = !!(parent !== null && this.parent === null);
		const parentRemoved: boolean = !!(parent === null && this.parent !== null);

		if (parentAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_ADDED, {});
		}

		if (parentRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_REMOVED, {});
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_PARENT_CHANGED, {});
		this.parent = parent;
		this.digest();
		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_CHANGED, {});

		if (parentAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_ADDED, {});
		}

		if (parentRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_PARENT_REMOVED, {});
		}
	}

	public hasRegion(name: string): boolean {
		return ((this.regions[name]) ? true : false);
	}

	public digest(guard?: Guard): void {
		this.$apply(() => {
			// Intentionally do nothing
		}, [], guard);
	}

	public $apply(fn: Function, args: any[], guard?: Guard): void {
		const localGuard: Guard = Guard.down(guard);

		if (localGuard.seen(this.guard)) {
			this.getLogger().debug("Breaking digest loop");
			return;
		}

		localGuard.mark(this.guard);

		this.mvvm.$apply(fn, args, localGuard);
	}

	public setChild(name: string, component: Component): void {
		if (!this.hasRegion(name)) {
			throw new UnknownRegionError("Region \'%rName%\' is unkown and must be declared in component template.", { "%rName%": name });
		}

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
			const error = new SetComponentError("Unable to set component %cName% on region %name%", { "%cName%": componentName, "%name%": name });
			this.getLogger().error(error);
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

	public setData(data: any): void {
		this.data = data;
	}

	public getData(): any {
		return this.data;
	}

	public getPrefix(): string {
		return this.prefix;
	}

	protected getGuard(): string {
		return this.guard;
	}

	protected getScope(): Scope {
		return this.scope;
	}

	protected getRegion(name: string): Region {
		if (!this.regions[name]) {
			this.getLogger().trace("Creating region " + name);
			this.regions[name] = new Region(name, this);
		}

		return this.regions[name];
	}

	protected watch(expression: string, target: (previous: any, current: any) => void): void {
		this.mvvm.mediate(expression).watch(this, target);
	}

	protected withMetadata(name: string, value: any): void {
		this.metadata[name] = value;
	}

	protected listenTo(channel: string, messageName: string, target: Function): void {
		this.pubSub.listenTo(channel, messageName, (payload) => {
			this.$apply(target, [payload]);
		});
	}

	protected listenToFramework(messageName: string, target: Function): void {
		this.listenTo(INTERNAL_CHANNEL_NAME, messageName, target);
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

class RepeatComponent extends Component {

	constructor(componentName: string, template: string, attributePrefix?: string) {
		super(componentName, template, attributePrefix);
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (channelName === INTERNAL_CHANNEL_NAME) {
			if (messageName === "propagateDigest") {
				this.propagateDigest(payload);
			}
		} else {
			super.message(channelName, messageName, payload);
		}
	}

	private propagateDigest(guard: Guard): void {
		const localGuard: Guard = Guard.up(guard);

		if (localGuard.seen(this.getGuard())) {
			this.getLogger().debug("Breaking digest loop");
			return;
		}

		localGuard.mark(this.getGuard());

		if (this.getParent() && localGuard.isPropagateUp()) {
			this.getParent().digest(guard);
		}
	}

}

interface DecoratorDependencies {

	mvvm: Mvvm;

	parent: Component;

	el: HTMLElement;

	expression: string;

	model: any;

	prefix: string;

}

abstract class Decorator<M, E extends HTMLElement> implements Disposable {

	private logger: Logger;

	private el: E;

	private model: any;

	private expression: string;

	private previous: any;

	private value: any;

	private mvvm: Mvvm;

	private parent: Component;

	private moduleInstance: Module;

	private prefix: string;

	private mediator: ModelMediator<M>;

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
		this.el = dependencies.el as E;
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

	protected listenToFramework(messageName: string, target: Function): void {
		this.listenTo(INTERNAL_CHANNEL_NAME, messageName, target);
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
	protected getEl(): E {
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
	protected mediate<T>(expression: string): ModelMediator<T> {
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
	protected getMediator(): ModelMediator<M> {
		return this.mediator;
	}

	/**
	 * [notifyModelInteraction description]
	 */
	protected notifyModelInteraction(): void {
		if (this.mvvm) {
			this.mvvm.digest(null);
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

class TextDecorator extends Decorator<string, HTMLElement> {

	public wire(): void {
		this.getMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		const replacement: string = ObjectUtils.encodeHtml(current);
		this.getEl().innerHTML = replacement;
	}

}

class EventDecorator extends Decorator<any, HTMLElement> {

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

class AttributeDecorator extends Decorator<string, HTMLElement> {

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

	protected onTargetChange(previous: string, current: string): void {
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

	private static factories: {
		[decoratorType: string]: {
			[tag: string]: new () => Decorator<any, HTMLElement>;
		},
	} = {};

	private static filters: {
		[name: string]: Function;
	} = {};

	private logger: Logger;

	private el: HTMLElement;

	private decorators: Array<Decorator<any, HTMLElement>>;

	private mediators: Array<ModelMediatorImpl<any>>;

	private model: any;

	private parent: Component;

	private moduleInstance: Module;

	private decoratorPrefix: string;

	private eventDecoratorPrefix: string;

	private regionPrefix: string;

	private componentPrefix: string;

	private components: Component[];

	private scope: ScopeImpl;

	private regionLookupFn: (name: string) => Region;

	constructor(model: any, moduleInstance: Module, prefix: string, scope: ScopeImpl) {
		this.decoratorPrefix = prefix + ":";
		this.eventDecoratorPrefix = prefix + ":on";
		this.regionPrefix = prefix + ":region";
		this.componentPrefix = prefix + ":component";
		this.logger = LoggerFactory.getLogger("Mvvm");
		this.scope = scope;
		this.decorators = [];
		this.mediators = [];
		this.model = model;
		this.moduleInstance = moduleInstance;
		this.components = [];
	}

	public init(el: HTMLElement, parent: Component, regionLookupFn: (name: string) => Region): void {
		this.el = el;
		this.parent = parent;
		this.regionLookupFn = regionLookupFn;
		this.populateDecorators();
	}

	public dispose(): void {
		for (const decorator of this.decorators) {
			decorator.dispose();
		}

		this.decorators = [];
		this.components = [];

		for (const component of this.components) {
			component.dispose();
		}

		this.parent = null;
	}

	public mediate<T>(expression: string): ModelMediator<T> {
		const mediator: ModelMediator<T> = new ModelMediatorImpl<T>(this.model, expression, this.scope);
		this.mediators.push(mediator as ModelMediatorImpl<any>);

		return mediator;
	}

	public digest(guard: Guard): void {
		let remainingEvaluations: number = MAX_EVALUATIONS;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			remainingEvaluations--;

			const changedMediators: Array<ModelMediator<any>> = [];

			for (const mediator of this.mediators) {
				const changed: boolean = mediator.evaluate(guard);

				if (changed) {
					changedMediators.push(mediator);
				}
			}

			if (changedMediators.length === 0) {
				pending = false;
				break;
			}

			for (const changedMediator of changedMediators) {
				changedMediator.notifyWatcher(guard);
			}
		}

		if (remainingEvaluations === 0) {
			// TODO - Make this error handling better
			throw new Error("Loop detected in digest cycle.");
		}

		this.parent.message(INTERNAL_CHANNEL_NAME, "propagateDigest", guard);

		for (const mediator of this.mediators) {
			mediator.executeCallback(guard);
		}
	}

	public $apply(fn: Function, args: any[], guard?: Guard): any {
		const result: any = fn.apply(this.model, args);
		this.digest(guard);
		return result;
	}

	private populateDecorators(): void {
		const queue: HTMLElement[] = [this.el];

		while (queue.length > 0) {
			this.processChild(queue);
		}
	}

	private processChild(queue: HTMLElement[]): void {
		const el: HTMLElement = queue.pop();
		const EVT_NAME_ERR = "Event expressor \'%eventName%\' MUST correspond to a valid event in the target environment: \'";
		const regex = /^[A-Za-z]+$/;
		const elName: string = el.tagName.toLowerCase();

		if (elName === this.regionPrefix) {
			const regionName: string = el.getAttribute("name");
			const region: Region = this.regionLookupFn(regionName);
			region.setDefaultEl(el as HTMLElement);
			return;
		} else if (elName === this.componentPrefix) {
			const componentName: string = el.getAttribute("name");
			const moduleName: string = el.getAttribute("module");
			const moduleToUse: Module = moduleName ? Modules.getModule(moduleName) : this.moduleInstance;
			const component: Component = (moduleToUse || this.moduleInstance).get(componentName);
			el.parentElement.replaceChild(component.getEl(), el);
			component.setParent(this.parent);
			this.components.push(component);
			return;
		}

		// tslint:disable-next-line
		for (let i = 0; i < el.children.length; i++) {
			queue.push(el.children[i] as HTMLElement);
		}

		this.processTextChildren(el.childNodes);

		for (const name of el.getAttributeNames()) {
			const expression: string = el.getAttribute(name);
			if (name.indexOf(this.eventDecoratorPrefix) === 0) {
				const eventName: string = name.substr(this.eventDecoratorPrefix.length);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(EVT_NAME_ERR, { "%eventName%": eventName });
				}

				this.addEventDecorator(eventName.toLowerCase(), expression, el as HTMLElement);
				el.removeAttribute(name);
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
		const tags: { [tag: string]: new () => Decorator<any, HTMLElement>; } = Mvvm.factories[decoratorType];
		const prefix: string = "data-p-" + decoratorType + "-";

		let decorator: Decorator<any, HTMLElement> = null;

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
	Events,
	RepeatComponent,
	Decorator,
	Mvvm,
	Modules,
	ModuleImpl,
	DecoratorDependencies,
	Properties,
	INTERNAL_CHANNEL_NAME,
};
