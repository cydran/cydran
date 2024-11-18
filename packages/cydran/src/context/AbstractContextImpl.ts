import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import ArgumentsResolversImpl from 'argument/ArgumentsResolversImpl';
import ConstantArgumentResolver from 'argument/resolver/ConstantArgumentResolver';
import ImplicitConfigurationArgumentResolver from 'argument/resolver/ImplicitConfigurationArgumentResolver';
import Component from 'component/Component';
import ComponentOptions from 'component/ComponentOptions';
import { Context } from 'context/Context';
import Type from 'interface/Type';
import { MutableProperties } from 'properties/Property';
import Registry from 'registry/Registry';
import RegistryStrategy from 'registry/RegistryStrategy';
import Scope from 'scope/Scope';
import { defaulted, requireNotNull, requireValid } from 'util/Utils';
import ObjectPathResolver from 'context/ObjectPathResolver';
import ObjectPathResolverImpl from 'context/ObjectPathResolverImpl';
import Broker from 'message/Broker';
import BrokerImpl from 'message/BrokerImpl';
import MessageCallback from 'message/MessageCallback';
import LoggerAlternativeImpl from 'log/LoggerAlternativeImpl';
import argumentsBuilder from 'function/argumentsBuilder';
import { CONTEXT_NAME, OBJECT_ID, REQUESTABLE_OBJECT_PATH, To } from 'CydranConstants';

abstract class AbstractContextImpl<C extends Context> implements Context {

	private name: string;

	private properties: MutableProperties;

	private registry: Registry;

	private scope: Scope;

	private objectPathResolver: ObjectPathResolver;

	private broker: Broker;

	constructor(name: string, parent?: Context) {
		this.objectPathResolver = new ObjectPathResolverImpl();
		this.name = requireValid(name, "name", CONTEXT_NAME);
		this.properties = this.createProperties(parent);
		this.registry = this.createRegistry(parent);
		this.scope = this.createScope(parent);
		this.broker = new BrokerImpl();
		this.commonInit();
	}

	public addListener(thisObject: Object, callback: MessageCallback): void {
		this.broker.addListener(thisObject, callback);
	}

	public removeListener(thisObject: Object, callback: MessageCallback): void {
		this.broker.removeListener(thisObject, callback);
	}

	public abstract getRoot(): Context;

	public abstract isRoot(): boolean;

	public abstract addStrategy(strategy: RegistryStrategy): Context;

	public expose(id: string): Context {
		requireValid(id, "id", OBJECT_ID);

		throw new Error("Method not supported until issue #651 is implemented.");
	}

	public abstract addPreInitializer(thisObject: any, callback: (context?: Context) => void): void;

	public abstract addInitializer(thisObject: any, callback: (context?: Context) => void): void;

	public abstract addDisposer(thisObject: any, callback: (context?: Context) => void): void;

	public send(propagation: To, channelName: string, messageName: string, payload?: any): void {
		requireNotNull(propagation, "propagation");
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");

		switch (propagation) {
			case To.GLOBALLY:
				this.getRoot().message(channelName, messageName, payload);
				this.getRoot().send(To.DESCENDANTS, channelName, messageName, payload);
				break;

			case To.CONTEXT:
				this.message(channelName, messageName, payload);
				break;
			
			case To.DESCENDANTS:
				this.sendToDescendants(channelName, messageName, payload);
				break;
			
			case To.IMMEDIATE_CHILDREN:
				this.sendToImmediateChildren(channelName, messageName, payload);
				break;
		
			case To.PARENT:
				this.getParent().message(channelName, messageName, payload);
				break;
			
			case To.PARENTS:
				this.sendToParents(channelName, messageName, payload);
				break;
			
			case To.ROOT:
				this.getRoot().message(channelName, messageName, payload);
				break;

			default:
				throw new Error("Unsupported propagation: " + propagation);
		}
	}

	private sendToParents(channelName: string, messageName: string, payload?: any): void {
		let current: Context = this.getParent();

		while (!current.isRoot()) {
			current.message(channelName, messageName, payload);
			current = current.getParent();
		}

		this.getRoot().message(channelName, messageName, payload);
	}

	protected abstract sendToImmediateChildren(channelName: string, messageName: string, payload?: any): void;

	protected abstract sendToDescendants(channelName: string, messageName: string, payload?: any): void;

	public message(channelName: string, messageName: string, payload?: any): void {
		requireNotNull(channelName, "channelName");
		requireNotNull(messageName, "messageName");
		this.getBroker().send(channelName, messageName, payload);
	}

	public abstract $release(): void;

	public configure(callback: (context: Context) => void, thisObject: Object): Context {
		requireNotNull(callback, "callback");
		callback.call(defaulted(thisObject, {}), this);

		return this;
	}

	public abstract getChild(name: string): Context;

	public abstract hasChild(name: string): boolean;

	public abstract addChild(name: string, initializer?: (context: Context) => void): Context;

	public abstract removeChild(name: string): Context;

	public getObject<T>(path: string, ...instanceArguments: any[]): T {
		requireValid(path, "path", REQUESTABLE_OBJECT_PATH);

		return this.objectPathResolver.resolve<T>(this, path, instanceArguments);
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
		// Intentionally do nothing
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
