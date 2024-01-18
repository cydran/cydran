import ArgumentResolver from "argument/ArgumentResolver";
import { Context } from "context/Context";

class ImplicitConfigurationArgumentResolver implements ArgumentResolver {

	private options: any;

	constructor(options: any) {
		this.options = options;
	}

	public resolve(context: Context): any {
		return this.options;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ImplicitConfigurationArgumentResolver;