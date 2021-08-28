import Disposable from "interface/ables/Disposable";
import Module from "module/Module";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import Scope from "scope/Scope";
import { MutableProperties } from 'properties/Property';
import ArgumentsResolvers from 'argument/ArgumentsResolvers';

interface ModulesContext extends Disposable {

	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, resolvers: ArgumentsResolvers): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers: ArgumentsResolvers): void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers: ArgumentsResolvers): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers: ArgumentsResolvers): void;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	getScope(): Scope;

	get<T>(id: string): T;

	getProperties(): MutableProperties;

}

export default ModulesContext;
