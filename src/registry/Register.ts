import Type from "@/type/Type";

interface Register {

	registerConstant(id: string, instance: any): any | void;

	registerPrototype(id: string, classInstance: Type<any>, dependencies?: string[]): any | void;

	registerPrototypeWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void;

	registerSingleton(id: string, classInstance: Type<any>, dependencies?: string[]): any | void;

	registerSingletonWithFactory(id: string, factoryFn: () => any, dependencies?: string[]): any | void;

}

export default Register;
