import { OBJECT_ID } from 'CydranConstants';
import { requireValid, requireNotNull, isDefined, safeCydranDisposal, defaulted } from "util/Utils";
import Type from "interface/Type";
import Registry from "registry/Registry";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context } from "context/Context";
import SimpleMap from "interface/SimpleMap";
import Factory from "registry/factory/Factory";
import { RegistrationError } from "error/Errors";
import FactoryImpl from "./factory/FactoryImpl";
import FunctionalCreatorStrategyImpl from "registry/creator/FunctionalCreatorStrategyImpl";
import MemoizationCacheStrategyImpl from "registry/cache/MemoizationCacheStrategyImpl";
import ClassCreatorStrategyImpl from "registry/creator/ClassCreatorStrategyImpl";
import NoopCacheStrategyImpl from "registry/cache/NoopCacheStrategyImpl";
import ConstantCreatorStrategyImpl from "registry/creator/ConstantCreatorStrategyImpl";

const UNIQUE_EXTANT: string = "key is considered unique and already exists";

abstract class AbstractRegistryImpl implements Registry {

	private factories: SimpleMap<Factory<any, any>>;

	private context: Context;

	constructor(context: Context = null) {
		this.context = context;
		this.factories = {};
		this.defineRegistrations();
	}

	public abstract getObject<T>(id: string, instanceArguments: any[]): T;

	public getLocalObject<T>(id: string, instanceArguments: any[] = []): T {
		requireValid(id, "id", OBJECT_ID);
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get(this.context, instanceArguments);
		}

		return instance;
	}

	public hasRegistration(id: string): boolean {
		requireValid(id, "id", OBJECT_ID);

		let response: boolean = false;

		if (this.factories[id]) {
			response = true;
		}

		return response;
	}

	public registerConstant(id: string, instance: any): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new ConstantCreatorStrategyImpl<any>(instance), new MemoizationCacheStrategyImpl<any>())
		);

		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new ClassCreatorStrategyImpl<any>(classInstance), new NoopCacheStrategyImpl<any>(), resolvers)
		);

		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new FunctionalCreatorStrategyImpl<any>(factoryFn), new NoopCacheStrategyImpl<any>(), resolvers)
		);

		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", OBJECT_ID);

		this.registerFactory(id, new FactoryImpl({}, new ClassCreatorStrategyImpl<any>(classInstance), new MemoizationCacheStrategyImpl<any>(), resolvers)
		);

		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new FunctionalCreatorStrategyImpl<any>(factoryFn), new MemoizationCacheStrategyImpl<any>(), resolvers)
		);

		return this;
	}

	public $release(): void {
		for (const key in this.factories) {
			if (this.factories.hasOwnProperty(key) && this.factories[key]) {
				safeCydranDisposal(this.factories[key]);
			}
		}
	}

	public extend(context: any = null): Registry {
		return new ChildRegistryImpl(this, defaulted(context, this.context) as Context);
	}

	protected abstract defineRegistrations(): void;

	public abstract expose(id: string): Registry;

	protected registerFactory(id: string, factory: Factory<any, any>): void {
		requireValid(id, "id", OBJECT_ID);

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${id}' ${UNIQUE_EXTANT}`); 
			}

			this.factories[id] = factory;
		}
	}

}

class RegistryImpl extends AbstractRegistryImpl {

	constructor(context: Context = null) {
		super(context);
	}

	public getObject<T>(id: string, instanceArguments): T {
		return this.getLocalObject(id, instanceArguments);
	}

	protected defineRegistrations(): void {
		// TODO - Implement
	}

	public expose(id: string): Registry {
		throw new Error("Method not supported until issue #651 is implemented.");
	}

}

class ChildRegistryImpl extends AbstractRegistryImpl {

	private parent: AbstractRegistryImpl;

	constructor(parent: AbstractRegistryImpl, context: Context = null) {
		super(context);
		this.parent = parent;
	}

	public getObject<T>(id: string, instanceArguments: any[] = []): T {
		let instance: T = this.getLocalObject(id, instanceArguments);

		if (!isDefined(instance) && isDefined(this.parent)) {
			instance = this.parent.getObject(id, instanceArguments);
		}

		return instance;
	}

	public expose(id: string): Registry {
		throw new Error("Method not supported until issue #651 is implemented.");
	}

	protected defineRegistrations(): void {
		// Intentionally do nothing
	}

}

export default RegistryImpl;
