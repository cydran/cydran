import { OBJECT_ID } from 'CydranConstants';
import { requireValid, isDefined, safeCydranDisposal, requireNotNull } from "util/Utils";
import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context, Registry } from "context/Context";
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

	private context: Context;

	private factories: SimpleMap<Factory<any, any>>;

	constructor(context: Context) {
		this.context = requireNotNull(context, "context");
		this.factories = {};
	}

	public abstract getObject<T>(id: string, instanceArguments: any[], localContext: Context): T;

	public getLocalObject<T>(id: string, instanceArguments: any[], localContext: Context): T {
		requireValid(id, "id", OBJECT_ID);
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get(localContext, this.context, instanceArguments);
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
		this.registerFactory(id, new FactoryImpl({}, new ConstantCreatorStrategyImpl<any>(instance), new MemoizationCacheStrategyImpl<any>(), null, false)
		);

		return this;
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers, localResolution?: boolean): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new ClassCreatorStrategyImpl<any>(classInstance), new NoopCacheStrategyImpl<any>(), resolvers, localResolution)
		);

		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers, localResolution?: boolean): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new FunctionalCreatorStrategyImpl<any>(factoryFn), new NoopCacheStrategyImpl<any>(), resolvers, localResolution)
		);

		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers, localResolution?: boolean): Registry {
		requireValid(id, "id", OBJECT_ID);

		this.registerFactory(id, new FactoryImpl({}, new ClassCreatorStrategyImpl<any>(classInstance), new MemoizationCacheStrategyImpl<any>(), resolvers, localResolution)
		);

		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers, localResolution?: boolean): Registry {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new FunctionalCreatorStrategyImpl<any>(factoryFn), new MemoizationCacheStrategyImpl<any>(), resolvers, localResolution)
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

	public extend(context: Context): Registry {
		return new ChildRegistryImpl(context, this);
	}

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

	constructor(context: Context) {
		super(context);
	}

	public getObject<T>(id: string, instanceArguments, localContext: Context): T {
		return this.getLocalObject(id, instanceArguments, localContext);
	}

	public expose(id: string): Registry {
		throw new Error("Method not supported until issue #651 is implemented.");
	}

}

class ChildRegistryImpl extends AbstractRegistryImpl {

	private parent: AbstractRegistryImpl;

	constructor(context: Context, parent: AbstractRegistryImpl) {
		super(context);
		this.parent = parent;
	}

	public getObject<T>(id: string, instanceArguments: any[] = [], localContext: Context): T {
		let instance: T = this.getLocalObject(id, instanceArguments, localContext);

		if (!isDefined(instance) && isDefined(this.parent)) {
			instance = this.parent.getObject(id, instanceArguments, localContext);
		}

		return instance;
	}

	public expose(id: string): Registry {
		throw new Error("Method not supported until issue #651 is implemented.");
	}

}

export default RegistryImpl;
