import Tellable from "interface/ables/Tellable";
import Type from "interface/Type";
import SimpleMap from "interface/SimpleMap";
import Register from "registry/Register";
import RegistryImpl from "registry/RegistryImpl";
import ScopeImpl from "scope/ScopeImpl";
import Logger from "log/Logger";
import Scope from "scope/Scope";
import RegistryStrategy from "registry/RegistryStrategy";
import PubSub from "message/PubSub";
import PubSubImpl from "message/PubSubImpl";
import BrokerImpl from "message/BrokerImpl";
import Broker from "message/Broker";

import { MutableProperties } from "properties/Property";
import { defaulted, isDefined, requireNotNull, requireValid, safeCydranDisposal } from "util/Utils";
import { VALID_ID } from "Constants";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import LoggerFactory from "log/LoggerFactory";
import { NamingConflictError } from "error/Errors";
import Behavior from "behavior/Behavior";
import PropertiesImpl from "properties/PropertiesImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import COMPARE from "const/Compare";
import Registry from "registry/Registry";
import MessageCallback from "message/MessageCallback";
import BehaviorsRegistryImpl from "behavior/BehaviorsRegistryImpl";
import { Context, Stage } from "context/Context";
import ComponentOptions from "component/ComponentOptions";

class ContextImpl implements Context, Register, Tellable {

	public static readonly ALIASES: SimpleMap<string> = {};

	private name: string;

	private registry: Registry;

	private broker: Broker;

	private rootScope: ScopeImpl;

	private scope: ScopeImpl;

	private rootProperties: MutableProperties;

	private properties: MutableProperties;

	private logger: Logger;

	private parent: Context;

	private children: SimpleMap<Context>;

	constructor(name?: string, parent?: Context, properties: SimpleMap<any> = {}) {
		this.name = isDefined(name) ? name : "root";
		this.scope = isDefined(parent) ? this.createChildScope(parent.getScope() as ScopeImpl) : this.createRootScope();
		this.properties = isDefined(parent) ? parent.getProperties().extend() : this.createRootProperties(properties);
		this.parent = isDefined(parent) ? parent : null;
		this.children = {};
		this.registry = new RegistryImpl(this);
		this.broker = new BrokerImpl(LoggerFactory.getLogger(`Broker`));
		this.logger = LoggerFactory.getLogger(`Context[${this.name}]`);
	}

	public getStage(): Stage {
		throw new Error("Method not implemented.");
	}

	public configure(callback: (context: Context) => void): Context {
		requireNotNull(callback, "callback");
		callback(this);

		return this;
	}

	public addPreInitializer(callback: (context?: Context) => void): void {
		throw new Error("Method not implemented.");
	}

	public addInitializer(callback: (context?: Context) => void): void {
		throw new Error("Method not implemented.");
	}

	public addDisposer(callback: (context?: Context) => void): void {
		throw new Error("Method not implemented.");
	}

