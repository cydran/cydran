import { Context } from "context/Context";
import { concat, defaulted, requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";

class ProviderArgumentResolver implements ArgumentResolver {

	private id: string;

	constructor(id: string) {
		this.id = requireValid(id, "id", OBJECT_ID);
	}

	public resolve(context: Context): any {
		return (...passedArguments: any[]) => {
			const argsToPass = concat([this.id], passedArguments);

			return context.getObject.apply(context, argsToPass);
		}
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ProviderArgumentResolver;
