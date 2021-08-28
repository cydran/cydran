import { VALID_ID } from "Constants";
import {
	requireValid,
	requireNotNull
} from "util/Utils";
import Type from "interface/Type";
import Module from "module/Module";
import Registry from "registry/Registry";
import RegistryStrategy from "registry/RegistryStrategy";
import DefaultRegistryStrategyImpl from "registry/DefaultRegistryStrategyImpl";
import ArgumentsResolvers from "argument/ArgumentsResolvers";

class RegistryImpl implements Registry {

	private strategies: RegistryStrategy[];

	private defaultStrategy: DefaultRegistryStrategyImpl;

	private module: Module;

	constructor(module: Module) {
		this.module = module;
		this.defaultStrategy = new DefaultRegistryStrategyImpl(this.module);
		this.strategies = [this.defaultStrategy];
	}

	public get<T>(id: string): T {
		requireNotNull(id, "id");
		let i: number = 0;

		let instance: T = null;

		while (!instance && i < this.strategies.length) {
			instance = this.strategies[i].get(id, this);
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

	public registerConstantUnguarded(id: string, instance: any): Registry {
		requireNotNull(id, "id");
		requireNotNull(instance, "instance");
		this.defaultStrategy.registerConstantUnguarded(id, instance);
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

	public addStrategy(strategy: RegistryStrategy): void {
		requireNotNull(strategy, "strategy");
		this.strategies.push(strategy);
	}

	public $dispose(): void {
		for (const id in this.strategies) {
			if (this.strategies.hasOwnProperty(id) && !!this.strategies[id]) {
				this.strategies[id].$dispose();
			}
		}
	}

}

export  default RegistryImpl;
