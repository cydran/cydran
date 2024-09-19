import ArgumentResolver from 'argument/ArgumentResolver';
import { requireNotNull } from 'util/Utils';
import { IllegalArgumentError } from "error/Errors";
import { JSType } from "CydranConstants";
import { Context } from "context/Context";

class FunctionArgumentResolver implements ArgumentResolver {

	private fn: () => any;

	constructor(fn: () => any) {
		this.fn = requireNotNull(fn, "fn");

		if (typeof this.fn !== JSType.FN) {
			throw new IllegalArgumentError("supplied argument not a function");
		}
	}

	public resolve(context: Context): any {
		const instance: any = this.fn();

		return instance;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default FunctionArgumentResolver;
