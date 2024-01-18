import { Context } from "context/Context";
import ArgumentResolver from "argument/ArgumentResolver";

class ContextArgumentResolver implements ArgumentResolver {

	public resolve(context: Context): any {
		return context;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ContextArgumentResolver;
