import Tellable from "interface/ables/Tellable";
import Context from "context/Context";
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
import Dom from "dom/Dom";
import Services from "service/Services";
import LoggerFactory from "log/LoggerFactory";
import { NamingConflictError } from "error/Errors";
import Behavior from "behavior/Behavior";
import PropertiesImpl from "properties/PropertiesImpl";
import ServicesImpl from "service/ServicesImpl";
import DomImpl from "dom/DomImpl";
import DEFAULT_PROPERTIES_VALUES from "SysProps";
import COMPARE from "const/Compare";
import InternalDom from "dom/InternalDom";
import PropertyKeys from 'const/PropertyKeys';
import InternalContext from "context/InternalContext";
import Registry from "registry/Registry";
import MessageCallback from "message/MessageCallback";

class ContextImpl implements InternalContext, Register, Tellable {

	public static readonly ALIASES: SimpleMap<string> = {};

	private name: string;

	private registry: RegistryImpl;

	private broker: Broker;

	private rootScope: ScopeImpl;

	private scope: ScopeImpl;

	private rootproperties: MutableProperties;

	private properties: MutableProperties;

	private services: Services;

	private dom: InternalDom;

	private logger: Logger;

	private parent: Context;

	private children: SimpleMap<Context>;

	constructor(name?: string, parent?: InternalContext, properties: SimpleMap<any> = {}) {
		this.dom = new DomImpl(properties[PropertyKeys.CYDRAN_OVERRIDE_WINDOW]);
		this.name = isDefined(name) ? name : "root";
		this.scope = isDefined(parent) ? this.createChildScope(parent.getScope() as ScopeImpl) : this.createRootScope();
		this.properties = isDefined(parent) ? parent.getProperties().extend() : this.createRootProperties(properties);
		this.parent = isDefined(parent) ? parent : null;
		this.services = isDefined(parent) ? parent.getServices() : new ServicesImpl(this.dom, this.properties);
		this.children = {};
		this.registry = new RegistryImpl(this);
		const lf: LoggerFactory = this.services.logFactory();
		this.broker = new BrokerImpl(lf.getLogger(`Broker`));
		this.logger = lf.getLogger(`Context[${this.name}]`);
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

		return current;
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

	public registerConstantUnguarded(id: string, instance: any): Context {
		requireNotNull(id, "id");
		requireNotNull(instance, "instance");
		this.registry.registerConstantUnguarded(id, instance);
		this.getLogger().ifDebug(() => `Register constant unguarded: ${ id }`);
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
		this.services.getBehaviorsRegistry().register(name, supportedTags, behaviorClass);
		this.getLogger().ifDebug(() => `Registered behavior: ${ name } : ${ supportedTags.toString() }`);
	}

	public registerBehaviorFunction(name: string, supportedTags: string[],
		behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		this.services.getBehaviorsRegistry().registerFunction(name, supportedTags, behavionFunction);
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

	public getServices(): Services {
		return this.services;
	}

	public getDom(): Dom {
		return this.services.getDom();
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
		this.rootproperties = new PropertiesImpl();
		this.rootproperties.load(DEFAULT_PROPERTIES_VALUES);
		const childProperties: PropertiesImpl = this.rootproperties.extend() as PropertiesImpl;
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
