import Context from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';
import { requireNotNull, isDefined } from 'util/Utils';
import { IllegalArgumentError } from "error/Errors";
import JSType from "const/JSType";

type WkFunction = ReturnType<() => any>;
class FunctionArgumentResolver implements ArgumentResolver {
	private fn: WkFunction;

	constructor(fn: WkFunction) {
		this.fn = requireNotNull(fn, "fn");
		if(typeof fn !== JSType.FN) {
			throw new IllegalArgumentError("supplied argument not a funciton");
		}
	}

	public resolve(context: Context): any {
		const instance: any = (typeof this.fn === JSType.FN) ? this.fn() : null;

		return instance;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default FunctionArgumentResolver;
