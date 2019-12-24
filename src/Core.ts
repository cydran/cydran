import DigestLoopError from "@/error/DigestLoopError";
import SequenceGenerator from "@/SequenceGenerator";
import { ComponentConfig, ComponentConfigBuilder } from "./ComponentConfig";
import { OnContinuation } from "./Continuation";
import Digestable from "./Digestable";
import Disposable from "./Disposable";
import MalformedOnEventError from "./error/MalformedOnEventError";
import RegistrationError from "./error/RegistrationError";
import SelectorError from "./error/SelectorError";
import SetComponentError from "./error/SetComponentError";
import TemplateError from "./error/TemplateError";
import UnknownRegionError from "./error/UnknownRegionError";
import ExternalMediator from "./ExternalMediator";
import Guard from "./Guard";
import GuardGenerator from "./GuardGenerator";
import GuardImpl from "./GuardImpl";
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

const MAX_EVALUATIONS: number = 10000;
const INTERNAL_DIRECT_CHANNEL_NAME: string = "Cydran$$Direct$$Internal$$Channel";
const INTERNAL_CHANNEL_NAME: string = "Cydran$$Internal$$Channel";
const TEXT_NODE_TYPE: number = 3;
const COMPONENT_INTERNALS_FIELD_NAME: string = "____internal$$cydran____";
const MODULE_FIELD_NAME: string = "____internal$$cydran$$module____";

const Events = {
	AFTER_CHILD_ADDED: "AFTER_CHILD_ADDED",
	AFTER_CHILD_CHANGED: "AFTER_CHILD_CHANGED",
	AFTER_CHILD_REMOVED: "AFTER_CHILD_REMOVED",
	AFTER_PARENT_ADDED: "AFTER_PARENT_ADDED",
	AFTER_PARENT_CHANGED: "AFTER_PARENT_CHANGED",
	AFTER_PARENT_REMOVED: "AFTER_PARENT_REMOVED",
	BEFORE_CHILD_ADDED: "BEFORE_CHILD_ADDED",
	BEFORE_CHILD_CHANGED: "BEFORE_CHILD_CHANGED",
	BEFORE_CHILD_REMOVED: "BEFORE_CHILD_REMOVED",
	BEFORE_DISPOSE: "BEFORE_DISPOSE",
	BEFORE_PARENT_ADDED: "BEFORE_PARENT_ADDED",
	BEFORE_PARENT_CHANGED: "BEFORE_PARENT_CHANGED",
	BEFORE_PARENT_REMOVED: "BEFORE_PARENT_REMOVED",
};

const NOOP_FN: () => void = function() {
	// Intentionally do nothing
};

interface SimpleMap<T> {

	[key: string]: T;

}

