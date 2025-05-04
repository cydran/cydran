import ArgumentResolver from 'argument/ArgumentResolver';
import { requireNotNull } from 'util/Utils';
import { IllegalArgumentError } from "error/Errors";
import { JSType } from "CydranConstants";
import { Context } from "context/Context";

class FunctionArgumentResolver implements ArgumentResolver<unknown> {

	private fn: () => unknown;

	constructor(fn: () => unknown) {
		this.fn = requireNotNull(fn, "fn");

		if (typeof this.fn !== JSType.FN) {
			throw new IllegalArgumentError("supplied argument not a function");
		}
	}

	public resolve(context: Context): unknown {
		const instance: unknown = this.fn();

		return instance;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default FunctionArgumentResolver;
