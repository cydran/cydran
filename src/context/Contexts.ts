import Disposable from "interface/ables/Disposable";
import Context from "context/Context";
import Type from "interface/Type";
import Behavior from "behavior/Behavior";
import Scope from "scope/Scope";
import { MutableProperties } from 'properties/Property';
import ArgumentsResolvers from 'argument/ArgumentsResolvers';

interface Contexts extends Disposable {

	addContext(capabilityFn: (context: Context) => void): void;

	addNamedContext(name: string, capabilityFn?: (context: Context) => void): void;

	getContext(name: string): Context;

	getDefaultContext(): Context;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, resolvers: ArgumentsResolvers): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers: ArgumentsResolvers): void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers: ArgumentsResolvers): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers: ArgumentsResolvers): void;

	registerBehavior(name: string, supportedTags: string[], behaviorClass: Type<Behavior<any, HTMLElement | Text, any>>): void;

	registerBehaviorFunction(name: string, supportedTags: string[], behavionFunction: (el: HTMLElement) => Type<Behavior<any, HTMLElement | Text, any>>): void;

	getScope(): Scope;

	get<T>(id: string): T;

	getProperties(): MutableProperties;

}

export default Contexts;
