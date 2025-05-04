import { Context } from "context/Context";
import ArgumentResolver from 'argument/ArgumentResolver';

class ConstantArgumentResolver implements ArgumentResolver<unknown> {

	private value: unknown;

	constructor(value: unknown) {
		this.value = value;
	}

	public resolve(context: Context): unknown {
		return this.value;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ConstantArgumentResolver;
