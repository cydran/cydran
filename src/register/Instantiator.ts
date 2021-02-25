import Type from "interface/Type";

class Instantiator {

	public static create<T>(classInstance: Type<T>): (...args: any[]) => T {
		const fn: (...args: any[]) => T = (...args: any[]) => {
			if (args.length === 0) {
				return new classInstance();
			}

			let argumentsCode: string = "";

			for (let i: number = 0; i < args.length; i++) {
				if (i > 0) {
					argumentsCode += ",";
				}

				argumentsCode += `arguments[1][${i}]`;
			}

			const code: string = `'use strict'; var classInstance = arguments[0]; return new classInstance(${argumentsCode});`;

			return Function(code).apply({}, [classInstance, args]) as T;
		};

		return fn;
	}
}

export default Instantiator;