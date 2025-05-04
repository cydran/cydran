import { Context } from "context/Context";
import { concat, requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";

class ProviderArgumentResolver implements ArgumentResolver<() => unknown> {

	private id: string;

	constructor(id: string) {
		this.id = requireValid(id, "id", OBJECT_ID);
	}

	public resolve(context: Context): () => unknown {
		return (...passedArguments: unknown[]) => {
			const argsToPass: unknown[] = concat([this.id], passedArguments);

			return context.getObject.apply(context, argsToPass);
		}
	}

	public postProcess(context: Context, targetObject: unknown, param: unknown): void {
		// Intentionally do nothing
	}

}

export default ProviderArgumentResolver;
