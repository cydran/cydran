import { Context } from "context/Context";
import { concat, requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";
import { PropertyProvider } from "CydranTypes";

class ProviderArgumentResolver implements ArgumentResolver<PropertyProvider<unknown>> {

	private id: string;

	constructor(id: string) {
		this.id = requireValid(id, "id", OBJECT_ID);
	}

	public resolve(context: Context): PropertyProvider<unknown> {
		return (...passedArguments: unknown[]) => {
			const argsToPass: unknown[] = concat([this.id], passedArguments);

			return context.getObject.apply(context, argsToPass);
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ProviderArgumentResolver;
