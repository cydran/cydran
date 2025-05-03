import Type from "interface/Type";
import ArgumentsResolvers from "argument/ArgumentsResolvers";
import Releasable from "interface/ables/Releasable";

interface Register<R> extends Releasable {

	registerConstant<T>(id: string, instance: T): R;

	registerPrototype<T>(id: string, classInstance: Type<T>, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	registerPrototypeWithFactory<T>(id: string, factoryFn: () => T, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	registerSingleton<T>(id: string, classInstance: Type<T>, resolvers?: ArgumentsResolvers, localResolution?: boolean): R

	registerSingletonWithFactory<T>(id: string, factoryFn: () => T, resolvers?: ArgumentsResolvers, localResolution?: boolean): R;

	hasRegistration(id: string): boolean;

	expose(id: string): R;

}

export default Register;
