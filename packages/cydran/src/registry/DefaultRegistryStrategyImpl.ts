import { requireValid, safeCydranDisposal } from "util/Utils";
import Gettable from "interface/ables/Gettable";
import SimpleMap from "interface/SimpleMap";
import RegistryStrategy from "registry/RegistryStrategy";
import Register from "registry/Register";
import Type from "interface/Type";
import Factory from "registry/factory/Factory";
import { RegistrationError } from "error/Errors";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import { Context } from "context/Context";
import { OBJECT_ID } from "CydranConstants";
import FactoryImpl from "./factory/FactoryImpl";
import FunctionalCreatorStrategyImpl from "registry/creator/FunctionalCreatorStrategyImpl";
import MemoizationCacheStrategyImpl from "registry/cache/MemoizationCacheStrategyImpl";
import ClassCreatorStrategyImpl from "registry/creator/ClassCreatorStrategyImpl";
import NoopCacheStrategyImpl from "registry/cache/NoopCacheStrategyImpl";
import ConstantCreatorStrategyImpl from "registry/creator/ConstantCreatorStrategyImpl";

const UNIQUE_EXTANT: string = "key is considered unique and already exists";

class DefaultRegistryStrategyImpl implements RegistryStrategy, Register {

	private factories: SimpleMap<Factory<any, any>>;

	private context: Context;

	constructor(context: Context) {
		this.factories = {};
		this.context = context;
	}

	public get<T>(id: string, gettable: Gettable, instanceArguments: any[] = []): T {
		requireValid(id, "id", OBJECT_ID);
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get(gettable, instanceArguments);
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

	public registerConstant(id: string, instance: any): void {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new ConstantCreatorStrategyImpl<any>(instance), new MemoizationCacheStrategyImpl<any>())
		);
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new ClassCreatorStrategyImpl<any>(classInstance), new NoopCacheStrategyImpl<any>(), resolvers)
		);

	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new FunctionalCreatorStrategyImpl<any>(factoryFn), new NoopCacheStrategyImpl<any>(), resolvers)
		);
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		requireValid(id, "id", OBJECT_ID);

		this.registerFactory(id, new FactoryImpl({}, new ClassCreatorStrategyImpl<any>(classInstance), new MemoizationCacheStrategyImpl<any>(), resolvers)
		);
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		requireValid(id, "id", OBJECT_ID);
		this.registerFactory(id, new FactoryImpl({}, new FunctionalCreatorStrategyImpl<any>(factoryFn), new MemoizationCacheStrategyImpl<any>(), resolvers)
		);
	}

	private registerFactory(id: string, factory: Factory<any, any>): void {
		requireValid(id, "id", OBJECT_ID);

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${id}' ${UNIQUE_EXTANT}`); 
			}

			this.factories[id] = factory;
		}
	}

	public $release(): void {
		for (const key in this.factories) {
			if (this.factories.hasOwnProperty(key) && this.factories[key]) {
				safeCydranDisposal(this.factories[key]);
			}
		}
	}

}

export default DefaultRegistryStrategyImpl;
