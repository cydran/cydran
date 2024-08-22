import { Context } from "context/Context";
import { requireNotNull } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';

class ProviderArgumentResolver implements ArgumentResolver {

	private id: string;

	constructor(id: string) {
		this.id = requireNotNull(id, "id");
	}

	public resolve(context: Context): any {
		// TODO - Support arbitrary arguments

		return () => context.getObject(this.id);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ProviderArgumentResolver;
