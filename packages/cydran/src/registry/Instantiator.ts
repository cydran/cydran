import Type from "interface/Type";
import { isDefined } from "util/Utils";

class Instantiator {

	public static create<T>(classInstance: Type<T>): (args: unknown[]) => T {
		const fn: (args: unknown[]) => T = (args: unknown[]) => {
			if (!isDefined(args) || args.length === 0) {
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
