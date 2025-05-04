import { Context } from "context/Context";
import ArgumentResolver from "argument/ArgumentResolver";

class ContextArgumentResolver implements ArgumentResolver<Context> {

	public resolve(context: Context): Context {
		return context;
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ContextArgumentResolver;
