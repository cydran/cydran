import { Context } from "context/Context";
import { requireNotNull } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';

class ObjectArgumentResolver implements ArgumentResolver {

	private id: string;

	constructor(id: string) {
		this.id = requireNotNull(id, "id");
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
