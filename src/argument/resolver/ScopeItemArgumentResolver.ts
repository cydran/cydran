import ArgumentResolver from "argument/ArgumentResolver";
import { requireNotNull } from "util/Utils";
import ScopeImpl from "scope/ScopeImpl";
import { Context } from "context/Context";

class ScopeItemArgumentResolver implements ArgumentResolver {

	private name: string;

	constructor(name: string) {
		this.name = requireNotNull(name, "name");
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
