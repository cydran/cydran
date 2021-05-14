import { requireNotNull, requireValid } from "util/Utils";
import { VALID_ID } from "Constants";
import Gettable from "interface/ables/Gettable";
import SimpleMap from "interface/SimpleMap";
import RegistryStrategy from "register/RegistryStrategy";
import Register from "register/Register";
import Module from "module/Module";
import Type from "interface/Type";
import Factory from "register/Factory";
import { RegistrationError } from "error/Errors";
import ConstantFactory from "register/ConstantFactory";
import Instantiator from "register/Instantiator";
import SingletonFactory from "register/SingletonFactory";
import PrototypeFactory from "register/PrototypeFactory";

class DefaultRegistryStrategyImpl implements RegistryStrategy, Register {
	
	private factories: SimpleMap<Factory<any>>;
	private readonly UNIQUE_EXTANT: string = "key is considered unique and already exists";

	private module: Module;

	constructor(module: Module) {
		this.factories = {};
		this.module = module;
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

	public registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.registerFactory(id, new PrototypeFactory(this.module, Instantiator.create(classInstance), dependencies || []));
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): void {
		this.registerFactory(id, new PrototypeFactory(this.module, factoryFn, dependencies || []));
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): void {
		this.registerFactory(id, new SingletonFactory(this.module, Instantiator.create(classInstance), dependencies || []));
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): void {
		this.registerFactory(id, new SingletonFactory(this.module, factoryFn, dependencies || []));
	}

	private registerFactory(id: string, factory: Factory<any>): void {
		requireValid(id, "id", VALID_ID);

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${id}' ${this.UNIQUE_EXTANT}`);
			}

			this.factories[id] = factory;
		}
	}

	private registerFactoryUnguarded(id: string, factory: Factory<any>): void {
		requireNotNull(id, "id");

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${id}' ${this.UNIQUE_EXTANT}`);
			}

			this.factories[id] = factory;
		}
	}

	public $dispose(): void {
		for (const key in this.factories) {
			if (this.factories.hasOwnProperty(key) && !!this.factories[key]) {
				this.factories[key].$dispose();
			}
		}
	}

}

export default DefaultRegistryStrategyImpl;
