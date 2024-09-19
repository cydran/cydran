import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import ArgumentsResolversImpl from 'argument/ArgumentsResolversImpl';
import ConstantArgumentResolver from 'argument/resolver/ConstantArgumentResolver';
import ImplicitConfigurationArgumentResolver from 'argument/resolver/ImplicitConfigurationArgumentResolver';
import Component from 'component/Component';
import ComponentOptions from 'component/ComponentOptions';
import { Context } from 'context/Context';
import Type from 'interface/Type';
import PubSub from 'message/PubSub';
import { MutableProperties } from 'properties/Property';
import Registry from 'registry/Registry';
import RegistryStrategy from 'registry/RegistryStrategy';
import Scope from 'scope/Scope';
import { requireNotNull, requireValid } from 'util/Utils';
import PathResolver from 'context/PathResolver';
import PathResolverImpl from 'context/PathResolverImpl';
import Broker from 'message/Broker';
import BrokerImpl from 'message/BrokerImpl';
import MessageCallback from 'message/MessageCallback';
import LoggerAlternativeImpl from 'log/LoggerAlternativeImpl';
import argumentsBuilder from 'function/argumentsBuilder';
import { CONTEXT_NAME, OBJECT_ID, REQUESTABLE_OBJECT_PATH } from 'CydranConstants';

abstract class AbstractContextImpl<C extends Context> implements Context {

	private name: string;

	private properties: MutableProperties;

	private registry: Registry;

	private scope: Scope;

	private pathResolver: PathResolver;

	private broker: Broker;

	constructor(name: string, parent?: Context) {
		this.pathResolver = new PathResolverImpl();
		this.name = requireValid(name, "name", CONTEXT_NAME);
		this.properties = this.createProperties(parent);
		this.registry = this.createRegistry(parent);
		this.scope = this.createScope(parent);
		this.broker = new BrokerImpl();
		this.commonInit();
	}

	public addListener(callback: MessageCallback): void {
		this.broker.addListener(callback);
	}

	public removeListener(callback: MessageCallback): void {
		this.broker.removeListener(callback);
	}

	public getRoot(): Context {
		throw new Error("Method not implemented.");
	}

	public abstract isRoot(): boolean;

	public addStrategy(strategy: RegistryStrategy): Context {
		throw new Error("Method not implemented.");
	}

	public expose(id: string): Context {
		requireValid(id, "id", OBJECT_ID);

		throw new Error("Method not implemented.");
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

	public createPubSubFor(targetThis: any): PubSub {
		throw new Error("Method not implemented.");
	}

	public sendToContext(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.message(channelName, messageName, payload);
	}

	public sendToParent(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getParent().message(channelName, messageName, payload);
	}

	public sendToParents(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		let current: Context = this.getParent();

		while (!current.isRoot()) {
			current.message(channelName, messageName, payload);
			current = current.getParent();
		}

		this.getRoot().message(channelName, messageName, payload);
	}

	public sendToRoot(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getRoot().message(channelName, messageName, payload);
	}

	public abstract sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void;

	public abstract sendToDescendants(channelName: string, messageName: string, payload?: any): void;

	public sendGlobally(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getRoot().message(channelName, messageName, payload);
		this.getRoot().sendToDescendants(channelName, messageName, payload);
	}

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getBroker().send(channelName, messageName, payload);
	}

	public $release(): void {
		throw new Error("Method not implemented.");
	}

	public configure(callback: (context: Context) => void): Context {
		requireNotNull(callback, "callback");
		callback(this);

		return this;
	}

	public abstract getChild(name: string): Context;

	public abstract hasChild(name: string): boolean;

	public abstract addChild(name: string, initializer?: (context: Context) => void): Context;

	public abstract removeChild(name: string): Context;

	public getObject<T>(path: string, ...instanceArguments: any[]): T {
		requireValid(path, "path", REQUESTABLE_OBJECT_PATH);

		return this.pathResolver.resolve<T>(this, path, instanceArguments);
	}

	public getLocalObject<T>(id: string): T {
		return this.getRegistry().getLocalObject(id);
	}

	public hasRegistration(id: string): boolean {
		return this.getRegistry().hasRegistration(id);
	}

	public getProperties(): MutableProperties {
		return this.properties;
	}

	public getRegistry(): Registry {
		return this.registry;
	}

	public getScope(): Scope {
		return this.scope;
	}

	public getName(): string {
		return this.name;
	}

	public abstract getFullName(): string;

	public registerImplicit(id: string, template: string, options?: ComponentOptions): Context {
		const resolvers: ArgumentsResolversImpl = new ArgumentsResolversImpl();
		resolvers.add(new ConstantArgumentResolver(template));
		resolvers.add(new ImplicitConfigurationArgumentResolver(options));
		this.registerPrototype(id, Component, resolvers);

		return this;
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

	public tell(name: string, payload?: any): void {
		throw new Error("Method not implemented.");
	}

	public abstract getParent(): Context;

	protected abstract forParent(fn: (parent: Context) => void): void;

	protected abstract forChildren(fn: (child: C) => void): void;

	protected abstract createProperties(parent: Context): MutableProperties;

	protected abstract createRegistry(parent: Context): Registry;

	protected abstract createScope(parent: Context): Scope;

	protected getBroker(): Broker {
		return this.broker;
	}

	private commonInit(): void {
		this.getRegistry().registerPrototype("logger", LoggerAlternativeImpl, argumentsBuilder().withArgument(0).withContext().build());
	}

}

export default AbstractContextImpl;
