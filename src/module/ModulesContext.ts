import Module from "@/module/Module";
import Scope from "@/model/Scope";
import Type from "@/type/Type";
import ElementMediator from "@/element/ElementMediator";
import Disposable from "@/pattern/Disposable";
import { MutableProperties } from "@/properties/Interfaces";

interface ModulesContext extends Disposable {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void;

	registerSingleton(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies: string[]): void;

	registerElementMediator(name: string, supportedTags: string[], elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>): void;

	getScope(): Scope;

	get<T>(id: string): T;

	getProperties(): MutableProperties;

}

export default ModulesContext;
