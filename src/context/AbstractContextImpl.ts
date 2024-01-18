import ArgumentsResolvers from 'argument/ArgumentsResolvers';
import ArgumentsResolversImpl from 'argument/ArgumentsResolversImpl';
import ConstantArgumentResolver from 'argument/resolver/ConstantArgumentResolver';
import ImplicitConfigurationArgumentResolver from 'argument/resolver/ImplicitConfigurationArgumentResolver';
import Behavior from 'behavior/Behavior';
import Component from 'component/Component';
import ComponentOptions from 'component/ComponentOptions';
import { Context, Stage } from 'context/Context';
import Type from 'interface/Type';
import PubSub from 'message/PubSub';
import { MutableProperties } from 'properties/Property';
import Registry from 'registry/Registry';
import RegistryStrategy from 'registry/RegistryStrategy';
import Scope from 'scope/Scope';
import { requireNotNull } from 'util/Utils';

abstract class AbstractContextImpl<C extends Context> implements Context {

	public getRoot(): Context {
		throw new Error("Method not implemented.");
	}

	public isRoot(): boolean {
		throw new Error("Method not implemented.");
	}

	public registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void {
		throw new Error("Method not implemented.");
	}

	public registerBehaviorFunction(name: string,
				 					supportedTags: string[],
									behaviorFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void {
		throw new Error("Method not implemented.");
	}

	public addStrategy(strategy: RegistryStrategy): Context {
		throw new Error("Method not implemented.");
	}

	public expose(id: string): Context {
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

	public message(channelName: string, messageName: string, payload?: any): void {
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

	public $dispose(): void {
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

	public abstract getStage(): Stage;

	private name: string;

	private properties: MutableProperties;

	private registry: Registry;

	private scope: Scope;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
		this.properties = this.createProperties();
		this.registry = this.createRegistry();
		this.scope = this.createScope();
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

	protected abstract createProperties(): MutableProperties;

	protected abstract createRegistry(): Registry;

	protected abstract createScope(): Scope;

}

export default AbstractContextImpl;
