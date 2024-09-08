import ArgumentResolver from "argument/ArgumentResolver";
import { requireValid } from "util/Utils";
import ScopeImpl from "scope/ScopeImpl";
import { Context } from "context/Context";
import { SCOPE_KEY } from "Constants";

class ScopeItemArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(key: string) {
		this.name = requireValid(key, "key", SCOPE_KEY);
	}

	public resolve(context: Context): any {
		const value: any = (context.getScope() as ScopeImpl).get(this.name);

		return value;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ScopeItemArgumentResolver;
