import RegistrationError from "@/error/RegistrationError";
import ObjectUtils from "@/ObjectUtils";
import Register from "@/Register";
import { VALID_ID } from "@/ValidationRegExp";

const requireValid = ObjectUtils.requireValid;
const requireNotNull = ObjectUtils.requireNotNull;

interface Factories {

	[id: string]: Factory<any>;

}

export interface Gettable {

	get<T>(id: string): T;

}

export interface RegistryStrategy {

	get<T>(id: string, gettable: Gettable): T;

}

interface Factory<T> {

	get(gettable: Gettable): T;

}

class DefaultRegistryStrategyImpl implements RegistryStrategy, Register {

	private factories: Factories;

	constructor() {
		this.factories = {};
	}

	public get<T>(id: string, gettable: Gettable): T {
		requireValid(id, "id", VALID_ID);
		let instance: T = null;

		if (this.factories[id]) {
			instance = this.factories[id].get(gettable);
		}

		return instance;
	}

	public registerConstant(id: string, instance: any): void {
		this.registerFactory(id, new ConstantFactory(instance));
	}

	public registerPrototype(id: string, classInstance: any, dependencies: string[]): void {
		this.registerFactory(id, new PrototypeFactory(classInstance, dependencies || []));
	}

	public registerSingleton(id: string, classInstance: any, dependencies: string[]): void {
		this.registerFactory(id, new SingletonFactory(classInstance, dependencies || []));
	}

	private registerFactory(id: string, factory: Factory<any>): void {
		requireValid(id, "id", VALID_ID);

		if (id && factory) {
			if (this.factories[id]) {
				throw new RegistrationError("'%id%' key is considered unique and already exists", { "%id%": id });
			}
			this.factories[id] = factory;
		}
	}
}

export interface Registry extends Register, Gettable {

	addStrategy(strategy: RegistryStrategy): void;

}

export class RegistryImpl implements Registry {

	public static INSTANCE: RegistryImpl = new RegistryImpl();

	private strategies: RegistryStrategy[];

	private defaultStrategy: DefaultRegistryStrategyImpl;

	constructor() {
		this.defaultStrategy = new DefaultRegistryStrategyImpl();
		this.strategies = [this.defaultStrategy];
	}

	public get<T>(id: string): T {
		requireValid(id, "id", VALID_ID);
		let i: number = 0;

		let instance: T = null;

		while (!instance && i < this.strategies.length) {
			instance = this.strategies[i].get(id, this);
			i++;
		}

		return instance;
	}

	public registerConstant(id: string, instance: any): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(instance, "instance");
		this.defaultStrategy.registerConstant(id, instance);
		return this;
	}

	public registerPrototype(id: string, classInstance: any, dependencies: string[]): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.defaultStrategy.registerPrototype(id, classInstance, dependencies);
		return this;
	}

	public registerSingleton(id: string, classInstance: any, dependencies: string[]): Registry {
		requireValid(id, "id", VALID_ID);
		requireNotNull(classInstance, "classInstance");
		this.defaultStrategy.registerSingleton(id, classInstance, dependencies);
		return this;
	}

	public addStrategy(strategy: RegistryStrategy): void {
		requireNotNull(strategy, "strategy");
		this.strategies.push(strategy);
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

}

abstract class AbstractInstantableFactory<T> implements Factory<T> {

	private classInstance: any;

	private dependencies: string[];

	constructor(classInstance: any, dependencies: string[]) {
		this.dependencies = dependencies;
		this.classInstance = classInstance;
	}

	public abstract get(gettable: Gettable): T;

	protected create(gettable: Gettable) {
		const params: any[] = [];

		for (const id of this.dependencies) {
			const param: any = gettable.get(id);
			params.push(param);
		}

		const result: T = (params.length === 0) ? new this.classInstance() : this.instatiate(params);

		return result;
	}

	private instatiate(params: any[]): T {
		let args: string = "";

		for (let i: number = 0; i < params.length; i++) {
			if (i > 0) {
				args += ",";
			}

			args += "arguments[1][" + i + "]";
		}

		const code: string = '"use strict"; var classInstance = arguments[0]; return new classInstance(' + args + ");";

		return Function(code).apply({}, [this.classInstance, params]) as T;
	}

}

class PrototypeFactory<T> extends AbstractInstantableFactory<T> {

	constructor(classInstance: any, dependencies: string[]) {
		super(classInstance, dependencies);
	}

	public get(gettable: Gettable): T {
		return this.create(gettable);
	}

}

class SingletonFactory<T> extends AbstractInstantableFactory<T> {

	private instance: T;

	constructor(classInstance: any, dependencies: string[]) {
		super(classInstance, dependencies);
		this.instance = null;
	}

	public get(gettable: Gettable): T {
		if (!this.instance) {
			this.instance = this.create(gettable);
		}

		return this.instance;
	}

}
