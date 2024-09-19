import { Context } from "context/Context";
import { requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";

class ProviderArgumentResolver implements ArgumentResolver {

	private id: string;

	constructor(id: string) {
		this.id = requireValid(id, "id", OBJECT_ID);
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