	public registerImplicit(id: string, template: string, options?: ComponentOptions): Context {
		throw new Error("Method not implemented.");
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public sendToParentContext(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public sendToParentContexts(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public sendToChildContexts(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public sendToDescendantContexts(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public toSelf(): void {
		throw new Error("Method not implemented.");
	}

	public toContext(): void {
		throw new Error("Method not implemented.");
	}

	public toParent(): void {
		throw new Error("Method not implemented.");
	}

	public toParents(): void {
		throw new Error("Method not implemented.");
	}

	public toRoot(): void {
		throw new Error("Method not implemented.");
	}

	public toChildren(): void {
		throw new Error("Method not implemented.");
	}

	public toDescendants(): void {
		throw new Error("Method not implemented.");
	}

	public globally(): void {
		throw new Error("Method not implemented.");
	}

	public getRegistry(): Registry {
		return this.registry;
	}

	public removeChild(name: string): Context {
		throw new Error("Method not implemented.");
	}

	public getLogger(): Logger {
		return this.logger;
	}

	public getName(): string {
		return this.name;
	}

	public clear(): Context {
		return this;
	}

	public tell(name: string, payload?: any): void {
		requireNotNull(name, "name");

		switch (name) {
			case "addMessageCallback":
				this.addMessageCallback(defaulted(payload, {}) as MessageCallback);
				break;

			case "removeMessageCallback":
				this.removeMessageCallback(defaulted(payload, {}) as MessageCallback);
				break;
		}
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		// Intentionally do nothing
	}

	public getObject<T>(id: string): T {
		requireValid(id, "id", VALID_ID);

		let result: T = this.registry.getObject(id);

		if (!isDefined(result) && !this.isRoot()) {
			result = this.parent.getObject(id);
		}

		return result;
	}

	// TODO - Guard module names

	public getChild(name: string): Context {
		const child: Context = this.children[name];

		return isDefined(child) ? child : null;
	}

	public isRoot(): boolean {
		return !isDefined(this.parent);
	}

	public getRoot(): Context {
		let current: Context = this;

		while (!current.isRoot()) {
			current = current.getParent();
		}

		return current as Context;
	}

	public getParent(): Context {
		return this.parent;
	}

	public hasChild(name: string): boolean {
		return isDefined(this.children[name]);
	}

	public addChild(name: string, initializer?: (context: Context) => void): Context {
		requireNotNull(name, "name");

		if (isDefined(this.children[name])) {
			throw new NamingConflictError("Child context name already exists: " + name);
		}

		const child: Context = new ContextImpl(name, this);

		this.children[name] = child;

		if (isDefined(initializer)) {
			initializer(child);
		}

		return child;
	}

	public hasRegistration(id: string): boolean {
		return isDefined(this.getObject(id));
	}

	public getLocalObject<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		return this.registry.getObject(id);
	}

	public getScope(): Scope {
		return this.scope;
	}

	public registerConstant(id: string, instance: any): Context {
		requireValid(id, "id", VALID_ID);
		requireNotNull(instance, "instance");
		this.registry.registerConstant(id, instance);
		this.getLogger().ifDebug(() => `Register constant: ${ id }`);
		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Context {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerPrototype(id, classInstance, resolvers);
		this.getLogger().ifDebug(() => `Register prototype: ${ classInstance.name } as "${ id }"`);
		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerPrototypeWithFactory(id, factoryFn, resolvers);
		this.getLogger().ifDebug(() => `Register prototype with factory: ${ id }`);
		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Context {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.registry.registerSingleton(id, classInstance, resolvers);
		this.getLogger().ifDebug(() => `Register singleton: ${ classInstance.name } as "${ id }"`);
		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): any | void {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.registry.registerSingletonWithFactory(id, factoryFn, resolvers);
		this.getLogger().ifDebug(() => `Register singleton with factory: ${ id }`);
		return this;
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		BehaviorsRegistryImpl.register(name, supportedTags, behaviorClass);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public registerBehaviorFunction(name: string, supportedTags: string[],
		behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		BehaviorsRegistryImpl.registerFunction(name, supportedTags, behaviorFunction);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		requireNotNull(strategy, "strategy");
		this.registry.addStrategy(strategy);
		this.getLogger().ifDebug(() => `Add strategy`);
		return this;
	}

	public expose(id: string): Context {
		requireValid(id, "id", VALID_ID);
		ContextImpl.ALIASES[id] = this.name;
		return this;
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public createPubSubFor(targetThis: any): PubSub {
		return new PubSubImpl(targetThis, this);
	}

	public $dispose(): void {
		safeCydranDisposal(this.registry);
	}

	private addMessageCallback(callback: MessageCallback): void {
		this.broker.addMessageCallback(callback);
	}

	private removeMessageCallback(callback: MessageCallback): void {
		this.broker.removeMessageCallback(callback);
	}

	private createChildScope(parentScope: ScopeImpl): ScopeImpl {
		const scope: ScopeImpl = new ScopeImpl();
		scope.setParent(parentScope);

		return scope;
	}

	private createRootProperties(properties: SimpleMap<string>): PropertiesImpl {
		this.rootProperties = new PropertiesImpl();
		this.rootProperties.load(DEFAULT_PROPERTIES_VALUES);
		const childProperties: PropertiesImpl = this.rootProperties.extend() as PropertiesImpl;
		childProperties.load(properties);

		return childProperties;
	}

	private createRootScope(): ScopeImpl {
		this.rootScope = new ScopeImpl();
		this.rootScope.add("compare", COMPARE);
		const scope: ScopeImpl = new ScopeImpl();
		scope.setParent(this.rootScope);

		return scope;
	}

}

export default ContextImpl;
