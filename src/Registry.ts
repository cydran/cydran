import RegistryStrategy from "./RegistryStrategy";
import Register from "./Register";
import { RegistrationError } from "./Errors";

interface Factories {

  [id: string]: Factory<any>;

}

interface Factory<T> {

  get(): T;

}

class DefaultRegistryStrategyImpl implements RegistryStrategy, Register {

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

  public registerConstant(id: string, instance: any): void {
    this.registerFactory(id, new ConstantFactory(instance));
  }

  public registerPrototype(id: string, classInstance: any): void {
    this.registerFactory(id, new PrototypeFactory(classInstance));
  }

  public registerSingleton(id: string, classInstance: any): void {
    this.registerFactory(id, new SingletonFactory(classInstance));
  }

  private registerFactory(id: string, factory: Factory<any>): void {
    if (id && factory) {
			if(this.factories[id]) {
				throw new RegistrationError("'" + id + "' already exists");
			}
      this.factories[id] = factory;
    }
  }
}

export interface Registry extends Register {

  get<T>(id: string): T;

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
    let i: number = 0;

    let instance: T = null;

    while (!instance && i < this.strategies.length) {
      instance = this.strategies[i].get(id);
      i++;
    }

    return instance;
  }

  public registerConstant(id: string, instance: any): Registry {
    this.defaultStrategy.registerConstant(id, instance);
    return this;
  }

  public registerPrototype(id: string, classInstance: any): Registry {
    this.defaultStrategy.registerPrototype(id, classInstance);
    return this;
  }

  public registerSingleton(id: string, classInstance: any): Registry {
    this.defaultStrategy.registerSingleton(id, classInstance);
    return this;
  }

  public addStrategy(strategy: RegistryStrategy): void {
    if (strategy) {
      this.strategies.push(strategy);
    }
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

  private instance: T;

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
