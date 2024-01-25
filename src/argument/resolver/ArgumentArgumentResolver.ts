import { Context } from "context/Context";
import { isDefined, requireNotNull } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';

class ArgumentArgumentResolver implements ArgumentResolver {

	private index: number;

	constructor(index: number) {
		this.index = requireNotNull(index, "index");
	}

	public resolve(context: Context, instanceArguments: any[] = []): any {
		return isDefined(instanceArguments) && isDefined(instanceArguments[this.index])
			? instanceArguments[this.index]
			: null;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ArgumentArgumentResolver;
