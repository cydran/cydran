interface Register {
	registerConstant(id: string, instance: any): any | void;
	registerPrototype(id: string, classInstance: any, dependencies: string[]): any | void;
	registerSingleton(id: string, classInstance: any, dependencies: string[]): any | void;
}

export default Register;
