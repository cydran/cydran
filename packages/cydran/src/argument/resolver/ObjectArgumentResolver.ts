import { Context } from "context/Context";
import { concat, defaulted, requireNotNull, requireValid } from "util/Utils";
import ArgumentResolver from 'argument/ArgumentResolver';
import { OBJECT_ID } from "CydranConstants";

class ObjectArgumentResolver implements ArgumentResolver {

	private id: string;

	private instanceArguments: any[];	

	constructor(id: string, instanceArguments: any[]) {
		this.id = requireValid(id, "id", OBJECT_ID);
		this.instanceArguments = defaulted(instanceArguments, []);
	}

	public resolve(context: Context): any {
		const argsToPass = concat([this.id], this.instanceArguments);

		return context.getObject.apply(context, argsToPass);
	}

	public postProcess(context: Context, targetObject: any, param: any): void {
		// Intentionally do nothing
	}

}

export default ObjectArgumentResolver;
