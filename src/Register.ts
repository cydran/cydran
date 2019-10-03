interface Register {
  registerConstant(id: string, instance: any): any | void;
  registerPrototype(id: string, classInstance: any): any | void;
  registerSingleton(id: string, classInstance: any): any | void;
}

export default Register;
