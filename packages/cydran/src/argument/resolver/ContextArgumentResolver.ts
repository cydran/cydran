import { Context } from "context/Context";
import ArgumentResolver from "argument/ArgumentResolver";

class ContextArgumentResolver implements ArgumentResolver<Context> {

	public resolve(context: Context): Context {
		return context;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ContextArgumentResolver;
