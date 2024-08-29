import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Releasable from "interface/ables/Releasable";

interface Register extends Releasable {

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void;

}

export default Register;
