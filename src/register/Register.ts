import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";
import ArgumentsResolvers from "stage/ArgumentsResolvers";

interface Register extends Disposable {

	registerConstant(id: string, instance: any): any | void;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): any | void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): any | void;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers): any | void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers): any | void;

}

export default Register;
