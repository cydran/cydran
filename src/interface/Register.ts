import { Gettable } from "interface/Bean";
import { RegistryStrategy } from "interface/Strategy";
import { Disposable } from "interface/Ables";
import { Type } from "interface/General";

interface SimpleMap<T> {
	[key: string]: T;
}

interface Registry extends Register, Gettable {
	addStrategy(strategy: RegistryStrategy): void;
}

interface Register extends Disposable {
	registerConstant(id: string, instance: any): any | void;

	registerPrototype(
		id: string,
		classInstance: Type<any>,
		dependencies?: string[]
	): any | void;

	registerPrototypeWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies?: string[]
	): any | void;

	registerSingleton(
		id: string,
		classInstance: Type<any>,
		dependencies?: string[]
	): any | void;

	registerSingletonWithFactory(
		id: string,
		factoryFn: () => any,
		dependencies?: string[]
	): any | void;

	hasRegistration(
		id: string
	): boolean;
}

export {
	SimpleMap,
	Register,
	Registry
};