import PropertyKeys from "const/PropertyKeys";
import Context from "context/Context";
import InternalDom from "dom/InternalDom";
import SimpleMap from "interface/SimpleMap";
import { MutableProperties } from "properties/Property";
import DomImpl from 'dom/DomImpl';
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import ScopeImpl from "scope/ScopeImpl";
import COMPARE from "const/Compare";
import ServicesImpl from "service/ServicesImpl";
import Services from "service/Services";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Type from "interface/Type";
import Logger from "log/Logger";
import PubSub from "message/PubSub";
import RegistryStrategy from "registry/RegistryStrategy";
import Scope from "scope/Scope";
import { requireNotNull, defaultAsNull, isDefined, forEachField } from 'util/Utils';
import { NamingConflictError, UnknownContextError } from "error/Errors";
import InternalContext from "context/InternalContext";
import Registry from "registry/Registry";
import RegistryImpl from "registry/RegistryImpl";
import Behavior from "behavior/Behavior";

abstract class AbstractContextImpl implements InternalContext {

	private name: string;

	private children: SimpleMap<Context>;

	private logger: Logger;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
		this.children = {};
	}

	// -----------------------------------------------------------

	public abstract getRoot(): Context;

	public abstract isRoot(): boolean;

	public abstract getParent(): Context;

	public abstract getServices(): Services;

	public abstract getProperties(): MutableProperties;

	public abstract getScope(): Scope;

	public abstract getRegistry(): Registry;

	public getName(): string {
		return this.name;
	}

	public getChild(name: string): Context {
		return defaultAsNull(this.children[name]);
	}

	public hasChild(name: string): boolean {
		return isDefined(this.children[name]);
	}

	public addchild(name: string, initializer?: (context: Context) => void): Context {
		requireNotNull(name, "name");

		if (isDefined(this.children[name])) {
			throw new NamingConflictError("Child context name already exists: " + name);
		}

		const child: Context = new ChildContextImpl(name, this);

		this.children[name] = child;

		if (isDefined(initializer)) {
			initializer(child);
		}

		return child;
	}

	public removeChild(name: string): void {
		if (!this.hasChild(name)) {
			throw new UnknownContextError("Unknown child context: " + name);
		}

		const child: Context = this.getChild(name);
		child.$dispose();

		delete this.children[name];
	}

	public getLogger(): Logger {
		if (!isDefined(this.logger)) {
			this.logger = this.getServices().logFactory().getLogger(this.name);
		}

		return this.logger;
	}

	public $dispose(): void {
		forEachField(this.children, (key, child: Context) => {
			child.$dispose();
		});

		this.children = {};
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		// TODO - Implement
		throw new Error("Method not implemented.");
	}

	public broadcast(channelName: string, messageName: string, payload?: any): void {
		// TODO - Implement
		throw new Error("Method not implemented.");
	}

	public broadcastGlobally(channelName: string, messageName: string, payload?: any): void {
		// TODO - Implement
		throw new Error("Method not implemented.");
	}

	public getObject<T>(id: string): T {
		return this.getRegistry().getObject(id);
	}

	public getLocalObject<T>(id: string): T {
		return this.getRegistry().getLocalObject(id);
	}

	public hasRegistration(id: string): boolean {
		return this.getRegistry().hasRegistration(id);
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		this.getRegistry().addStrategy(strategy);

		return this;
	}

	public expose(id: string): Context {
		// TODO - Implement
		throw new Error("Method not implemented.");
	}

	public createPubSubFor(targetThis: any): PubSub {
		// TODO - Implement
		throw new Error("Method not implemented.");
	}

	public registerConstant(id: string, instance: any): Context {
		this.getRegistry().registerConstant(id, instance);

		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerPrototype(id, classInstance, resolvers);

		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerPrototypeWithFactory(id, factoryFn, resolvers);

		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerSingleton(id, classInstance, resolvers);

		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Context {
		this.getRegistry().registerSingletonWithFactory(id, factoryFn, resolvers);

		return this;
	}

	public registerConstantUnguarded(id: string, instance: any): Context {
		this.getRegistry().registerConstantUnguarded(id, instance);

		return this;
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.getServices().getBehaviorsRegistry().register(name, supportedTags, behaviorClass);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public registerBehaviorFunction(
		name: string,
		supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>
	): void {
		this.getServices().getBehaviorsRegistry().registerFunction(name, supportedTags, behavionFunction);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public tell(name: string, payload?: any): void {
		// TODO - Implement
		throw new Error("Method not implemented.");
	}

}

class ChildContextImpl extends AbstractContextImpl {

	private parent: Context;

	private root: Context;

	private properties: MutableProperties;

	private scope: Scope;

	private registry: Registry;

	constructor(name: string, parent: InternalContext) {
		super(name);
		this.parent = requireNotNull(parent, "parent");
		this.root = parent.getRoot();
		this.properties = parent.getProperties().extend();
		this.scope = parent.getScope().extend();
		this.registry = parent.getRegistry().extend();
	}

	public getParent(): Context {
		return this.parent;
	}

	public isRoot(): boolean {
		return false;
	}

	public getRoot(): Context {
		return this.root;
	}

	public getServices(): Services {
		return (this.getRoot() as InternalContext).getServices();
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public getScope(): Scope {
		return this.scope;
	}

	public getRegistry(): Registry {
		return this.registry;
	}

}

class RootContextImpl extends AbstractContextImpl {

	private dom: InternalDom;

	private properties: MutableProperties;

	private scope: ScopeImpl;

	private services: Services;

	private registry: Registry;

	constructor(properties: SimpleMap<any> = {}) {
		super("root");
		const windowInstance: Window = properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW];
		this.dom = new DomImpl(windowInstance);
		this.scope = new ScopeImpl()
			.add("compare", COMPARE)
			.extend() as ScopeImpl;
		this.properties = new PropertiesImpl()
			.load(DEFAULT_PROPERTIES_VALUES)
			.extend()
			.load(properties);
		this.services = new ServicesImpl(this.dom, this.properties);
		this.registry = new RegistryImpl(this);
	}

	public getParent(): Context {
		return this;
	}

	public isRoot(): boolean {
		return true;
	}

	public getRoot(): Context {
		return this;
	}

	public getServices(): Services {
		return this.services;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public getScope(): Scope {
		return this.scope;
	}

	public getRegistry(): Registry {
		return this.registry;
	}

}

export default RootContextImpl;
