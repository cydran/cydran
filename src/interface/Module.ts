import { PubSub, Scope, Type } from "interface/General";
import { Disposable, Nestable, Tellable } from "interface/Ables";
import { RegistryStrategy } from "interface/Strategy";
import { Logger } from "interface/Logger";
import { ElementMediator } from "interface/Element";
import { Register } from "interface/Register";
import { MutableProperties } from "interface/Property";

interface Module extends Register, Tellable {
	getName(): string;

	associate(...componentClasses: Type<Nestable>[]): Module;

	disassociate(...componentClasses: Type<Nestable>[]): Module;

	clear(): Module;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	broadcastGlobally(channelName: string, messageName: string, payload?: any): void;

	message(channelName: string, messageName: string, payload?: any): void;

	getDefaultModule(): Module;

	getModule(name: string): Module;

	expose(id: string): Module;

	get<T>(id: string): T;

	getLocal<T>(id: string): T;

	getScope(): Scope;

	hasRegistration(id: string, moduleName?: string): boolean;

	addStrategy(strategy: RegistryStrategy): Module;

	getLogger(): Logger;

	createPubSubFor(context: any): PubSub;

	getProperties(): MutableProperties;
}
interface ModulesContext extends Disposable {
	getModule(name: string): Module;

	getDefaultModule(): Module;

	forEach(fn: (instace: Module) => void): void;

	broadcast(channelName: string, messageName: string, payload?: any): void;

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerPrototypeWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies: string[]
	): void;

	registerSingleton(id: string, classInstance: Type<any>, dependencies: string[]): void;

	registerSingletonWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies: string[]
	): void;

	registerElementMediator(
		name: string,
		supportedTags: string[],
		elementMediatorClass: Type<ElementMediator<any, HTMLElement | Text, any>>
	): void;

	getScope(): Scope;

	get<T>(id: string): T;

	getProperties(): MutableProperties;
}

export { Module, ModulesContext };