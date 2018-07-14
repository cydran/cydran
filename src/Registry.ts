interface Factories {

	[id: string]: Factory<any>;

}

interface Factory<T> {

	get(): T;

}

export interface RegistryStrategy {

	get<T>(id: string): T;

}

class DefaultRegistryStrategyImpl implements RegistryStrategy {

	private factories: Factories;

	constructor() {
		this.factories = {};
	}

	public get<T>(id: string): T {
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get();
		}

		return instance;
	}

	private registerFactory(id: string, factory: Factory<any>): void {
		if (id && factory) {
			this.factories[id] = factory;
		}
	}

	public registerConstant(id: string, instance: any): void {
		this.registerFactory(id, new ConstantFactory(instance));
	}

	public registerPrototype(id: string, classInstance: any): void {
		this.registerFactory(id, new PrototypeFactory(classInstance));
	}

	public registerSingleton(id: string, classInstance: any): void {
		this.registerFactory(id, new SingletonFactory(classInstance));
	}

}

class RegistryImpl {

	public static INSTANCE: RegistryImpl = new RegistryImpl();

	private strategies: RegistryStrategy[];

	private defaultStrategy: DefaultRegistryStrategyImpl;

	constructor() {
		this.defaultStrategy = new DefaultRegistryStrategyImpl();
		this.strategies = [this.defaultStrategy];
	}

	public get<T>(id: string): T {
		let i: number = 0;

		let instance: T = null;

		while (!instance && i < this.strategies.length) {
			instance = this.strategies[i].get(id);
			i++;
		}

		return instance;
	}

	public registerConstant(id: string, instance: any): void {
		this.defaultStrategy.registerConstant(id, instance);
	}

	public registerPrototype(id: string, classInstance: any): void {
		this.defaultStrategy.registerPrototype(id, classInstance);
	}

	public registerSingleton(id: string, classInstance: any): void {
		this.defaultStrategy.registerSingleton(id, classInstance);
	}

	public addStrategy(strategy: RegistryStrategy): void {
		if (strategy) {
			this.strategies.push(strategy);
		}
	}

}

export class Registry {

	public static get<T>(id: string): T {
		return RegistryImpl.INSTANCE.get(id);
	}

	public static registerConstant(id: string, instance: any): void {
		RegistryImpl.INSTANCE.registerConstant(id, instance);
	}

	public static registerPrototype(id: string, classInstance: any): void {
		RegistryImpl.INSTANCE.registerPrototype(id, classInstance);
	}

	public static registerSingleton(id: string, classInstance: any): void {
		RegistryImpl.INSTANCE.registerSingleton(id, classInstance);
	}

	public static addStrategy(strategy: RegistryStrategy): void {
		RegistryImpl.INSTANCE.addStrategy(strategy);
	}
}

class ConstantFactory<T> implements Factory<T> {

	private instance: T;

	constructor(instance: T) {
		this.instance = instance;
	}

	public get(): T {
		return this.instance;
	}

}

class PrototypeFactory<T> implements Factory<T> {

	private classInstance: any;

	constructor(classInstance: any) {
		this.classInstance = classInstance;
	}

	public get(): T {
		return new this.classInstance();
	}

}

class SingletonFactory<T> implements Factory<T> {

	private classInstance: any;

	private instance: T

	constructor(classInstance: any) {
		this.classInstance = classInstance;
	}

	public get(): T {
		if (!this.instance) {
			this.instance = new this.classInstance();
		}

		return this.instance;
	}

}
