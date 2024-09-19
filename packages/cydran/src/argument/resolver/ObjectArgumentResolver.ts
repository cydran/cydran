import { Context } from "context/Context";
import { requireNotNull, requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";

class ObjectArgumentResolver implements ArgumentResolver {

	private id: string;

	constructor(id: string) {
		this.id = requireValid(id, "id", OBJECT_ID);
	}

	public resolve(context: Context): any {
		const instance: any = context.getObject(this.id);

		return instance;
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ObjectArgumentResolver;
