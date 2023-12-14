import { VALID_ID } from "Constants";
import { requireValid, requireNotNull, isDefined, safeCydranDisposal, defaulted } from "util/Utils";
import Type from "interface/Type";
import Registry from "registry/Registry";
import RegistryStrategy from "registry/RegistryStrategy";
import DefaultRegistryStrategyImpl from "registry/DefaultRegistryStrategyImpl";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Context from "context/Context";

abstract class AbstractRegistryImpl implements Registry {

	private strategies: RegistryStrategy[];

	private defaultStrategy: DefaultRegistryStrategyImpl;

	private context: Context;

	constructor(context: Context = null) {
		this.context = context;
		this.defaultStrategy = new DefaultRegistryStrategyImpl(this.context);
		this.strategies = [this.defaultStrategy];
		this.defineRegistrations();
	}

	public abstract getObject<T>(id: string, ...instanceArguments: any[]): T;

	public getLocalObject<T>(id: string, ...instanceArguments: any[]): T {
		requireValid(id, "id", VALID_ID);

		let i: number = 0;

		let instance: T = null;

		while (!isDefined(instance) && i < this.strategies.length) {
			instance = this.strategies[i].get(id, this, instanceArguments);
			i++;
		}

		return instance;
	}

	public hasRegistration(id: string): boolean {
		return this.defaultStrategy.hasRegistration(id);
	}

	public registerConstant(id: string, instance: any): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(instance, "instance");
		this.defaultStrategy.registerConstant(id, instance);
		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.defaultStrategy.registerPrototype(id, classInstance, resolvers);
		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.defaultStrategy.registerPrototypeWithFactory(id, factoryFn, resolvers);
		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.defaultStrategy.registerSingleton(id, classInstance, resolvers);
		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.defaultStrategy.registerSingletonWithFactory(id, factoryFn, resolvers);
		return this;
	}

	public addStrategy(strategy: RegistryStrategy): Registry {
		requireNotNull(strategy, "strategy");
		this.strategies.push(strategy);

		return this;
	}

	public $dispose(): void {
		for (const id in this.strategies) {
			if (this.strategies.hasOwnProperty(id) && this.strategies[id]) {
				safeCydranDisposal(this.strategies[id]);
			}
		}
	}

	public extend(context: any = null): Registry {
		return new ChildRegistryImpl(this, defaulted(context, this.context) as Context);
	}

	protected abstract defineRegistrations(): void;

	public abstract expose(id: string): Registry;

}

class RegistryImpl extends AbstractRegistryImpl {

	constructor(context: Context = null) {
		super(context);
	}

	public getObject<T>(id: string): T {
		return this.getLocalObject(id);
	}

	protected defineRegistrations(): void {
		// TODO - Implement
	}

	public expose(id: string): Registry {
		throw new Error("Method not implemented.");
	}

}

class ChildRegistryImpl extends AbstractRegistryImpl {

	private parent: AbstractRegistryImpl;

	constructor(parent: AbstractRegistryImpl, context: Context = null) {
		super(context);
		this.parent = parent;
	}

	public getObject<T>(id: string): T {
		let instance: T = this.getLocalObject(id);

		if (!isDefined(instance) && isDefined(this.parent)) {
			instance = this.parent.getObject(id);
		}

		return instance;
	}

	public expose(id: string): Registry {
		throw new Error("Method not implemented.");
	}

	protected defineRegistrations(): void {
		// Intentionally do nothing
	}

}

export default RegistryImpl;
