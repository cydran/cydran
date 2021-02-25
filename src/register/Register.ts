import Type from "interface/Type";
import Disposable from "interface/ables/Disposable";

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

	hasRegistration(id: string): boolean;
}

export default Register;
