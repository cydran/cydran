import RegistryStrategy from "registry/RegistryStrategy";
import Register from "registry/Register";
import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Gettable from "interface/ables/Gettable";

interface Registry extends Register, Gettable {

	getObject<T>(id: string): T;

	getLocalObject<T>(id: string): T;

	addStrategy(strategy: RegistryStrategy): void;

	hasRegistration(id: string): boolean;

	registerConstant(id: string, instance: any): Registry;

	registerConstantUnguarded(id: string, instance: any): Registry;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry;

	extend(context?: any): Registry;

}

export default Registry;
