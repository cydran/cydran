import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Releasable from "interface/ables/Releasable";

interface Register<R> extends Releasable {

	registerConstant(id: string, instance: any): R;

	registerPrototype(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	registerSingleton(id: string, classInstance: Type<any>, resolvers?: ArgumentsResolvers, localResolution?: boolean): R

	registerSingletonWithFactory(id: string, factoryFn: () => any, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	hasRegistration(id: string): boolean;

	expose(id: string): R;

}

export default Register;
