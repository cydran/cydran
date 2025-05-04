import { Context } from "context/Context";
import { isDefined, requireNotNull } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';

class ArgumentArgumentResolver implements ArgumentResolver<unknown> {

	private index: number;

	constructor(index: number) {
		this.index = requireNotNull(index, "index");
	}

	public resolve(context: Context, instanceArguments: unknown[] = []): unknown {
		return isDefined(instanceArguments) && isDefined(instanceArguments[this.index])
			? instanceArguments[this.index]
			: null;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ArgumentArgumentResolver;
