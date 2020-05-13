import Module from "@/module/Module";
import Scope from "@/model/Scope";

interface Modules {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: any, dependencies: string[]): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void;

	registerSingleton(id: string, classInstance: any, dependencies: string[]): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void;

	registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: any): void;

	getScope(): Scope;

	get<T>(id: string): T;

}

export default Modules;
