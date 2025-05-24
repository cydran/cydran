import ArgumentResolver from "argument/ArgumentResolver";
import { Context } from "context/Context";

class ImplicitConfigurationArgumentResolver implements ArgumentResolver<unknown> {

	private options: unknown;

	constructor(options: unknown) {
		this.options = options;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public resolve(context: Context): unknown {
		return this.options;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ImplicitConfigurationArgumentResolver;