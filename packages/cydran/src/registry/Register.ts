import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";
import ArgumentsResolvers from "argument/ArgumentsResolvers";

interface Register extends Disposable {

	registerConstant(id: string, instance: any): void;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): void;

}

export default Register;
