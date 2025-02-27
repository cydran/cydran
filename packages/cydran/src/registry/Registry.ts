import Register from "registry/Register";
import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Gettable from "interface/ables/Gettable";

interface Registry extends Register, Gettable {

	hasRegistration(id: string): boolean;

	registerConstant(id: string, instance: any): Registry;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): Registry;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): Registry;

	extend(context?: any): Registry;

	getLocalObject<T>(id: string): T;

	expose(id: string): Registry;

}

export default Registry;
