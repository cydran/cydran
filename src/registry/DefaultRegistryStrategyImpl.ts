import { requireNotNull, requireValid, safeCydranDisposal } from "util/Utils";
import { VALID_ID } from "Constants";
import Gettable from "interface/ables/Gettable";
import SimpleMap from "interface/SimpleMap";
import RegistryStrategy from "registry/RegistryStrategy";
import Register from "registry/Register";
import Type from "interface/Type";
import Factory from "registry/Factory";
import { RegistrationError } from "error/Errors";
import ConstantFactory from "registry/ConstantFactory";
import Instantiator from "registry/Instantiator";
import SingletonFactory from "registry/SingletonFactory";
import PrototypeFactory from "registry/PrototypeFactory";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import ArgumentResolversBuilderImpl from "argument/ArgumentResolversBuilderImpl";
import { Context } from "context/Context";

const EMPTY_ARGUMENT_RESOLVERS: ArgumentsResolvers = new ArgumentResolversBuilderImpl().build();
const UNIQUE_EXTANT: string = "key is considered unique and already exists";

class DefaultRegistryStrategyImpl implements RegistryStrategy, Register {

	private factories: SimpleMap<Factory<any>>;

	private context: Context;

	constructor(context: Context) {
		this.factories = {};
		this.context = context;
	}

	public get<T>(id: string, gettable: Gettable): T {
		requireNotNull(id, "id");
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get(gettable);
		}

		return instance;
	}

	public hasRegistration(id: string): boolean {
		let response: boolean = false;
		if (this.factories[id]) {
			response = true;
		}
		return response;
	}

	public registerConstant(id: string, instance: any): void {
		this.registerFactory(id, new ConstantFactory(instance));
	}

	public registerConstantUnguarded(id: string, instance: any): void {
		this.registerFactoryUnguarded(id, new ConstantFactory(instance));
	}

	public registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.registerFactory(id, new PrototypeFactory(this.context, Instantiator.create(classInstance), resolvers || EMPTY_ARGUMENT_RESOLVERS));
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		this.registerFactory(id, new PrototypeFactory(this.context, factoryFn, resolvers || EMPTY_ARGUMENT_RESOLVERS));
	}

	public registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void {
		this.registerFactory(id, new SingletonFactory(this.context, Instantiator.create(classInstance), resolvers || EMPTY_ARGUMENT_RESOLVERS));
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void {
		this.registerFactory(id, new SingletonFactory(this.context, factoryFn, resolvers || EMPTY_ARGUMENT_RESOLVERS));
	}

	private registerFactory(id: string, factory: Factory<any>): void {
		requireValid(id, "id", VALID_ID);

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${id}' ${UNIQUE_EXTANT}`);
			}

			this.factories[id] = factory;
		}
	}

	private registerFactoryUnguarded(id: string, factory: Factory<any>): void {
		requireNotNull(id, "id");

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${id}' ${UNIQUE_EXTANT}`);
			}

			this.factories[id] = factory;
		}
	}

	public $dispose(): void {
		for (const key in this.factories) {
			if (this.factories.hasOwnProperty(key) && this.factories[key]) {
				safeCydranDisposal(this.factories[key]);
			}
		}
	}

}

export default DefaultRegistryStrategyImpl;
