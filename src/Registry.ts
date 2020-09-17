import { VALID_ID } from "@/Constants";
import { requireValid, requireNotNull, removeFromBeginning, startsWith, isDefined } from "@/Utils";
import { RegistrationError } from "@/Errors";
import { Type, Module, Register, SimpleMap, RegistryStrategy, Factory, Gettable, Registry, Disposable } from "@/Interfaces";
import { PubSubImpl } from "@/Message";

class Instantiator {

	public static create<T>(classInstance: Type<T>): (...args: any[]) => T {
		const fn: (...args: any[]) => T = (...args: any[]) => {
			if (args.length === 0) {
				return new classInstance();
			}

			let argumentsCode: string = "";

			for (let i: number = 0; i < args.length; i++) {
				if (i > 0) {
					argumentsCode += ",";
				}

				argumentsCode += `arguments[1][${ i }]`;
			}

			const code: string = `'use strict'; var classInstance = arguments[0]; return new classInstance(${ argumentsCode });`;

			return Function(code).apply({}, [classInstance, args]) as T;
		};

		return fn;
	}

}

class DefaultRegistryStrategyImpl implements RegistryStrategy, Register {

	private factories: SimpleMap<Factory<any>>;

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
				throw new RegistrationError(`'${ id }' key is considered unique and already exists`);
			}

			this.factories[id] = factory;
		}
	}

	private registerFactoryUnguarded(id: string, factory: Factory<any>): void {
		requireNotNull(id, "id");

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError(`'${ id }' key is considered unique and already exists`);
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

	public registerPrototype(id: string, classInstance: Type<any>, dependencies: string[]): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.defaultStrategy.registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.defaultStrategy.registerPrototypeWithFactory(id, factoryFn, dependencies);
		return this;
	}

	public registerSingleton(id: string, classInstance: Type<any>, dependencies: string[]): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.defaultStrategy.registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(factoryFn, "factoryFn");
		this.defaultStrategy.registerSingletonWithFactory(id, factoryFn, dependencies);
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

class ConstantFactory<T> implements Factory<T> {

	private instance: T;

	constructor(instance: T) {
		this.instance = instance;
	}

	public get(gettable: Gettable): T {
		return this.instance;
	}

	public $dispose(): void {
		this.instance = null;
	}

}

abstract class AbstractFunctionalFactory<T> implements Factory<T>, Disposable {

	private fn: (args: any[]) => T;

	private dependencies: string[];

	private module: Module;

	constructor(module: Module, fn: (args: any[]) => T, dependencies: string[]) {
		this.module = module;
		this.dependencies = dependencies;
		this.fn = fn;
	}

	public abstract get(gettable: Gettable): T;

	protected create(gettable: Gettable) {
		const params: any[] = [];

		const pubSubs: PubSubImpl[] = [];

		for (const id of this.dependencies) {
			if (id === "$pubSub") {
				const pubSub: PubSubImpl = new PubSubImpl(null, this.module);
				params.push(pubSub);
				pubSubs.push(pubSub);
			} else if (startsWith(id, "$prop:")) {
				const key = removeFromBeginning(id, "$prop:");
				const value: any = this.module.getProperties().get(key);
				params.push(value);
			} else {
				const param: any = gettable.get(id);
				params.push(param);
			}
		}

		const result: T = this.fn.apply({}, params);

		for (const pubSub of pubSubs) {
			pubSub.setContext(result);
		}

		return result;
	}

	public abstract $dispose(): void;

}

class PrototypeFactory<T> extends AbstractFunctionalFactory<T> {

	constructor(module: Module, fn: (args: any[]) => T, dependencies: string[]) {
		super(module, fn, dependencies);
	}

	public get(gettable: Gettable): T {
		return this.create(gettable);
	}

	public $dispose(): void {
		// intentional no-opp
	}

}

class SingletonFactory<T> extends AbstractFunctionalFactory<T> {

	private instance: T;

	constructor(module: Module, fn: (args: any[]) => T, dependencies: string[]) {
		super(module, fn, dependencies);
		this.instance = null;
	}

	public get(gettable: Gettable): T {
		if (!this.instance) {
			this.instance = this.create(gettable);
		}

		return this.instance;
	}

	public $dispose(): void {
		const disposeFn: any = this.instance["$dispose"];
		if (isDefined(disposeFn) && (typeof disposeFn === "function")) {
			(this.instance as unknown as Disposable).$dispose();
		}
	}

}

export { Instantiator, RegistryImpl };