const DEFAULT_COMPONENT_CONFIG: ComponentConfig = new ComponentConfigBuilder().build();

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
		componentClasses.forEach((componentClass) => {
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
		});

		return this;
	}

	public disassociate(...componentClasses: any[]): Module {
		componentClasses.forEach((componentClass) => {
			componentClass["prototype"][MODULE_FIELD_NAME] = this;
		});

		return this;
	}

	public clear(): Module {
		return this;
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.broker.broadcast(channelName, messageName, payload);
	}

	public message(channelName: string, messageName: string, payload: any): void {
		if (channelName === INTERNAL_DIRECT_CHANNEL_NAME) {
			if (messageName === "addListener") {
				this.addListener(payload as Listener);
			} else if (messageName === "removeListener") {
				this.removeListener(payload as Listener);
			}
		}
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

	private addListener(listener: Listener): void {
		this.broker.addListener(listener);
	}

	private removeListener(listener: Listener): void {
		this.broker.removeListener(listener);
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

	public static registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): void {
		try {
			Mvvm.register(name, supportedTags, elementMediatorClass);
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

class Deferred<S, T> {

	private instance: T;

	private factory: (source: S) => T;

	constructor(factory: (source: S) => T) {
		this.factory = factory;
	}

	public get(source: S): T {
		if (!this.instance) {
			this.instance = this.factory(source);
		}

		return this.instance;
	}

}

interface MetadataContinuation {

	has: (name: string) => boolean;

	get: (name: string) => any;

}

class Component {

	// tslint:disable-next-line
	private ____internal$$cydran____: ComponentInternals;

	// tslint:disable-next-line
	private ____internal$$cydran$$module____: any;

	constructor(template: string, config?: ComponentConfig) {
		this.____internal$$cydran$$init____(template, config);
	}

	public metadata(): MetadataContinuation {
		const internal: ComponentInternals = this.____internal$$cydran____;

		return {
			get: (name: string) => internal.getMetadata(name),
			has: (name: string) => internal.hasMetadata(name),
		};
	}

	public hasRegion(name: string): boolean {
		return this.____internal$$cydran____.hasRegion(name);
	}

	public setChild(name: string, component: Component): void {
		this.____internal$$cydran____.setChild(name, component);
	}

	public setChildFromRegistry(name: string, componentName: string, defaultComponentName?: string): void {
		this.____internal$$cydran____.setChildFromRegistry(name, componentName, defaultComponentName);
	}

	public message(channelName: string, messageName: string, payload: any): void {
		this.____internal$$cydran____.message(channelName, messageName, payload);
	}

	public dispose(): void {
		this.____internal$$cydran____.dispose();
	}

	public getParent(): Component {
		return this.____internal$$cydran____.getParent();
	}

	public getEl(): HTMLElement {
		return this.____internal$$cydran____.getEl();
	}

	public get<T>(id: string): T {
		return this.____internal$$cydran____.get(id);
	}

	public scope(): Scope {
		return this.____internal$$cydran____.getScope();
	}

	public reset(): void {
		this.init();
	}

	protected init(): void {
		// Intentionally do nothing by default
	}

	protected getItem<T>(): T {
		return this.____internal$$cydran____.getData() as T;
	}

	protected getExternals<T>(): T {
		return this.____internal$$cydran____.getExternalCache() as T;
	}

	protected broadcast(channelName: string, messageName: string, payload: any): void {
		this.____internal$$cydran____.broadcast(channelName, messageName, payload);
	}

	protected broadcastGlobally(channelName: string, messageName: string, payload: any): void {
		this.____internal$$cydran____.broadcastGlobally(channelName, messageName, payload);
	}

	protected $apply(fn: Function, args: any[]): void {
		this.____internal$$cydran____.$apply(fn, args);
	}

	protected watch(expression: string, target: (previous: any, current: any) => void): void {
		this.____internal$$cydran____.watch(expression, target);
	}

	protected on(messageName: string): OnContinuation {
		return {
			forChannel: (channel: string) => {
				return {
					invoke: (target: (payload: any) => void) => {
						this.____internal$$cydran____.on(target, messageName, channel);
					},
				};
			},
			invoke: (target: (payload: any) => void) => {
				this.____internal$$cydran____.on(target, messageName, INTERNAL_CHANNEL_NAME);
			},
		};
	}

	protected getLogger(): Logger {
		return this.____internal$$cydran____.getLogger();
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this.____internal$$cydran____ = new ComponentInternals(this, template, config);
		this.____internal$$cydran____.init();
	}

}

Component["prototype"][MODULE_FIELD_NAME] = DEFAULT_MODULE;

interface ComponentFlags {

	repeatable: boolean;

}

interface ExternalAttributeDetail {

	attributeName: string;

	expression: string;

}

class ComponentInternals implements Digestable {

	private flags: ComponentFlags;

	private component: Component;

	private logger: Logger;

	private el: HTMLElement;

	private regions: { [id: string]: Region; };

	private parent: Component;

	private data: any;

	private id: number;

	private template: string;

	private mvvm: Mvvm;

	private pubSub: PubSub;

	private scope: ScopeImpl;

	private parentScope: ScopeImpl;

	private externalCache: any;

	private externalMediators: SimpleMap<ExternalMediator<any>>;

	private externalFields: SimpleMap<string>;

	private readonly prefix: string;

	private guard: string;

	private config: ComponentConfig;

	constructor(component: Component, template: string, config: ComponentConfig) {
		if (typeof template !== "string") {
			throw new TemplateError("Template must be a non-null string");
		}

		this.config = config || DEFAULT_COMPONENT_CONFIG;

		this.guard = GuardGenerator.INSTANCE.generate();
		this.id = SequenceGenerator.INSTANCE.next();
		this.logger = LoggerFactory.getLogger(component.constructor.name + " Component " + this.id);
		this.parent = null;
		this.component = component;
		this.prefix = this.config.getPrefix().toLowerCase();
		this.template = template.trim();
		this.scope = new ScopeImpl();
		this.externalMediators = {};
		this.externalCache = {};
		this.externalFields = {};

		const effectiveExternalAttributes: string[] = this.config.getAttributes();

		for (const attribute of effectiveExternalAttributes) {
			this.externalize(attribute);
		}

		this.flags = {
			repeatable: false,
		};

		if (this.getModule()) {
			this.scope.setParent(this.getModule().getScope() as ScopeImpl);
		}

		this.regions = {};
		this.pubSub = new PubSub(this.component, this.getModule());
	}

	public init() {
		this.component.reset();
		this.mvvm = new Mvvm(this.component, this.getModule(), this.prefix, this.scope);
		this.render();
		this.mvvm.init(this.el, this, (name: string) => this.getRegion(name));
	}

	public hasMetadata(name: string): boolean {
		return this.getMetadata(name) ? true : false;
	}

	public getMetadata(name: string): any {
		return this.config.getMetadata(name);
	}

	public hasRegion(name: string): boolean {
		return ((this.regions[name]) ? true : false);
	}

	public $apply(fn: Function, args: any[], guard?: Guard): void {
		const localGuard: GuardImpl = GuardImpl.down(guard) as GuardImpl;

		if (localGuard.seen(this.guard)) {
			this.getLogger().trace("Breaking digest loop");
			return;
		}

		localGuard.mark(this.guard);

		this.mvvm.$apply(fn, args, localGuard);
	}

	public setChild(name: string, component: Component): void {
		if (!this.hasRegion(name)) {
			throw new UnknownRegionError("Region \'%rName%\' is unkown and must be declared in component template.", { "%rName%": name });
		}

		const hasComponent: boolean = this.getRegion(name).hasComponent();

		const childAdded: boolean = !!(component !== null && !hasComponent);
		const childRemoved: boolean = !!(component === null && hasComponent);

		if (childAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_ADDED, {
				name: name,
			});
		}

		if (childRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_REMOVED, {
				name: name,
			});
		}

		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_CHILD_CHANGED, {
			name: name,
		});

		this.getRegion(name).setComponent(component);

		this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_CHANGED, {
			name: name,
		});

		if (childAdded) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_ADDED, {
				name: name,
			});
		}

		if (childRemoved) {
			this.message(INTERNAL_CHANNEL_NAME, Events.AFTER_CHILD_REMOVED, {
				name: name,
			});
		}
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
		if (channelName === INTERNAL_DIRECT_CHANNEL_NAME) {
			if (messageName === "propagateDigest") {
				if (this.flags.repeatable) {
					this.propagateDigest(payload);
				}
			} else if (messageName === "setMode") {
				switch (payload) {
					case "repeatable":
						this.flags.repeatable = true;
						break;

					default:
						this.flags.repeatable = false;
				}
			} else if (messageName === "digest") {
				this.digest(payload as Guard);
			} else if (messageName === "setParent") {
				this.setParent(payload as Component);
			} else if (messageName === "setParentScope") {
				this.setParentScope(payload as ScopeImpl);
			} else if (messageName === "setData") {
				this.setData(payload);
			} else if (messageName === "addExternalAttribute") {
				this.addExternalAttribute(payload as ExternalAttributeDetail);
			}
		} else {
			this.pubSub.message(channelName, messageName, payload);
		}
	}

	public broadcast(channelName: string, messageName: string, payload: any): void {
		this.getModule().broadcast(channelName, messageName, payload);
	}

	public broadcastGlobally(channelName: string, messageName: string, payload: any): void {
		Modules.broadcast(channelName, messageName, payload);
	}

	public dispose(): void {
		this.message(INTERNAL_CHANNEL_NAME, Events.BEFORE_DISPOSE, {});
		this.pubSub.dispose();
		this.parent = null;
		this.parentScope = null;
		this.scope = null;
	}

	public getId(): number {
		return this.id;
	}

	public getEl(): HTMLElement {
		return this.el;
	}

	public getComponent(): Component {
		return this.component;
	}

	public get<T>(id: string): T {
		return this.getModule().get(id);
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public getScope(): Scope {
		return this.scope;
	}

	public watch(expression: string, target: (previous: any, current: any) => void): void {
		this.mvvm.mediate(expression).watch(this, target);
	}

	public on(target: (payload: any) => void, messageName: string, channel?: string): void {
		const targetChannel: string = channel || INTERNAL_CHANNEL_NAME;

		this.pubSub.on(messageName).forChannel(targetChannel).invoke((payload: any) => {
			this.$apply(target, [payload]);
		});
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public getModule(): Module {
		return this.component[MODULE_FIELD_NAME] as Module;
	}

	public getParent(): Component {
		return this.parent;
	}

	public setData(data: any): void {
		this.data = data;
	}

	public getData(): any {
		return this.data;
	}

	public importExternals(): void {
		this.externalCache = {};

		for (const key in this.externalMediators) {
			if (this.externalMediators.hasOwnProperty(key)) {
				const mediator: ExternalMediator<any> = this.externalMediators[key];
				this.externalCache[key] = mediator.get(this.parentScope);
			}
		}
	}

	public exportExternals(): void {
		for (const key in this.externalMediators) {
			if (this.externalMediators.hasOwnProperty(key)) {
				const mediator: ExternalMediator<any> = this.externalMediators[key];
				mediator.set(this.parentScope, this.externalCache[key]);
			}
		}

		this.externalCache = {};
	}

	public getExternalCache(): any {
		return this.externalCache;
	}

	protected getGuard(): string {
		return this.guard;
	}

	protected getRegion(name: string): Region {
		if (!this.regions[name]) {
			this.getLogger().trace("Creating region " + name);
			this.regions[name] = new Region(name, this);
		}

		return this.regions[name];
	}

	protected getTemplate(): string {
		return this.template;
	}

	protected render(): void {
		this.getLogger().trace("Rendering");
		const templateEl: HTMLTemplateElement = Properties.getWindow().document.createElement("template");
		templateEl.insertAdjacentHTML("afterbegin", this.template.trim());
		const count: number = templateEl.childElementCount;

		if (count !== 1) {
			const parmObj = { "%count%": "" + count, "%template%": this.template };
			const errmsg = "Component template must have a single top level element, but had %count% top level elements:\n\n%template%\n\n";
			const error = new TemplateError(errmsg, parmObj);
			this.getLogger().fatal(error);
			throw error;
		}

		this.el = templateEl.firstElementChild as HTMLElement;
	}

	protected setEl(el: HTMLElement): void {
		this.el = el;
	}

	private externalize(name: string): void {
		const key: string = name.toLowerCase();
		const value: string = key;

		// TODO - add guard code
		this.externalFields[key] = value;
	}

	private addExternalAttribute(detail: ExternalAttributeDetail): void {
		const fieldName: string = this.externalFields[detail.attributeName];

		if (fieldName) {
			this.externalMediators[fieldName] = new ExternalMediator(detail.expression);
		}
	}

	private setParentScope(scope: ScopeImpl): void {
		this.parentScope = scope;
	}

	private setParent(parent: Component): void {
		if (parent === null) {
			this.pubSub.message(INTERNAL_DIRECT_CHANNEL_NAME, "disableGlobal", {});
			this.getLogger().trace("Clearing parent view");
		} else {
			this.pubSub.message(INTERNAL_DIRECT_CHANNEL_NAME, "enableGlobal", {});
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

	private digest(guard?: Guard): void {
		this.$apply(() => {
			// Intentionally do nothing
		}, [], guard);
	}

	private propagateDigest(guard: Guard): void {
		const localGuard: GuardImpl = GuardImpl.up(guard) as GuardImpl;

		if (localGuard.seen(this.getGuard())) {
			this.getLogger().trace("Breaking digest loop");
			return;
		}

		localGuard.mark(this.getGuard());

		if (this.getParent() && localGuard.isPropagateUp()) {
			this.getParent().message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", guard);
		} else {
			this.getLogger().trace("Not propagating to parent");
		}
	}

}

class StageComponentInternals extends ComponentInternals {

	protected render(): void {
		const elements: NodeListOf<HTMLElement> = Properties.getWindow().document.querySelectorAll(this.getTemplate());
		const eLength = ((elements) ? elements.length : 0);
		const errMsg = (eLength !== 1) ? "CSS selector MUST identify single HTMLElement: '%pattern%' - %qty% found" : null;

		if (errMsg) {
			const patSubObj = { "%pattern%": this.getTemplate(), "%qty%": eLength };
			const error: SelectorError = new SelectorError(errMsg, patSubObj);
			this.getLogger().fatal(error);
			throw error;
		}

		const element: HTMLElement = elements[0];

		while (element.hasChildNodes()) {
			element.removeChild(element.firstChild);
		}

		const regionDiv: HTMLElement = Properties.getWindow().document.createElement("c:region");
		regionDiv.setAttribute("name", "body");
		element.appendChild(regionDiv);
		this.setEl(element);
	}

}

class StageComponent extends Component {

	constructor(selector: string) {
		super(selector);
	}

	public setComponent(component: Component): StageComponent {
		this.setChild("body", component);

		return this;
	}

	protected ____internal$$cydran$$init____(template: string, config: ComponentConfig): void {
		this[COMPONENT_INTERNALS_FIELD_NAME] = new StageComponentInternals(this, template, config);
		this[COMPONENT_INTERNALS_FIELD_NAME]["init"]();
	}
}

StageComponent["prototype"][MODULE_FIELD_NAME] = DEFAULT_MODULE;

interface ElementMediatorDependencies {

	mvvm: Mvvm;

	parent: ComponentInternals;

	el: HTMLElement;

	expression: string;

	model: any;

	prefix: string;

}

abstract class ElementMediator<M, E extends HTMLElement> implements Disposable {

	private logger: Logger;

	// tslint:disable-next-line
	private ____internal$$cydran____: ElementMediatorDependencies;

	private moduleInstance: Module;

	private mediator: ModelMediator<M>;

	private pubSub: PubSub;

	private domListeners: {
		[name: string]: any;
	};

	constructor(dependencies: any) {
		this.logger = LoggerFactory.getLogger("ElementMediator: " + dependencies.prefix);
		this.____internal$$cydran____ = dependencies;
		this.domListeners = {};
		this.pubSub = new PubSub(this, this.getModule());
	}

	/**
	 * Dispose of ElementMediator when released.
	 * + All event listeners will be removed.
	 * + This element mediator will be unwired from any other DOM entanglements
	 * + The mediator reference to the model is released/nulled
	 * + Any value representation of this element mediator is released/nulled
	 * + The [[Mvvm|mvvm]] refernce is released/nulled
	 * + The parental reference is released/nulled
	 */
	public dispose(): void {
		this.removeDomListeners();
		this.unwire();
		this.____internal$$cydran____ = null;
		this.mediator = null;
	}

	/**
	 * Initialize this element mediator.
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

	protected listenTo(channel: string, messageName: string, target: (payload: any) => void): void {
		this.pubSub.on(messageName).forChannel(channel).invoke((payload: any) => {
			target.apply(this, [payload]);
		});
	}

	protected listenToFramework(messageName: string, target: (payload: any) => void): void {
		this.listenTo(INTERNAL_CHANNEL_NAME, messageName, target);
	}

	protected bridge(name: string): void {
		const listener = (event: Event) => {
			this.message("dom", name, event);
		};

		if (!this.domListeners[name]) {
			this.domListeners[name] = listener;
			this.getEl().addEventListener(name, listener, false);
		}
	}

	/**
	 * Get the associated {HTMLElement html element} of this element mediator.
	 * @return {HTMLElement} [description]
	 */
	protected getEl(): E {
		return this.____internal$$cydran____.el as E;
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
		return this.____internal$$cydran____.mvvm.mediate(expression);
	}

	/**
	 * [getModel description]
	 * @return {any} [description]
	 */
	protected getModel(): any {
		return this.____internal$$cydran____.model;
	}

	/**
	 * [getParent description]
	 * @return {Component} [description]
	 */
	protected getParent(): Component {
		return this.____internal$$cydran____.parent.getComponent();
	}

	/**
	 * [getMediator description]
	 * @return {ModelMediator} [description]
	 */
	protected getModelMediator(): ModelMediator<M> {
		return this.mediator;
	}

	protected $apply(fn: Function, args: any[], guard?: Guard): any {
		if (this.____internal$$cydran____ && this.____internal$$cydran____.mvvm) {
			this.____internal$$cydran____.mvvm.$apply(fn, args, guard);
		}
	}

	/**
	 * Get the expression specified
	 * @return {string} [description]
	 */
	protected getExpression(): string {
		return this.____internal$$cydran____.expression;
	}

	/**
	 * Gets the logger.
	 * @return {Logger} logger instance
	 */
	protected getLogger(): Logger {
		return this.logger;
	}

	/**
	 * Wire the element mediator
	 */
	protected abstract wire(): void;

	/**
	 * Unwire the element mediator
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

	private parent: ComponentInternals;

	private name: string;

	constructor(name: string, parent: ComponentInternals) {
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
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		} else if (component === null && this.component !== null) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			const oldComponentEl: HTMLElement = this.component.getEl();
			this.component = null;
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(this.defaultEl, oldComponentEl);
		} else if (component !== null && this.component !== null) {
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", null);
			const newComponentEl: HTMLElement = component.getEl();
			const oldComponentEl: HTMLElement = this.component.getEl();
			const parentElement: HTMLElement = oldComponentEl.parentElement;
			parentElement.replaceChild(newComponentEl, oldComponentEl);
			this.component = component;
			this.component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
		}
	}

	public hasComponent(): boolean {
		return !!this.component;
	}

	public dispose() {
		if (this.component) {
			this.component.dispose();
		}

		this.setComponent(null);
	}

}

class TextElementMediator extends ElementMediator<string, HTMLElement> {

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
	}

	public unwire(): void {
		// Intentionally do nothing
	}

	protected onTargetChange(previous: any, current: any): void {
		const replacement: string = ObjectUtils.encodeHtml(current);
		this.getEl().innerHTML = replacement;
	}

}

class EventElementMediator extends ElementMediator<any, HTMLElement> {

	private eventKey: string;

	public unwire(): void {
		// Intentionally do nothing
	}

	public handleEvent(event: Event): void {
		this.$apply(() => {
			this.getModelMediator().invoke(event);
		}, [event], null);
	}

	public wire(): void {
		this.bridge(this.eventKey);
		this.listenTo("dom", this.eventKey, this.handleEvent);
	}

	public setEventKey(eventKey: string): void {
		this.eventKey = eventKey;
	}

}

class AttributeElementMediator extends ElementMediator<string, HTMLElement> {

	private attributeName: string;

	public wire(): void {
		this.getModelMediator().watch(this, this.onTargetChange);
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

	public static register(name: string, supportedTags: string[], elementMediatorClass: any): void {
		if (!Mvvm.factories[name]) {
			Mvvm.factories[name] = {};
		}

		for (const supportedTag of supportedTags) {
			Mvvm.factories[name][supportedTag] = elementMediatorClass;
		}
	}

	private static factories: {
		[elementMediatorType: string]: {
			[tag: string]: new () => ElementMediator<any, HTMLElement>;
		},
	} = {};

	private logger: Logger;

	private el: HTMLElement;

	private elementMediators: Array<ElementMediator<any, HTMLElement>>;

	private mediators: Array<ModelMediatorImpl<any>>;

	private model: any;

	private parent: ComponentInternals;

	private moduleInstance: Module;

	private elementMediatorPrefix: string;

	private eventElementMediatorPrefix: string;

	private externalAttributePrefix: string;

	private regionPrefix: string;

	private componentPrefix: string;

	private components: Component[];

	private scope: ScopeImpl;

	private regionLookupFn: (name: string) => Region;

	constructor(model: any, moduleInstance: Module, prefix: string, scope: ScopeImpl) {
		this.elementMediatorPrefix = prefix + ":";
		this.eventElementMediatorPrefix = prefix + ":on";
		this.externalAttributePrefix = prefix + ":property-";
		this.regionPrefix = prefix + ":region";
		this.componentPrefix = prefix + ":component";
		this.logger = LoggerFactory.getLogger("Mvvm");
		this.scope = new ScopeImpl(false);
		this.scope.setParent(scope);
		this.elementMediators = [];
		this.mediators = [];
		this.model = model;
		this.moduleInstance = moduleInstance;
		this.components = [];
		this.scope.add("m", () => this.model);
		this.scope.add("model", () => this.model);
		this.scope.add("i", () => this.parent.getData());
		this.scope.add("item", () => this.parent.getData());
		this.scope.add("p", () => this.parent.getComponent().getParent());
		this.scope.add("parent", () => this.parent.getComponent().getParent());
		this.scope.add("e", () => this.parent.getExternalCache());
		this.scope.add("external", () => this.parent.getExternalCache());
	}

	public init(el: HTMLElement, parent: ComponentInternals, regionLookupFn: (name: string) => Region): void {
		this.el = el;
		this.parent = parent;
		this.regionLookupFn = regionLookupFn;
		this.populateElementMediators();
	}

	public dispose(): void {
		for (const elementMediator of this.elementMediators) {
			elementMediator.dispose();
		}

		this.elementMediators = [];
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
		const localGuardDown: GuardImpl = GuardImpl.down(guard) as GuardImpl;

		let remainingEvaluations: number = MAX_EVALUATIONS;
		let pending: boolean = true;

		while (pending && remainingEvaluations > 0) {
			remainingEvaluations--;

			const changedMediators: Array<ModelMediator<any>> = [];

			for (const mediator of this.mediators) {
				const changed: boolean = mediator.evaluate(localGuardDown);

				if (changed) {
					changedMediators.push(mediator);
				}
			}

			if (changedMediators.length === 0) {
				pending = false;
				break;
			}

			for (const changedMediator of changedMediators) {
				changedMediator.notifyWatcher(localGuardDown);
			}
		}

		if (remainingEvaluations === 0) {
			// TODO - Make this error handling better
			throw new DigestLoopError("Loop detected in digest cycle.");
		}

		for (const mediator of this.mediators) {
			mediator.executeCallback(localGuardDown);
		}
	}

	public $apply(fn: Function, args: any[], guard?: Guard): any {
		const localGuardUp: GuardImpl = GuardImpl.up(guard) as GuardImpl;
		let result: any = null;

		this.parent.importExternals();

		try {
			result = fn.apply(this.model, args);
			this.digest(guard);
		} finally {
			this.parent.exportExternals();
		}

		this.parent.message(INTERNAL_DIRECT_CHANNEL_NAME, "propagateDigest", localGuardUp);

		for (const component of this.components) {
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "digest", guard);
		}

		return result;
	}

	private populateElementMediators(): void {
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

			for (let i = el.attributes.length - 1; i >= 0; i--) {
				const attributeName: string = el.attributes[i].name.toLowerCase();
				const attributeValue: string = el.attributes[i].value;

				if (attributeName.indexOf(this.externalAttributePrefix) === 0) {
					const propertyName: string = attributeName.substr(this.externalAttributePrefix.length);
					const detail: ExternalAttributeDetail = {
						attributeName: propertyName,
						expression: attributeValue,
					};

					component.message(INTERNAL_DIRECT_CHANNEL_NAME, "addExternalAttribute", detail);
				}
			}

			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParentScope", this.scope);
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setParent", this.parent.getComponent());
			component.message(INTERNAL_DIRECT_CHANNEL_NAME, "setMode", "repeatable");
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
			if (name.indexOf(this.eventElementMediatorPrefix) === 0) {
				const eventName: string = name.substr(this.eventElementMediatorPrefix.length);

				if (!regex.test(eventName)) {
					throw new MalformedOnEventError(EVT_NAME_ERR, { "%eventName%": eventName });
				}

				this.addEventElementMediator(eventName.toLowerCase(), expression, el as HTMLElement);
				el.removeAttribute(name);
			} else if (name.indexOf(this.elementMediatorPrefix) === 0) {
				const elementMediatorType: string = name.substr(this.elementMediatorPrefix.length);
				this.addElementMediator(el.tagName.toLowerCase(), elementMediatorType, expression, el as HTMLElement);
				el.removeAttribute(name);
			} else if (expression.length > 4 && expression.indexOf("{{") === 0 && expression.indexOf("}}", expression.length - 2) !== -1) {
				const trimmedExpression: string = expression.substring(2, expression.length - 2);
				this.addAttributeElementMediator(name, trimmedExpression, el as HTMLElement);
			}
		}
	}

	private processTextChildren(children: NodeListOf<ChildNode>): void {
		const discoveredNodes: ChildNode[] = [];

		// tslint:disable-next-line
		for (let i = 0; i < children.length; i++) {
			const child: ChildNode = children[i];

			if (TEXT_NODE_TYPE === child.nodeType) {
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
						this.addTextElementMediator(section, span);
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

	private addTextElementMediator(expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Text" };
		const elementMediator: TextElementMediator = new TextElementMediator(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

	private addEventElementMediator(eventName: string, expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Event" };
		const elementMediator: EventElementMediator = new EventElementMediator(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.setEventKey(eventName);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

	private addAttributeElementMediator(attributeName: string, expression: string, el: HTMLElement): void {
		const deps = { mvvm: this, parent: this.parent, el: el, expression: expression, model: this.model, prefix: "Event" };
		const elementMediator: AttributeElementMediator = new AttributeElementMediator(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.setAttributeName(attributeName);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

	private addElementMediator(tag: string, elementMediatorType: string, attributeValue: string, el: HTMLElement): void {
		const tags: { [tag: string]: new () => ElementMediator<any, HTMLElement>; } = Mvvm.factories[elementMediatorType];
		const prefix: string = "data-p-" + elementMediatorType + "-"; // TODO - Determine if this is still correct

		let elementMediator: ElementMediator<any, HTMLElement> = null;

		if (!tags) {
			this.logger.error("Unsupported elementMediator type: " + elementMediatorType + ".");
			return;
		}

		let elementMediatorClass: any = tags[tag];

		if (!elementMediatorClass) {
			elementMediatorClass = tags["*"];
		}

		if (!elementMediatorClass) {
			this.logger.error("Unsupported tag: " + tag + " for elementMediator " + elementMediatorType + ".");
			return;
		}

		const deps = { mvvm: this, parent: this.parent, el: el, expression: attributeValue, model: this.model, prefix: prefix };
		elementMediator = new elementMediatorClass(deps);
		elementMediator.setModule(this.moduleInstance);
		elementMediator.init();

		this.elementMediators.push(elementMediator);
	}

}

export {
	Component,
	Events,
	ElementMediator,
	Mvvm,
	StageComponent,
	Modules,
	ModuleImpl,
	ElementMediatorDependencies,
	Properties,
	INTERNAL_CHANNEL_NAME,
	INTERNAL_DIRECT_CHANNEL_NAME,
};
